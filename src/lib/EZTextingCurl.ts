// Dependencies
import { Curl, CurlCode, HeaderInfo, CurlFeature} from 'node-libcurl';
import dotenv from 'dotenv';

// Modules
import { certificate } from '../conf/cert';

// Services
import { getTimestamp } from '../service/EZTexting';

// Types
import { EZLogin, CurlConf } from "../types/EZTexting";
import { Message, ResponseFormat } from '../types/Messages'


export class EZTextingCurl implements CurlConf {

	curl: Curl;
	baseUrl = "https://app.eztexting.com"
	login: EZLogin;
	complete: boolean = false;

	constructor() {
		this.login = this.checkLoginInfo();
		this.curl = new Curl();
		this.initCurlOptions();
	}

	sendSingleMessage(message: Message, format: ResponseFormat, callback: any, count: number = -1) {


		// https://www.eztexting.com/developers/sms-api-documentation/rest#CatSending

		console.log("🚀 sendMessage");

		const url = `${this.baseUrl}/sending/messages?format=${format}&count=${count}`

		const  postLogin: EZLogin = {
			User: this.login.User,
			Password: this.login.Password,
		}

		const postData: Message = {
			PhoneNumbers: message.PhoneNumbers,
			Groups: message.Groups ? message.Groups : '',
			Message: message.Message ? message.Message : '',
			Subject: message.Subject ? message.Subject : '',
			FileID: message.FileID ? message.FileID : '',
			MessageTypeID: message.MessageTypeID ? message.MessageTypeID : '1',
			StampToSend: getTimestamp(message.StampToSend)
		};
		
		this.setCurlOptions(url, postData, count);

		this.curl.on("end", this.onEndHandler);
		this.curl.on("error", this.onErrorHandler);
		this.curl.perform();

		if (count < 0) this.complete = true;
		console.log("🚁 Performed ---");
	}

	sendBulkMessage(messages: Message[], format: ResponseFormat, callback: any) {
		for (let i in messages) {
			this.sendSingleMessage(messages[i], callback, +i)
		}
		this.complete = true;
	}

	

	setCurlOptions(url: string, postData: Message | any, count: number): void {
		this.curl.setOpt(Curl.option.URL, url);
		this.curl.setOpt(Curl.option.POSTFIELDS, new URLSearchParams(postData).toString());
	}

	initCurlOptions () {
		//this.curl.setOpt(Curl.option.VERBOSE, true)

		this.curl.setOpt(Curl.option.POST, true);
		this.curl.setOpt(Curl.option.FOLLOWLOCATION, true);
		this.curl.setOpt(Curl.option.CAINFO, certificate);

		// If no certificate (not secure)
		//curl.setOpt(Curl.option.SSL_VERIFYHOST, false);
		//curl.setOpt(Curl.option.SSL_VERIFYPEER, false);
	}

	onEndHandler(statusCode: number, data: string | Buffer, headers: Buffer | HeaderInfo[], curlInstance: Curl) {
		console.info(":statusCode:");
		console.info(statusCode);
		console.info("---\n");

		console.info(":data:");
		console.info(data);
		console.info("---\n");

		console.info(":TOTAL_TIME:");
		console.info(curlInstance.getInfo("TOTAL_TIME"));
		console.info("---\n");

		if(this.complete == true) curlInstance.close();
	}

	onErrorHandler(e: Error, code: CurlCode, curl: Curl): void {

		console.info(":this.curl:");
		console.log(curl);

		console.info("🛑 ERROR:---");
		console.log(e);

		curl.close.bind(curl);
	}

	checkLoginInfo() {
		dotenv.config();
		if(!process.env.USR ||  !process.env.PWD)
			throw new Error("Missing parameter: 'Username' or 'Password'");

		return {user: process.env.USR, pass: process.env.PWD}
	}
}