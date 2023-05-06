// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";

// Services
import * as EZService from "../service/EZTexting";
import * as Util from '../service/Util'

// Types
import { EZLogin, MultiCurlConf, ResponseFormat} from "../types/EZTexting";
import { MediaFile, MediaFileOptions } from "../types/MediaFiles";
import { Log } from "../service/Util";
import { Contact } from "../types/Contacts"


// Conf
import { conf } from '../conf/curl'


export class MediaFilesCreate implements MultiCurlConf {

	baseUrl = conf.baseUrl
	apiUrl = '/sending/files'
	format: ResponseFormat;
	login: EZLogin;

	contacts: Contact[] = [];

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


	createMediaFile(attendee: Contact , params: MediaFileOptions, callback?: Function): void {

		const count = this.contacts.push(attendee);
		console.log("🚀", count -1, "createMediaFile " , attendee.barcode);

		if (callback) {
			this.callback = true
			this.callbacks.push(callback)
		}
		
		this.multi.onMessage(this.responseHandler);

		let source = `${params.url + this.contacts[count-1].barcode}.${params.filetype}`

		//* start the request
		this.setCurlOptions(source, count-1) 
	}
	//: -----------------------------------------


	private responseHandler = async (error: Error, handle: Easy, errorCode: CurlCode) => {
		const responseCode = handle.getInfo("RESPONSE_CODE").data;
		const handleUrl = handle.getInfo("EFFECTIVE_URL");
		const handleIndex: number = this.handles.indexOf(handle);
		const handleData: Buffer[] = this.handlesData[handleIndex];
		const handlePhone: string | any = this.contacts[handleIndex].phone;
	
		console.log("🛬", handleIndex, "createMediaFile returned: ", responseCode);
		//i console.log("📞  Phone: ", handlePhone);
		//i console.log("☁️  media file: ", handleIndex);
		//_console.log(`🔗  handleUrl:`, handleUrl.data)
		console.log("💠  active create handles: ", this.multi.getCount());
	
		// remove completed from the Multi instance and close it
		this.multi.removeHandle(handle);
		handle.close();
	
		if (!error) {
			const responseData: string = handleData.join().toString();

			if(responseCode == 201 || responseCode == 200) {
				const json = JSON.parse(responseData);
				const mediaFile: MediaFile = json.Response.Entry;
				var log: Log = { status: 'Success', location: 'create_media', phone: handlePhone, message: 'File: ' + mediaFile.ID.toString(), id: this.contacts[handleIndex].barcode}

				// Add new File ID to Attendees Array
				this.contacts[handleIndex].file = mediaFile.ID
			}
			else {
				console.log(`↩️ `, responseData)
				var log: Log = { status: 'Error', location: 'create_media', phone: handlePhone, message: responseData, id: this.contacts[handleIndex].barcode}
			}
				

		} 
		else {
			console.log(handlePhone, ' returned error: "',	error.message, '" with errorcode: ', errorCode);
			var log: Log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message, id: this.contacts[handleIndex].barcode}
		}  
		Util.logStatus(log)


		//* return
		if (this.callback) {
			const isError = log.status != 'Success' ? log : false;
			const callback = this.callbacks[handleIndex]
			callback(this.contacts[handleIndex], isError)
		}

		// Wait for more requests before closing 
		await Util.sleep(10000)
	
		// >>> All finished
		if (++this.finished === this.contacts.length) {
			console.log("🚁 finished creating all media files!");

			this.multi.close();
		}
	}
	//: -----------------------------------------

	
	private setCurlOptions(source: string, i: number) {

		const handle = new Easy();
		handle.setOpt(Curl.option.URL, this.baseUrl + this.apiUrl + '?format=' + this.format + `&handle=${i}`);
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