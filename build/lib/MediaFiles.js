"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaFiles = void 0;
const tslib_1 = require("tslib");
// Dependencies
const node_libcurl_1 = require("node-libcurl");
// Services
const EZService = tslib_1.__importStar(require("../service/EZTexting"));
// Conf
const curl_1 = require("../conf/curl");
class MediaFiles {
    constructor(format) {
        this.baseUrl = curl_1.conf.baseUrl;
        this.apiUrl = '/sending/files?format=';
        this.format = 'json';
        EZService.initDotenv();
        this.login = EZService.checkLoginInfo();
        this.format = format;
        this.curl = new node_libcurl_1.Curl();
    }
    createMediaFile(source, closeConnection = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("🚀 createMediaFile");
            console.log(source);
            const promise = new Promise((resolve, reject) => {
                this.curl.on('end', (statusCode, body, headers, curlInstance) => {
                    console.info('Status Code: ', statusCode);
                    //- console.info('Headers: ', headers)
                    //- console.info('Body length: ', body.length)
                    //- console.info('Body: ', body)
                    const Jsonfile = JSON.parse(body);
                    const mediaFile = Jsonfile.Response.Entry;
                    // always close the `Curl` instance when you don't need it anymore
                    // Keep in mind we can do multiple requests with the same `Curl` instance
                    //  before it's closed, we just need to set new options if needed
                    //  and call `.perform()` again.
                    //r this.close = this.curl.close.bind(this.curl);
                    if (closeConnection)
                        this.curl.close();
                    resolve(mediaFile);
                });
                this.curl.on('error', (error, errorCode) => {
                    console.error('Error: ', error);
                    console.error('Code: ', errorCode);
                    this.curl.close();
                    reject(error);
                });
                this.curl.perform();
            });
            this.setCurlOptions(source);
            //this.setEndHandler(closeConnection);
            //this.setErrorHandler();
            return promise;
        });
    }
    setCurlOptions(source) {
        this.curl.setOpt(node_libcurl_1.Curl.option.URL, this.baseUrl + this.apiUrl + this.format);
        this.curl.setOpt(node_libcurl_1.Curl.option.POST, true);
        this.curl.setOpt(node_libcurl_1.Curl.option.POSTFIELDS, this.createPostData(source));
        this.curl.setOpt(node_libcurl_1.Curl.option.CAINFO, EZService.getCertificate());
        this.curl.setOpt(node_libcurl_1.Curl.option.FOLLOWLOCATION, true);
    }
    setEndHandler(closeConnection) {
        this.curl.on('end', (statusCode, body, headers, curlInstance) => {
        });
    }
    setErrorHandler() {
        this.curl.on('error', (error, errorCode) => {
        });
    }
    createPostData(source) {
        const postLogin = EZService.checkLoginInfo();
        const postParams = { Source: source };
        const postData = Object.assign(Object.assign({}, postLogin), postParams);
        const postString = new URLSearchParams(postData).toString();
        const params = `User=${postLogin.User}&Password=${postLogin.Password}&Source=${source}`;
        return params;
    }
}
exports.MediaFiles = MediaFiles;
