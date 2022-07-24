"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const tslib_1 = require("tslib");
// Dependencies
const node_libcurl_1 = require("node-libcurl");
// Services
const EZService = tslib_1.__importStar(require("../service/EZTexting"));
const Util = tslib_1.__importStar(require("../service/Util"));
const Messages_1 = require("../service/Messages");
// Conf
const curl_1 = require("../conf/curl");
class Messages {
    constructor(format) {
        this.baseUrl = curl_1.conf.baseUrl;
        this.apiUrl = '/sending/messages?format=';
        this.format = 'json';
        this.messages = [];
        this.handles = [];
        this.handlesData = [];
        this.finished = 0;
        this.onResponseHandler = (error, handle, errorCode) => {
            const responseCode = handle.getInfo("RESPONSE_CODE").data;
            const handleUrl = handle.getInfo("EFFECTIVE_URL");
            const handleIndex = this.handles.indexOf(handle);
            const handleData = this.handlesData[handleIndex];
            const handlePhone = this.messages[handleIndex].PhoneNumbers;
            console.log("# of handles active: " + this.multi.getCount());
            console.log("📨  message: " + handleIndex);
            console.log(`🔗 handleUrl:`, handleUrl.data);
            if (error) {
                console.log(handlePhone + ' returned error: "' + error.message + '" with errcode: ' + errorCode);
                //_console.log(error)
                var log = { status: 'Error', location: 'messages', phone: handlePhone, message: error.message };
                Util.logStatus(log);
            }
            else {
                const responseData = handleData.join().toString();
                const json = JSON.parse(responseData);
                console.log(`↩️ `, responseData);
                console.log(handlePhone + " returned response code: ", responseCode);
                if (responseCode == 201 || responseCode == 200)
                    var log = { status: 'Success', location: 'messages', phone: handlePhone, message: '' };
                else
                    var log = { status: 'Error', location: 'messages', phone: handlePhone, message: json.Response.Errors };
                Util.logStatus(log);
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
        };
        EZService.initDotenv();
        this.login = EZService.checkLoginInfo();
        this.format = format;
        this.multi = new node_libcurl_1.Multi();
        this.multi.onMessage(this.onResponseHandler);
    }
    sendMessages(messages, callback) {
        console.log("🚀 sendMessage");
        this.messages = messages;
        for (let i in messages) {
            this.setCurlOptions(messages[i], +i);
        }
    }
    setCurlOptions(message, i) {
        const handle = new node_libcurl_1.Easy();
        handle.setOpt(node_libcurl_1.Curl.option.URL, this.baseUrl + this.apiUrl + this.format + `&handle=${i}`);
        handle.setOpt(node_libcurl_1.Curl.option.POST, true);
        handle.setOpt(node_libcurl_1.Curl.option.POSTFIELDS, this.createPostData(message));
        handle.setOpt(node_libcurl_1.Curl.option.CAINFO, EZService.getCertificate());
        handle.setOpt(node_libcurl_1.Curl.option.FOLLOWLOCATION, true);
        handle.setOpt(node_libcurl_1.Curl.option.WRITEFUNCTION, (data, size, nmemb) => {
            return this.onDataHandler(handle, data, size, nmemb);
        });
        this.handlesData.push([]);
        this.handles.push(handle);
        this.multi.addHandle(handle);
    }
    onDataHandler(handle, data, size, nmemb) {
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
    createPostData(message) {
        const postLogin = EZService.checkLoginInfo();
        const postMessage = (0, Messages_1.setMessageParams)(message);
        const postData = Object.assign(Object.assign({}, postLogin), postMessage);
        return new URLSearchParams(postData).toString();
    }
}
exports.Messages = Messages;
