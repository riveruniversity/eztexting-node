// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";

// Services
import * as util from "../service/EZTexting";
import { setMessageParams } from '../service/Messages';

// Types
import { CurlConf, Login } from "../types/options";
import { Message } from "../types/Messages";
import { EZLogin } from "../types/EZTexting";



const url = "https://app.eztexting.com/sending/messages?format=json&handle=";

const messages: Message[]= [
	{PhoneNumbers: "8134507575", Subject: "1",Message: JSON.stringify(new Date())},
	{PhoneNumbers: "8134456235", Subject: "2",Message: JSON.stringify(new Date())}
];

const multi = new Multi();
const handles: Easy[] = [];
const handlesData: Buffer[] | any = [];

let finished = 0;

multi.onMessage((error: Error, handle: Easy, errorCode: CurlCode) => {
	const responseCode = handle.getInfo("RESPONSE_CODE").data;

	const handleIndex: number = handles.indexOf(handle);
	const handleData: Buffer = handlesData[handleIndex];
	const handlePhone: string | any = messages[handleIndex].PhoneNumbers;

	let responseData: Buffer | null | any = null;

	console.log("# of handles active: " + multi.getCount());

	console.log("🔧  handle: " + handleIndex);

	if (error) {
		console.log(handlePhone +	' returned error: "' +	error.message +	'" with errcode: ' + errorCode);
		//_console.log(error)
	} else {
		for (let i = 0; i < handleData.length; i++) {
			responseData += handleData[i].toString();
		}

		console.log(`↩️  ${responseData}`)
		console.log(handlePhone + " returned response code: " + responseCode);
	}

	// we are done with this handle, remove it from the Multi instance and close it
	multi.removeHandle(handle);
	handle.close();

	if (++finished === messages.length) {
		console.log("Finished all requests!");
		// remember to close the multi instance too, when you are done with it.
		multi.close();
	}
});

/**
 * This will be used as callback for for WRITEFUNCTION
 *
 * data is a Buffer, n and nmemb are integers. You must return n * nmemb from this
 * callback to let libcurl know you handled correctly all data received.
 */
function onDataHandler (handle: Easy, data: Buffer, size: number, nmemb: number) {
	const key = handles.indexOf(handle);

		
	console.log("\nonDataHandler: =======================")

	console.log("#️⃣  handle: ")
	console.log(key)

	console.log("🗄️  data: ")
	console.log(data)
	
	handlesData[key].push(data);

	return size * nmemb;
};

for (let i = 0; i < messages.length; i++) {
	const handle = new Easy();
	handle.setOpt(Curl.option.URL, url + i);
	handle.setOpt(Curl.option.POST, true);
	handle.setOpt(Curl.option.POSTFIELDS, createPostData(i));
	handle.setOpt(Curl.option.CAINFO, util.getCertificate());
	handle.setOpt(Curl.option.FOLLOWLOCATION, true);
	handle.setOpt(Curl.option.WRITEFUNCTION, (data: Buffer, size: number, nmemb: number) => {
		return onDataHandler(handle, data, size, nmemb)
	});

	handlesData.push([]);
	handles.push(handle);

	multi.addHandle(handle);
}


function createPostData(i: number) {

	const login = util.checkLoginInfo();
	
	const postLogin: EZLogin = {
		User: login.user,
		Password: login.pass,
	};
	
	const postMessage: Message | any = setMessageParams(messages[i])

	const postData = {...postLogin, ...postMessage}
	return new URLSearchParams(postData).toString()
}


