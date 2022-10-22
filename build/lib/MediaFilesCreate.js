"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaFilesCreate = void 0;
const tslib_1 = require("tslib");
// Dependencies
const node_libcurl_1 = require("node-libcurl");
// Services
const EZService = tslib_1.__importStar(require("../service/EZTexting"));
const Util = tslib_1.__importStar(require("../service/Util"));
// Conf
const curl_1 = require("../conf/curl");
class MediaFilesCreate {
    constructor(format = 'json') {
        this.baseUrl = curl_1.conf.baseUrl;
        this.apiUrl = '/sending/files?format=';
        this.attendees = [];
        this.handles = [];
        this.handlesData = [];
        this.finished = 0;
        this.callbacks = [];
        this.callback = false;
        //: -----------------------------------------
        this.responseHandler = (error, handle, errorCode) => {
            const responseCode = handle.getInfo("RESPONSE_CODE").data;
            const handleUrl = handle.getInfo("EFFECTIVE_URL");
            const handleIndex = this.handles.indexOf(handle);
            const handleData = this.handlesData[handleIndex];
            const handlePhone = this.attendees[handleIndex].phone;
            console.log("🚀  createMediaFile returned: ", responseCode);
            console.log("📞  Phone: ", handlePhone);
            console.log("☁️  media file: ", handleIndex);
            //_console.log(`🔗  handleUrl:`, handleUrl.data)
            console.log("#️⃣  of handles active: ", this.multi.getCount());
            // remove completed from the Multi instance and close it
            this.multi.removeHandle(handle);
            handle.close();
            if (!error) {
                const responseData = handleData.join().toString();
                console.log(`↩️ `, responseData);
                if (responseCode == 201 || responseCode == 200) {
                    const json = JSON.parse(responseData);
                    const mediaFile = json.Response.Entry;
                    var log = { status: 'Success', location: 'create_media', phone: handlePhone, message: mediaFile.ID.toString() };
                    // Add new File ID to Attendees Array
                    this.attendees[handleIndex].file = mediaFile.ID;
                }
                else
                    var log = { status: 'Error', location: 'create_media', phone: handlePhone, message: responseData };
            }
            else {
                console.log(handlePhone, ' returned error: "', error.message, '" with errorcode: ', errorCode);
                var log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message };
                if (this.callback) {
                    const callback = this.callbacks[handleIndex];
                    callback(this.attendees[handleIndex], log);
                }
            }
            Util.logStatus(log);
            // >>> All finished
            if (++this.finished === this.attendees.length) {
                console.log("🚁 finished creating all media files!");
                this.multi.close();
            }
            //* return
            if (this.callback) {
                const callback = this.callbacks[handleIndex];
                callback(this.attendees[handleIndex]);
            }
        };
        EZService.initDotenv();
        this.login = EZService.checkLoginInfo();
        this.format = format;
        this.multi = new node_libcurl_1.Multi();
    }
    //: _________________________________________
    createMediaFile(attendee, params, callback) {
        const count = this.attendees.push(attendee);
        if (callback) {
            this.callback = true;
            this.callbacks.push(callback);
        }
        this.multi.onMessage(this.responseHandler);
        let source = `${params.url + this.attendees[count - 1].barcode}.${params.filetype}`;
        //* start the request
        this.setCurlOptions(source, count - 1);
    }
    //: -----------------------------------------
    setCurlOptions(source, i) {
        const handle = new node_libcurl_1.Easy();
        handle.setOpt(node_libcurl_1.Curl.option.URL, this.baseUrl + this.apiUrl + this.format + `&handle=${i}`);
        handle.setOpt(node_libcurl_1.Curl.option.POST, true);
        handle.setOpt(node_libcurl_1.Curl.option.POSTFIELDS, this.createPostData(source));
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
    createPostData(source) {
        const postLogin = EZService.checkLoginInfo();
        return `User=${postLogin.User}&Password=${postLogin.Password}&Source=${source}`;
    }
}
exports.MediaFilesCreate = MediaFilesCreate;
