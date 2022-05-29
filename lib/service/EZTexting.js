"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCertificate = exports.checkLoginInfo = exports.getTimestamp = void 0;
var tslib_1 = require("tslib");
// Dependencies
var dotenv_1 = tslib_1.__importDefault(require("dotenv"));
// Modules
var cert_1 = require("../conf/cert");
function getTimestamp(stringTime) {
    if (!stringTime)
        return ''.toString();
    var dateTime = new Date(stringTime);
    var timestamp = dateTime.getTime() / 1000;
    console.log(timestamp);
    return timestamp.toString();
}
exports.getTimestamp = getTimestamp;
function checkLoginInfo() {
    dotenv_1.default.config();
    if (!process.env.USR || !process.env.PWD)
        throw new Error("Missing parameter: 'Username' or 'Password'! Please add environment variables.");
    return { User: process.env.USR, Password: process.env.PWD };
}
exports.checkLoginInfo = checkLoginInfo;
function getCertificate() {
    return cert_1.certificate;
}
exports.getCertificate = getCertificate;
