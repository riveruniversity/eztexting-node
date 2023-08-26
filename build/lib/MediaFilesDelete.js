"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaFilesDelete = void 0;
const tslib_1 = require("tslib");
// Dependencies
const node_libcurl_1 = require("node-libcurl");
// Services
const EZService = tslib_1.__importStar(require("../service/EZTexting"));
const Util = tslib_1.__importStar(require("../service/Util"));
// Conf
const curl_1 = require("../conf/curl");
class MediaFilesDelete {
    constructor(verbose = false) {
        this.baseUrl = curl_1.conf.baseUrl;
        this.apiUrl = '/media-files';
        this.verbose = false;
        this.messages = [];
        this.handles = [];
        this.handlesData = [];
        this.waitBeforeClose = 30000; // ms
        this.finished = 0;
        this.callbacks = [];
        this.callback = false;
        //: -----------------------------------------
        this.responseHandler = (error, handle, errorCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const responseCode = handle.getInfo("RESPONSE_CODE").data;
            const handleUrl = handle.getInfo("EFFECTIVE_URL");
            const handleIndex = this.handles.indexOf(handle);
            const handleData = this.handlesData[handleIndex];
            const handlePhone = this.messages[handleIndex].toNumbers;
            if (this.verbose)
                console.log("🛬", handleIndex, "deleteMediaFile returned: ", responseCode);
            //i console.log("📞  Phone: ", handlePhone);
            //i console.log("🗑️  media file: ", handleIndex);
            if (this.verbose)
                console.log(`🔗 handleUrl:`, handleUrl.data);
            if (this.verbose)
                console.log("💠  active delete handles: ", this.multi.getCount());
            // remove completed from the Multi instance and close it
            this.multi.removeHandle(handle);
            handle.close();
            if (!error) {
                const responseData = handleData.join().toString();
                if (responseCode == 200)
                    var log = { status: 'Success', location: 'delete_media', phone: handlePhone, message: 'Deleted' };
                else if (responseCode == 204)
                    var log = { status: 'Info', location: 'delete_media', phone: handlePhone, message: 'No Content' };
                else {
                    console.log(`↩️ `, responseData);
                    var log = { status: 'Error', location: 'delete_media', phone: handlePhone, message: responseCode + ' ' + responseData };
                }
            }
            else {
                console.log(handlePhone + ' returned error: "' + error.message + '" with errorcode: ' + errorCode);
                var log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message };
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
                console.log("🚁 finished deleting all media files!");
                this.multi.close();
            }
        });
        EZService.initDotenv();
        this.verbose = verbose;
        this.login = EZService.getAuth();
        this.multi = new node_libcurl_1.Multi();
    }
    //: _________________________________________
    deleteMediaFile(message, callback) {
        let count = this.messages.push(message);
        if (this.verbose)
            console.log("🚀", count - 1, "deleteMediaFile ", message.toNumbers);
        if (callback) {
            this.callback = true;
            this.callbacks.push(callback);
        }
        this.multi.onMessage(this.responseHandler);
        this.setCurlOptions(message.mediaFileId, count - 1);
    }
    //: -----------------------------------------
    setCurlOptions(mediaFileId, i) {
        const handle = new node_libcurl_1.Easy();
        handle.setOpt(node_libcurl_1.Curl.option.URL, this.baseUrl + this.apiUrl + `/${mediaFileId}?handle=${i}`);
        handle.setOpt(node_libcurl_1.Curl.option.CUSTOMREQUEST, 'DELETE');
        handle.setOpt(node_libcurl_1.Curl.option.HTTPHEADER, ['Content-Type: application/json', `Authorization: ${this.login}`]);
        // handle.setOpt(Curl.option.POSTFIELDS, `{ "ids": ["${mediaFileId}"] }`);
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
}
exports.MediaFilesDelete = MediaFilesDelete;
