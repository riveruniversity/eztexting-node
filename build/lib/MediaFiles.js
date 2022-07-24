"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaFiles = void 0;
const tslib_1 = require("tslib");
// Dependencies
const node_libcurl_1 = require("node-libcurl");
// Services
const EZService = tslib_1.__importStar(require("../service/EZTexting"));
const Util = tslib_1.__importStar(require("../service/Util"));
// Conf
const curl_1 = require("../conf/curl");
class MediaFiles {
    constructor(format) {
        this.baseUrl = curl_1.conf.baseUrl;
        this.apiUrl = '/sending/files?format=';
        this.format = 'json';
        this.handles = [];
        this.handlesData = [];
        this.finished = 0;
        EZService.initDotenv();
        this.login = EZService.checkLoginInfo();
        this.format = format;
        this.multi = new node_libcurl_1.Multi();
    }
    createMediaFiles(attendees, params) {
        console.log("🚀 createMediaFiles");
        this.attendees = attendees;
        return new Promise((resolve, reject) => {
            const onResponseHandler = (error, handle, errorCode) => {
                const responseCode = handle.getInfo("RESPONSE_CODE").data;
                const handleUrl = handle.getInfo("EFFECTIVE_URL");
                const handleIndex = this.handles.indexOf(handle);
                const handleData = this.handlesData[handleIndex];
                const handlePhone = this.attendees[handleIndex].phone;
                console.log("# of handles active: " + this.multi.getCount());
                console.log("☁️  media file: " + handleIndex);
                console.log(`🔗 handleUrl:`, handleUrl.data);
                if (error) {
                    console.log(handlePhone + ' returned error: "' + error.message + '" with errcode: ' + errorCode);
                    //_console.log(error)
                    var log = { status: 'Curl Error', location: 'messages', phone: handlePhone, message: error.message };
                    Util.logStatus(log);
                    this.attendees[handleIndex].file = 0;
                }
                else {
                    //r let responseData: string = '';
                    //r for (let i = 0; i < handleData.length; i++) {
                    //r 	responseData += handleData[i].toString();
                    //r }
                    //r const json = JSON.parse(responseData.substring(4)) // remove preceding 'null'
                    const responseData = handleData.join().toString();
                    const json = JSON.parse(responseData);
                    console.log(`↩️ `, responseData);
                    console.log(handlePhone + " returned response code: ", responseCode);
                    if (responseCode == 201 || responseCode == 200) {
                        const mediaFile = json.Response.Entry;
                        this.attendees[handleIndex].file = mediaFile.ID;
                        var log = { status: 'Success', location: 'media_files', phone: handlePhone, message: mediaFile.ID.toString() };
                    }
                    else {
                        this.attendees[handleIndex].file = 0;
                        var log = { status: 'Error', location: 'media_files', phone: handlePhone, message: json.Response.Errors };
                    }
                    Util.logStatus(log);
                }
                // we are done with this handle, remove it from the Multi instance and close it
                this.multi.removeHandle(handle);
                handle.close();
                // >>> All finished
                if (++this.finished === this.attendees.length) {
                    console.log("🚁 finished creating all media files!");
                    resolve(this.attendees);
                    // remember to close the multi instance too, when you are done with it.
                    this.multi.close();
                }
            };
            this.multi.onMessage(onResponseHandler);
            for (let i in attendees) {
                let source = `${params.url + attendees[i].barcode}.${params.filetype}`;
                this.setCurlOptions(source, +i);
            }
        });
    }
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
    onDataHandler(handle, data, size, nmemb) {
        const key = this.handles.indexOf(handle);
        this.handlesData[key].push(data);
        /*
        console.log("onDataHandler: =======================")
    
        console.log("#️⃣  handle: ", key)
        console.log("🗄️  data: ", data)
        */
        return size * nmemb;
    }
    createPostData(source) {
        const postLogin = EZService.checkLoginInfo();
        return `User=${postLogin.User}&Password=${postLogin.Password}&Source=${source}`;
    }
}
exports.MediaFiles = MediaFiles;
