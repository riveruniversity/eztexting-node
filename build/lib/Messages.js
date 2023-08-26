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
    constructor(verbose = false) {
        this.baseUrl = curl_1.conf.baseUrl;
        this.apiUrl = '/messages';
        this.verbose = false;
        this.messages = [];
        this.contacts = [];
        this.handles = [];
        this.handlesData = [];
        this.waitBeforeClose = 15000; // ms
        this.finished = 0;
        this.callbacks = [];
        this.callback = false;
        //: -----------------------------------------
        this.onResponseHandler = (error, handle, errorCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const responseCode = handle.getInfo("RESPONSE_CODE").data;
            const handleUrl = handle.getInfo("EFFECTIVE_URL");
            const handleIndex = this.handles.indexOf(handle);
            const handleData = this.handlesData[handleIndex];
            const handlePhone = this.messages[handleIndex].toNumbers;
            if (this.verbose)
                console.log("🛬", handleIndex, "sendMessage returned: ", responseCode);
            //i console.log("📞  Phone: ", handlePhone);
            //i console.log("📨  message: ", handleIndex);
            if (this.verbose)
                console.log(`🔗  handleUrl:`, handleUrl.data);
            if (this.verbose)
                console.log("💠  active message handles: ", this.multi.getCount());
            // remove completed from the Multi instance and close it
            this.multi.removeHandle(handle);
            handle.close();
            if (!error) {
                const responseData = handleData.join().toString();
                if (responseCode == 201 || responseCode == 200) {
                    var log = { status: 'Success', location: 'messages', phone: handlePhone, message: responseCode.toString(), id: this.contacts[handleIndex].barcode };
                }
                else if (responseCode == 502) {
                    console.log(`↩️ Error at url: ${this.apiUrl}`, responseData);
                    var log = { status: 'Error', location: 'messages', phone: handlePhone, message: responseData, id: this.contacts[handleIndex].barcode };
                }
                else {
                    console.log(`↩️ Error at url: ${this.apiUrl}`, responseData);
                    // const json = JSON.parse(responseData); not used, I don't now why it's here
                    var log = { status: 'Error', location: 'messages', phone: handlePhone, message: responseData, id: this.contacts[handleIndex].barcode };
                }
            }
            else {
                console.log(handlePhone + ' returned error: "' + error.message + '" with errcode: ' + errorCode);
                var log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message, id: this.contacts[handleIndex].barcode };
            }
            Util.logStatus(log);
            //* return
            if (this.callback) {
                const isError = log.status != 'Success' ? log : false;
                const callback = this.callbacks[handleIndex];
                callback(this.messages[handleIndex], isError);
            }
            // Wait for more requests before closing 
            yield Util.sleep(this.waitBeforeClose);
            // >>> All finished
            if (++this.finished === this.messages.length) {
                console.log("🚁 finished sending all messages!");
                this.multi.close();
            }
        });
        EZService.initDotenv();
        this.verbose = verbose;
        this.login = EZService.getAuth();
        this.multi = new node_libcurl_1.Multi();
    }
    //: _________________________________________
    sendMessage(message, attendee, callback) {
        const count = this.messages.push(message);
        this.contacts.push(attendee);
        if (this.verbose)
            console.log("🚀", count - 1, "sendMessage ", attendee.barcode);
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
        handle.setOpt(node_libcurl_1.Curl.option.URL, this.baseUrl + this.apiUrl + `?handle=${i}`);
        handle.setOpt(node_libcurl_1.Curl.option.POST, true);
        handle.setOpt(node_libcurl_1.Curl.option.HTTPHEADER, ['Content-Type: application/json', `Authorization: ${EZService.getAuth()}`]);
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
        const postMessage = (0, Messages_1.setMessageParams)(message);
        return JSON.stringify(postMessage);
    }
    get activeHandles() {
        return this.multi.getCount();
    }
}
exports.Messages = Messages;
