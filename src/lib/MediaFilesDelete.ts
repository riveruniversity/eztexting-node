// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";


// Services
import * as EZService from "../service/EZTexting";
import * as Util from '../service/Util'


// Types
import { EZLogin, MultiConf, ResponseFormat} from "../types/EZTexting";
import { MediaFile, MediaFileOptions } from "../types/MediaFiles";
import { Log } from "../service/Util";
import { AttendeeWithFile } from "../rmi/Types";


// Conf
import { conf } from '../conf/curl'


export class MediaFilesDelete implements MultiConf {

	baseUrl = conf.baseUrl
	apiUrl = '/sending/files/'
	login: EZLogin;
	format: ResponseFormat = 'json';

	attendees!: AttendeeWithFile[];

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


	deleteMediaFiles(attendees: AttendeeWithFile[]): Promise<boolean> {

		console.log("🚀 deleteMediaFiles");
		
		this.attendees = attendees

		return new Promise(async (resolve, reject) => {

			const onResponseHandler = (error: Error, handle: Easy, errorCode: CurlCode) => {
				const responseCode = handle.getInfo("RESPONSE_CODE").data;
				const handleUrl = handle.getInfo("EFFECTIVE_URL");
				const handleIndex: number = this.handles.indexOf(handle);
				const handleData: Buffer[] = this.handlesData[handleIndex];
				const handlePhone: string | any = this.attendees[handleIndex].phone;
			
				console.log("🗑️  media file: " + handleIndex);
				//console.log(`🔗 handleUrl:`, handleUrl.data)
			
				if (error) {
					console.log(handlePhone +	' returned error: "' +	error.message +	'" with errcode: ' + errorCode);
					//_console.log(error)
		
					var log: Log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message}
					Util.logStatus(log)
		
				} else {
		
					//r let responseData: string = '';
					//r for (let i = 0; i < handleData.length; i++) {
					//r 	responseData += handleData[i].toString();
					//r }
					//r const json = JSON.parse(responseData.substring(4)) // remove preceding 'null'
		
					const responseData: string = handleData.join().toString();

					console.log(`↩️ `, responseData)
					console.log(handlePhone + " returned response code: ", responseCode);
	

					if(responseCode == 204) {
						var log: Log = { status: 'Success', location: 'delete_media', phone: handlePhone, message: 'Deleted'}
					}
					else {
						const json = JSON.parse(responseData);
						var log: Log = { status: 'Error', location: 'delete_media', phone: handlePhone, message: responseCode + ' ' + responseData}
					}

					Util.logStatus(log)
				}

			
				console.log("# of handles active: " + this.multi.getCount());

				// we are done with this handle, remove it from the Multi instance and close it
				this.multi.removeHandle(handle);
				handle.close();
			
				// >>> All finished
				if (++this.finished === this.attendees.length) {
					console.log("🚁 finished creating all media files!");
					resolve(true)

					// remember to close the multi instance too, when you are done with it.
					this.multi.close();
				}
			}

			this.multi.onMessage(onResponseHandler);
		
			for (let i in attendees) {
				this.setCurlOptions(attendees[i].file, +i)
				await Util.sleep(300)
			}
		})
	}

	private setCurlOptions(fileId: number, i: number) {
		const handle = new Easy();
		handle.setOpt(Curl.option.URL, this.baseUrl + this.apiUrl + fileId + "?format=" + this.format + `&handle=${i}&_method=DELETE`);
		handle.setOpt(Curl.option.POST, true);
		//[]handle.setOpt(Curl.option.CUSTOMREQUEST, "DELETE");
		handle.setOpt(Curl.option.POSTFIELDS, this.createPostData());
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

	private createPostData() {
	
		const postLogin: EZLogin = EZService.checkLoginInfo();
        return `User=${postLogin.User}&Password=${postLogin.Password}`
	}
}