// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";

// Services
import * as EZService from "../service/EZTexting";
import * as Util from '../service/Util'

// Types
import { EZLogin, MultiCurlConf, ResponseFormat} from "../types/EZTexting";
import { MediaFile, MediaFileOptions } from "../types/MediaFiles";
import { Log } from "../service/Util";
import { Attendee } from "../rmi/Types";


// Conf
import { conf } from '../conf/curl'


export class MediaFilesCreate implements MultiCurlConf {

	baseUrl = conf.baseUrl
	apiUrl = '/sending/files?format='
	format: ResponseFormat;
	login: EZLogin;

	attendees: Attendee[] = [];

	multi: Multi;
    handles: Easy [] = [];
	handlesData: Buffer[] | any = [];
	finished: number = 0;

	callbacks: Function[] = [];
	callback: boolean = false;


	constructor(format: ResponseFormat = 'json') {
		EZService.initDotenv();

		this.login = EZService.checkLoginInfo();
		
		this.format = format
		this.multi = new Multi();
	}
	//: _________________________________________


	createMediaFile(attendee: Attendee , params: MediaFileOptions, callback?: Function): void {

		const count = this.attendees.push(attendee);
		if (callback) {
			this.callback = true
			this.callbacks.push(callback)
		}
		
		this.multi.onMessage(this.responseHandler);

		let source = `${params.url + this.attendees[count-1].barcode}.${params.filetype}`

		//* start the request
		this.setCurlOptions(source, count-1) 
	}
	//: -----------------------------------------


	private responseHandler = (error: Error, handle: Easy, errorCode: CurlCode) => {
		const responseCode = handle.getInfo("RESPONSE_CODE").data;
		const handleUrl = handle.getInfo("EFFECTIVE_URL");
		const handleIndex: number = this.handles.indexOf(handle);
		const handleData: Buffer[] = this.handlesData[handleIndex];
		const handlePhone: string | any = this.attendees[handleIndex].phone;
	
		console.log("🚀  createMediaFile returned: ", responseCode);
		console.log("📞  Phone: ", handlePhone);
		console.log("☁️  media file: ", handleIndex);
		//_console.log(`🔗  handleUrl:`, handleUrl.data)
		console.log("#️⃣  of handles active: ", this.multi.getCount());
	
		// remove completed from the Multi instance and close it
		this.multi.removeHandle(handle);
		handle.close();
	
		if (!error) {
			const responseData: string = handleData.join().toString();
			console.log(`↩️ `, responseData)

			if(responseCode == 201 || responseCode == 200) {
				const json = JSON.parse(responseData);
				const mediaFile: MediaFile = json.Response.Entry;
				var log: Log = { status: 'Success', location: 'create_media', phone: handlePhone, message: mediaFile.ID.toString()}

				// Add new File ID to Attendees Array
				this.attendees[handleIndex].file = mediaFile.ID
			}
			else 
				var log: Log = { status: 'Error', location: 'create_media', phone: handlePhone, message: responseData}

		} 
		else {
			console.log(handlePhone, ' returned error: "',	error.message, '" with errorcode: ', errorCode);
			var log: Log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message}
			
			if (this.callback) {
				const callback = this.callbacks[handleIndex]
				callback(this.attendees[handleIndex], log)
			}
		}  

		Util.logStatus(log)
	
		// >>> All finished
		if (++this.finished === this.attendees.length) {
			console.log("🚁 finished creating all media files!");

			this.multi.close();
		}

		//* return
		if (this.callback) {
			const callback = this.callbacks[handleIndex]
			callback(this.attendees[handleIndex])
		}
	}
	//: -----------------------------------------

	
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
	//: -----------------------------------------


	private onDataHandler (handle: Easy, data: Buffer, size: number, nmemb: number) {

		const key = this.handles.indexOf(handle);
		this.handlesData[key].push(data);

		//_console.log("onDataHandler: =======================")
		//_console.log("#️⃣  handle: ", key)
		//_console.log("🗄️  data: ", data)
	
		return size * nmemb;
	}
	//: -----------------------------------------
	

	private createPostData(source: string) {
	
		const postLogin: EZLogin = EZService.checkLoginInfo();
        return `User=${postLogin.User}&Password=${postLogin.Password}&Source=${source}`
	}
}