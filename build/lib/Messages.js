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
    constructor(format = 'json') {
        this.baseUrl = curl_1.conf.baseUrl;
        this.apiUrl = '/sending/messages?format=';
        this.messages = [];
        this.handles = [];
        this.handlesData = [];
        this.finished = 0;
        this.callbacks = [];
        this.callback = false;
        //: -----------------------------------------
        this.onResponseHandler = (error, handle, errorCode) => {
            const responseCode = handle.getInfo("RESPONSE_CODE").data;
            const handleUrl = handle.getInfo("EFFECTIVE_URL");
            const handleIndex = this.handles.indexOf(handle);
            const handleData = this.handlesData[handleIndex];
            const handlePhone = this.messages[handleIndex].PhoneNumbers;
            console.log("🚀  sendMessage returned: ", responseCode);
            console.log("📞  Phone: ", handlePhone);
            console.log("📨  message: ", handleIndex);
            //_console.log(`🔗  handleUrl:`, handleUrl.data)
            console.log("#️⃣  of handles active: ", this.multi.getCount());
            // remove completed from the Multi instance and close it
            this.multi.removeHandle(handle);
            handle.close();
            if (!error) {
                const responseData = handleData.join().toString();
                console.log(`↩️ `, responseData);
                if (responseCode == 201 || responseCode == 200) {
                    var log = { status: 'Success', location: 'messages', phone: handlePhone, message: responseCode.toString() };
                }
                else if (responseCode == 502)
                    var log = { status: 'Error', location: 'messages', phone: handlePhone, message: responseData };
                else {
                    const json = JSON.parse(responseData);
                    var log = { status: 'Error', location: 'messages', phone: handlePhone, message: json.Response.Errors };
                }
            }
            else {
                console.log(handlePhone + ' returned error: "' + error.message + '" with errcode: ' + errorCode);
                var log = { status: 'Error', location: 'messages', phone: handlePhone, message: error.message };
            }
            Util.logStatus(log);
            // >>> All finished
            if (++this.finished === this.messages.length) {
                console.log("🚁 all messages sent out!");
                this.multi.close();
            }
            //* return
            if (this.callback) {
                const callback = this.callbacks[handleIndex];
                callback(this.messages[handleIndex]);
            }
        };
        EZService.initDotenv();
        this.login = EZService.checkLoginInfo();
        this.format = format;
        this.multi = new node_libcurl_1.Multi();
    }
    //: _________________________________________
    sendMessage(message, callback) {
        const count = this.messages.push(message);
        if (callback) {
            this.callback = true;
            this.callbacks.push(callback);
        }
        this.multi.onMessage(this.onResponseHandler);
        //* start the request
        this.setCurlOptions(message, count - 1);
    }
    //: -----------------------------------------
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
    //: -----------------------------------------
    onDataHandler(handle, data, size, nmemb) {
        const key = this.handles.indexOf(handle);
        this.handlesData[key].push(data);
        //_console.log("onDataHandler: =======================")
        //_console.log("#️⃣  handle: ", key)
        //_console.log("🗄️  data: ", data)
        return size * nmemb;
    }
    //: -----------------------------------------
    createPostData(message) {
        const postLogin = EZService.checkLoginInfo();
        const postMessage = (0, Messages_1.setMessageParams)(message);
        const postData = Object.assign(Object.assign({}, postLogin), postMessage);
        return new URLSearchParams(postData).toString();
    }
}
exports.Messages = Messages;
