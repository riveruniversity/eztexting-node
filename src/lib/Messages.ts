// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";

// Services
import * as EZService from "../service/EZTexting";
import * as Util from '../service/Util'
import { setMessageParams } from '../service/Messages';

// Types
import { EZLogin, MultiCurlConf } from "../types/EZTexting";
import { Message, PostData } from "../types/Messages";
import { Log } from "../service/Util";

// Conf
import { conf } from '../conf/curl'
import { Contact } from "../types/Contacts"


export class Messages implements MultiCurlConf {

	baseUrl = conf.baseUrl
	apiUrl = '/messages'
	login: string;

	messages: Message[] = [];
	contacts: Contact[] = [];

	multi: Multi;
    handles: Easy [] = [];
	handlesData: Buffer[] | any = [];
	finished: number = 0;

	callbacks: Function[] = [];
	callback: boolean = false;

	constructor() {
		EZService.initDotenv();

		this.login = EZService.getAuth();
		this.multi = new Multi();
	}
	//: _________________________________________


	sendMessage (message: Message, attendee: Contact, callback: Function): void {
		
		const count = this.messages.push(message);
		this.contacts.push(attendee);
		
		console.log("🚀", count -1, "sendMessage ", attendee.barcode);


		if (callback) {
			this.callback = true
			this.callbacks.push(callback)
		}

		this.multi.onMessage(this.onResponseHandler);
		
		//* start the request
		this.setCurlOptions(message, count-1)
	}
	//: -----------------------------------------


	private onResponseHandler = async (error: Error, handle: Easy, errorCode: CurlCode) => {
		const responseCode = handle.getInfo("RESPONSE_CODE").data;
		const handleUrl = handle.getInfo("EFFECTIVE_URL");
		const handleIndex: number = this.handles.indexOf(handle);
		const handleData: Buffer[] = this.handlesData[handleIndex];
		const handlePhone: string | any = this.messages[handleIndex].toNumbers;
	
		console.log("🛬", handleIndex, "sendMessage returned: ", responseCode);
		//i console.log("📞  Phone: ", handlePhone);
		//i console.log("📨  message: ", handleIndex);
		//_console.log(`🔗  handleUrl:`, handleUrl.data)
		console.log("💠  active message handles: ", this.multi.getCount());
	
		// remove completed from the Multi instance and close it
		this.multi.removeHandle(handle);
		handle.close();
	
		if (!error) {
			const responseData: string = handleData.join().toString();

			if(responseCode == 201 || responseCode == 200) {
				var log: Log = { status: 'Success', location: 'messages', phone: handlePhone, message: responseCode.toString(), id: this.contacts[handleIndex].barcode}
			}
			else if(responseCode == 502) {
				console.log(`↩️ `, responseData)
				var log: Log = { status: 'Error', location: 'messages', phone: handlePhone, message: responseData, id: this.contacts[handleIndex].barcode}
			}
			else {
				console.log(`↩️ `, responseData)
				const json = JSON.parse(responseData);
				var log: Log = { status: 'Error', location: 'messages', phone: handlePhone, message: json, id: this.contacts[handleIndex].barcode}
			}
		} 
		else {
			console.log(handlePhone +	' returned error: "' +	error.message +	'" with errcode: ' + errorCode);
			var log: Log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message, id: this.contacts[handleIndex].barcode}
		}
		Util.logStatus(log)
	

		//* return
		if (this.callback) {
			const isError = log.status != 'Success' ? log : false;
			const callback = this.callbacks[handleIndex]
			callback(this.messages[handleIndex], isError)
		}

		// Wait for more requests before closing 
		await Util.sleep(10000)
		
		// >>> All finished
		if (++this.finished === this.messages.length) {
			console.log("🚁 finished sending all messages!");

			this.multi.close();
		}
	}
	//: -----------------------------------------


	private setCurlOptions(message: Message, i: number) {

		const handle = new Easy();
		handle.setOpt(Curl.option.URL, this.baseUrl + this.apiUrl + `?handle=${i}`);
		handle.setOpt(Curl.option.POST, true);
		handle.setOpt(Curl.option.HTTPHEADER, ['Content-Type: application/json', `Authorization: ${EZService.getAuth()}`]);
		handle.setOpt(Curl.option.POSTFIELDS, this.createPostData(message));
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


	private createPostData(message: Message) {

		const postMessage: Message  = setMessageParams(message);
		return JSON.stringify(postMessage);
	}
}