// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";


// Modules
import { Messages } from "./Messages";
import { Message } from "../types/Messages";

import { MediaFilesDelete } from './MediaFilesDelete' 

// Services
import * as EZService from "../service/EZTexting";
import * as Util from '../service/Util'


// Types
import { EZLogin, MultiCurlConf, ResponseFormat} from "../types/EZTexting";
import { MediaFile, MediaFileOptions } from "../types/MediaFiles";
import { Log } from "../service/Util";
import { Attendee, AttendeeWithFile } from "../rmi/Types";


// Conf
import { conf } from '../conf/curl'


export class MediaFiles implements MultiCurlConf {

	baseUrl = conf.baseUrl
	apiUrl = '/sending/files?format='
	login: EZLogin;
	format: ResponseFormat = 'json';

	attendeesList: Attendee[] = [];
	attendeesChunk: AttendeeWithFile[] = [];


	multi: Multi;
    handles: Easy [] = [];
	handlesData: Buffer[] | any = [];
	finished: number = 0;

	constructor(format: ResponseFormat) {
		EZService.initDotenv();

		this.login = EZService.checkLoginInfo();
		
		this.format = format
		this.multi = new Multi();
	}


	createMediaFiles(attendees: Attendee[] , params: MediaFileOptions, timestamp: any): Promise<Attendee[]> {

		console.log("🚀 createMediaFiles");

		this.attendeesList = attendees

		return new Promise(async (resolve, reject) => {

			const onResponseHandler = (error: Error, handle: Easy, errorCode: CurlCode) => {
				const responseCode = handle.getInfo("RESPONSE_CODE").data;
				const handleUrl = handle.getInfo("EFFECTIVE_URL");
				const handleIndex: number = this.handles.indexOf(handle);
				const handleData: Buffer[] = this.handlesData[handleIndex];
				const handlePhone: string | any = this.attendeesList[handleIndex].phone;
			
				console.log("☁️  media file: ", handleIndex);
				//console.log(`🔗 handleUrl:`, handleUrl.data)

				var attendee = this.attendeesList[handleIndex];
			
				if (error) {
					console.log(handlePhone +	' returned error: "' +	error.message +	'" with errcode: ' + errorCode);
					//_console.log(error)
		
					var log: Log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message}
					Util.logStatus(log)
		
				} else {
		
					const responseData: string = handleData.join().toString();

					console.log(handlePhone + " returned response code: ", responseCode);
					console.log(`↩️ `, responseData)
		
					if(responseCode == 201 || responseCode == 200) {
						const json = JSON.parse(responseData);
						const mediaFile: MediaFile = json.Response.Entry;
						var log: Log = { status: 'Success', location: 'create_media', phone: handlePhone, message: mediaFile.ID.toString()}

						// Add to Attendees Array
						this.attendeesChunk.push({...this.attendeesList[handleIndex], ...{file: mediaFile.ID}})
					}
					else {
						console.log(this.attendeesList[handleIndex].barcode);
						
						var log: Log = { status: 'Error', location: 'create_media', phone: handlePhone, message: responseData}
					}
					
					Util.logStatus(log)
				}


				console.log("# of handles active: " + this.multi.getCount());
			
				// we are done with this handle, remove it from the Multi instance and close it
				this.multi.removeHandle(handle);
				handle.close();
			
				// >>> All finished
				if (++this.finished === this.attendeesList.length) {
					console.log("🚁 finished creating all media files!");
					resolve(this.attendeesList)

					// remember to close the multi instance too, when you are done with it.
					this.multi.close();
				}
			}

			this.multi.onMessage(onResponseHandler);
		
			for (let i in attendees) {

				let source = `${params.url + attendees[i].barcode}.${params.filetype}`
				this.setCurlOptions(source, +i)
				await Util.sleep(300)

				// If 200 reached or list ended
				if(+i % 200 == 199 || +i == attendees.length-1) {

					var log: Log = { status: 'Log', location: 'messages', phone: '', message: 'Waiting for 200 messages to be sent and files deleted.'}
					Util.logStatus(log)

					// wait 10 seconds for all requests to return
					await Util.sleep(10000)

					await this.createMessages(this.attendeesChunk, timestamp) //! SET TIMESTAMP IN masstext.ts
					this.attendeesChunk = []
				}
			}
		})
	}

	
	private setCurlOptions(source: string, i: number) {
		const handle = new Easy();
		handle.setOpt(Curl.option.URL, this.baseUrl + this.apiUrl + this.format + `&handle=${i}`);
		handle.setOpt(Curl.option.POST, true);
		handle.setOpt(Curl.option.POSTFIELDS, this.createPostData(source));
		handle.setOpt(Curl.option.CAINFO, EZService.getCertificate());
		handle.setOpt(Curl.option.FOLLOWLOCATION, true);
		handle.setOpt(Curl.option.WRITEFUNCTION, (data: Buffer, size: number, nmemb: number) => {
			return this.onDataHandler(handle, data, size, nmemb)
		});
	
		this.handlesData.push([]);
		this.handles.push(handle);
		this.multi.addHandle(handle);
	}


	private onDataHandler (handle: Easy, data: Buffer, size: number, nmemb: number) {

		const key = this.handles.indexOf(handle);
		this.handlesData[key].push(data);

		/*
		console.log("onDataHandler: =======================")
	
		console.log("#️⃣  handle: ", key)
		console.log("🗄️  data: ", data)
		*/
	
		return size * nmemb;
	}

	private createPostData(source: string) {
	
		const postLogin: EZLogin = EZService.checkLoginInfo();
        return `User=${postLogin.User}&Password=${postLogin.Password}&Source=${source}`
	}


	async createMessages(attendees: AttendeeWithFile[], timestamp: string) {

		const messages = new Messages(this.format)

		const individualMessages: Message[] = []

		return new Promise<void>(async (resolve, reject) => {
	
			for(let i in attendees) {
		
				const attendee = attendees[i]
		
				if(!attendee.fam) 
					var message = `Good afternoon ${attendee.name}. When you arrive at the conference, show your fastpass at the registration.`
				else
					var message = `${attendee.name}'s fast pass`
		
				individualMessages.push({PhoneNumbers: attendee.phone, StampToSend: timestamp, MessageTypeID: '3', Message: message, FileID: attendee.file});
			}
		
			await messages.sendMessages(individualMessages, 'callback')
			if(attendees.length < 10) await Util.sleep(10000)
			await this.deleteMediaFiles(attendees);
			resolve();
		})
	}


	async deleteMediaFiles(attendees: AttendeeWithFile[]) {

		const media = new MediaFilesDelete(this.format);

		const individualMessages: Message[] = []

		return new Promise<void>(async (resolve, reject) => {

			await media.deleteMediaFiles(attendees)
			resolve()
		})
	}

}