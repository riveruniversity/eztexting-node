// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";


// Services
import * as EZService from "../service/EZTexting";
import * as Util from '../service/Util'


// Types
import { EZLogin, MultiConf, ResponseFormat} from "../types/EZTexting";
import { MediaFile, MediaFileOptions } from "../types/MediaFiles";
import { Log } from "../service/Util";
import { Attendee } from "../rmi/Types";


// Conf
import { conf } from '../conf/curl'


export class MediaFiles implements MultiConf {

	baseUrl = conf.baseUrl
	apiUrl = '/sending/files?format='
	login: EZLogin;
	format: ResponseFormat = 'json';

	attendees!: Attendee[];

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


	createMediaFiles(attendees: Attendee[] , params: MediaFileOptions): Promise<Attendee[]> {

		console.log("🚀 createMediaFiles");
		
		this.attendees = attendees

		return new Promise((resolve, reject) => {

			const onResponseHandler = (error: Error, handle: Easy, errorCode: CurlCode) => {
				const responseCode = handle.getInfo("RESPONSE_CODE").data;
				const handleUrl = handle.getInfo("EFFECTIVE_URL");
				const handleIndex: number = this.handles.indexOf(handle);
				const handleData: Buffer[] = this.handlesData[handleIndex];
				const handlePhone: string | any = this.attendees[handleIndex].phone;
			
				console.log("# of handles active: " + this.multi.getCount());
				console.log("☁️  media file: " + handleIndex);
				console.log(`🔗 handleUrl:`, handleUrl.data)
			
				if (error) {
					console.log(handlePhone +	' returned error: "' +	error.message +	'" with errcode: ' + errorCode);
					//_console.log(error)
		
					var log: Log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message}
					Util.logStatus(log)
					this.attendees[handleIndex].file = 0
		
				} else {
		
					//r let responseData: string = '';
					//r for (let i = 0; i < handleData.length; i++) {
					//r 	responseData += handleData[i].toString();
					//r }
					//r const json = JSON.parse(responseData.substring(4)) // remove preceding 'null'
		
					const responseData: string = handleData.join().toString();
					const json = JSON.parse(responseData);

					console.log(`↩️ `, responseData)
					console.log(handlePhone + " returned response code: ", responseCode);
	
		
					if(responseCode == 201 || responseCode == 200) {
						const mediaFile: MediaFile = json.Response.Entry;
						this.attendees[handleIndex].file = mediaFile.ID
						var log: Log = { status: 'Success', location: 'media_files', phone: handlePhone, message: mediaFile.ID.toString()}
					}
					else {
						this.attendees[handleIndex].file = 0;
						var log: Log = { status: 'Error', location: 'media_files', phone: handlePhone, message: json.Response.Errors}
					}
					
					Util.logStatus(log)
				}

			
				// we are done with this handle, remove it from the Multi instance and close it
				this.multi.removeHandle(handle);
				handle.close();
			
				// >>> All finished
				if (++this.finished === this.attendees.length) {
					console.log("🚁 finished creating all media files!");
					resolve(this.attendees)

					// remember to close the multi instance too, when you are done with it.
					this.multi.close();
				}
			}

			this.multi.onMessage(onResponseHandler);
		
			for (let i in attendees) {
				let source = `${params.url + attendees[i].barcode}.${params.filetype}`
				this.setCurlOptions(source, +i)
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
}