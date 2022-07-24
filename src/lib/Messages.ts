// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";

// Services
import * as EZService from "../service/EZTexting";
import * as Util from '../service/Util'
import { setMessageParams } from '../service/Messages';

// Types
import { EZLogin, MultiConf, ResponseFormat} from "../types/EZTexting";
import { Message, PostData } from "../types/Messages";
import { Log } from "../service/Util";

// Conf
import { conf } from '../conf/curl'


export class Messages implements MultiConf {

	baseUrl = conf.baseUrl
	apiUrl = '/sending/messages?format='
	login: EZLogin;

	format: ResponseFormat = 'json';
	messages: Message[] = [];

	multi: Multi;
    handles: Easy [] = [];
	handlesData: Buffer[] | any = [];
	finished: number = 0;

	constructor(format: ResponseFormat) {
		EZService.initDotenv();

		this.login = EZService.checkLoginInfo();
		
		this.format = format
		this.multi = new Multi();
		this.multi.onMessage(this.onResponseHandler);
	}


	sendMessages (messages: Message[] , callback: any) {

		console.log("🚀 sendMessage");
		
		this.messages = messages
		
		for (let i in messages) {
			this.setCurlOptions(messages[i], +i)
		}

	}

	private setCurlOptions(message: Message, i: number) {
		const handle = new Easy();
		handle.setOpt(Curl.option.URL, this.baseUrl + this.apiUrl + this.format + `&handle=${i}`);
		handle.setOpt(Curl.option.POST, true);
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


	private onResponseHandler = (error: Error, handle: Easy, errorCode: CurlCode) => {
		const responseCode = handle.getInfo("RESPONSE_CODE").data;
		const handleUrl = handle.getInfo("EFFECTIVE_URL");
		const handleIndex: number = this.handles.indexOf(handle);
		const handleData: Buffer[] = this.handlesData[handleIndex];
		const handlePhone: string | any = this.messages[handleIndex].PhoneNumbers;
	
	
		console.log("# of handles active: " + this.multi.getCount());
		console.log("📨  message: " + handleIndex);
		console.log(`🔗 handleUrl:`, handleUrl.data)
	
		if (error) {
			console.log(handlePhone +	' returned error: "' +	error.message +	'" with errcode: ' + errorCode);
			//_console.log(error)

			var log: Log = { status: 'Error', location: 'messages', phone: handlePhone, message: error.message}
			Util.logStatus(log)

		} else {

			const responseData: string = handleData.join().toString();
			const json = JSON.parse(responseData);

			console.log(`↩️ `, responseData)
			console.log(handlePhone + " returned response code: ", responseCode);
			

			if(responseCode == 201 || responseCode == 200) 
				var log: Log = { status: 'Success', location: 'messages', phone: handlePhone, message: ''}
			else
				var log: Log = { status: 'Error', location: 'messages', phone: handlePhone, message: json.Response.Errors}

			Util.logStatus(log)
		}
	
		// we are done with this handle, remove it from the Multi instance and close it
		this.multi.removeHandle(handle);
		handle.close();
	
		// >>> All finished
		if (++this.finished === this.messages.length) {
			console.log("🚁 all messages sent out!");
			// remember to close the multi instance too, when you are done with it.
			this.multi.close();
		}
	}

	private onDataHandler (handle: Easy, data: Buffer, size: number, nmemb: number) {

		/*
		console.log("\nonDataHandler: =======================")
	
		console.log("#️⃣  handle: ")
		console.log(key)
	
		console.log("🗄️  data: ")
		console.log(data)
		*/

		const key = this.handles.indexOf(handle);
		this.handlesData[key].push(data);
	
		return size * nmemb;
	}

	private createPostData(message: Message) {
	
		const postLogin: EZLogin = EZService.checkLoginInfo();
		const postMessage: Message  = setMessageParams(message)
		const postData: PostData | any = {...postLogin, ...postMessage}
	
		return new URLSearchParams(postData).toString()
	}
}