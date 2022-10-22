// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";

// Services
import * as EZService from "../service/EZTexting";
import * as Util from '../service/Util'

// Types
import { EZLogin, MultiCurlConf, ResponseFormat} from "../types/EZTexting";
import { Message, MessageWithFile } from "../types/Messages";
import { Log } from "../service/Util";


// Conf
import { conf } from '../conf/curl'


export class MediaFilesDelete implements MultiCurlConf {

	baseUrl = conf.baseUrl
	apiUrl = '/sending/files/'
	login: EZLogin;
	format: ResponseFormat = 'json';

	messages: Message[] = [];

	multi: Multi;
    handles: Easy [] = [];
	handlesData: Buffer[] | any = [];
	finished: number = 0;

	callbacks: Function[] = [];
	callback: boolean = false;

	constructor(format: ResponseFormat) {
		EZService.initDotenv();

		this.login = EZService.checkLoginInfo();
		
		this.format = format
		this.multi = new Multi();
	}
	//: _________________________________________


	deleteMediaFile(message: MessageWithFile, callback?: Function): void {
		
		let count = this.messages.push(message);

		if (callback) {
			this.callback = true
			this.callbacks.push(callback)
		}

		this.multi.onMessage(this.responseHandler);
		this.setCurlOptions(message.FileID, count-1)
	}
	//: -----------------------------------------


	private responseHandler = (error: Error, handle: Easy, errorCode: CurlCode) => {
		const responseCode = handle.getInfo("RESPONSE_CODE").data;
		const handleUrl = handle.getInfo("EFFECTIVE_URL");
		const handleIndex: number = this.handles.indexOf(handle);
		const handleData: Buffer[] = this.handlesData[handleIndex];
		const handlePhone: string | any = this.messages[handleIndex].PhoneNumbers;
	
		console.log("🚀  deleteMediaFile returned: ", responseCode);
		console.log("📞  Phone: ", handlePhone);
		console.log("🗑️  media file: ", handleIndex);
		//_console.log(`🔗 handleUrl:`, handleUrl.data)
		console.log("#️⃣  of handles active: ", this.multi.getCount());

		// remove completed from the Multi instance and close it
		this.multi.removeHandle(handle);
		handle.close();
	
		if (!error) {
			const responseData: string = handleData.join().toString();
			console.log(`↩️ `, responseData)

			if(responseCode == 204) {
				var log: Log = { status: 'Success', location: 'delete_media', phone: handlePhone, message: 'Deleted'}
			}
			else
				var log: Log = { status: 'Error', location: 'delete_media', phone: handlePhone, message: responseCode + ' ' + responseData}

		}
		else {
			console.log(handlePhone + ' returned error: "' +	error.message +	'" with errorcode: ' + errorCode);
			var log: Log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message}
		}

		Util.logStatus(log)
	
		// >>> All finished
		if (++this.finished === this.messages.length) {
			console.log("🚁 finished deleting all media files!");

			this.multi.close();
		}

		//* return
		if (this.callback) {
			const callback = this.callbacks[handleIndex]
			callback(this.messages[handleIndex])
		}
	}
	//: -----------------------------------------


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


	private createPostData() {
	
		const postLogin: EZLogin = EZService.checkLoginInfo();
        return `User=${postLogin.User}&Password=${postLogin.Password}`
	}
}