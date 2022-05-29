"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
var tslib_1 = require("tslib");
// Dependencies
var node_libcurl_1 = require("node-libcurl");
// Services
var EZService = tslib_1.__importStar(require("../service/EZTexting"));
var Messages_1 = require("../service/Messages");
// Conf
var curl_1 = require("../conf/curl");
var Messages = /** @class */ (function () {
    function Messages(format) {
        var _this = this;
        this.baseUrl = curl_1.conf.baseUrl;
        this.apiUrl = '/sending/messages?format=';
        this.format = 'json';
        this.messages = [];
        this.handles = [];
        this.handlesData = [];
        this.finished = 0;
        this.onResponseHandler = function (error, handle, errorCode) {
            var responseCode = handle.getInfo("RESPONSE_CODE").data;
            var handleUrl = handle.getInfo("EFFECTIVE_URL");
            console.log("\uD83D\uDD17 handleUrl:");
            console.log(handleUrl);
            var handleIndex = _this.handles.indexOf(handle);
            var handleData = _this.handlesData[handleIndex];
            var handlePhone = _this.messages[handleIndex].PhoneNumbers;
            var responseData = null;
            console.log("# of handles active: " + _this.multi.getCount());
            console.log("🔧  handle: " + handleIndex);
            if (error) {
                console.log(handlePhone + ' returned error: "' + error.message + '" with errcode: ' + errorCode);
                //_console.log(error)
            }
            else {
                for (var i = 0; i < handleData.length; i++) {
                    responseData += handleData[i].toString();
                }
                console.log("\u21A9\uFE0F  ".concat(responseData));
                console.log(handlePhone + " returned response code: " + responseCode);
            }
            // we are done with this handle, remove it from the Multi instance and close it
            _this.multi.removeHandle(handle);
            handle.close();
            if (++_this.finished === _this.messages.length) {
                console.log("🚁 finished all requests!");
                // remember to close the multi instance too, when you are done with it.
                _this.multi.close();
            }
        };
        EZService.initDotenv();
        this.login = EZService.checkLoginInfo();
        this.format = format;
        this.multi = new node_libcurl_1.Multi();
        this.multi.onMessage(this.onResponseHandler);
    }
    Messages.prototype.sendMessage = function (messages, callback) {
        console.log("🚀 sendMessage");
        this.messages = messages;
        for (var i in messages) {
            this.setCurlOptions(messages[i], +i);
        }
    };
    Messages.prototype.setCurlOptions = function (message, i) {
        var _this = this;
        var handle = new node_libcurl_1.Easy();
        handle.setOpt(node_libcurl_1.Curl.option.URL, this.baseUrl + this.apiUrl + this.format + "&handle=".concat(i));
        handle.setOpt(node_libcurl_1.Curl.option.POST, true);
        handle.setOpt(node_libcurl_1.Curl.option.POSTFIELDS, this.createPostData(message));
        handle.setOpt(node_libcurl_1.Curl.option.CAINFO, EZService.getCertificate());
        handle.setOpt(node_libcurl_1.Curl.option.FOLLOWLOCATION, true);
        handle.setOpt(node_libcurl_1.Curl.option.WRITEFUNCTION, function (data, size, nmemb) {
            return _this.onDataHandler(handle, data, size, nmemb);
        });
        this.handlesData.push([]);
        this.handles.push(handle);
        this.multi.addHandle(handle);
    };
    Messages.prototype.onDataHandler = function (handle, data, size, nmemb) {
        /*
        console.log("\nonDataHandler: =======================")
    
        console.log("#️⃣  handle: ")
        console.log(key)
    
        console.log("🗄️  data: ")
        console.log(data)
        */
        var key = this.handles.indexOf(handle);
        this.handlesData[key].push(data);
        return size * nmemb;
    };
    Messages.prototype.createPostData = function (message) {
        var postLogin = EZService.checkLoginInfo();
        var postMessage = (0, Messages_1.setMessageParams)(message);
        var postData = tslib_1.__assign(tslib_1.__assign({}, postLogin), postMessage);
        return new URLSearchParams(postData).toString();
    };
    return Messages;
}());
exports.Messages = Messages;
