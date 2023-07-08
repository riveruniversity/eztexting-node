"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDotenv = exports.getCertificate = exports.getAuth = exports.checkLoginInfo = void 0;
const tslib_1 = require("tslib");
// Dependencies
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
// Modules
const cert_1 = require("../conf/cert");
function checkLoginInfo() {
    if (!process.env.USR || !process.env.PASS)
        throw new Error("Missing parameter: 'Username' or 'Password'! Please add environment variables.");
    return { User: process.env.USR, Password: process.env.PASS };
}
exports.checkLoginInfo = checkLoginInfo;
function getAuth() {
    if (!process.env.USR || !process.env.PASS)
        throw new Error("Missing parameter: 'Username' or 'Password'! Please add environment variables.");
    return 'Basic ' + Buffer.from(process.env.USR + ':' + process.env.PASS).toString('base64');
}
exports.getAuth = getAuth;
function getCertificate() {
    if (process.env.CRT_PATH)
        return process.env.CRT_PATH;
    else
        return cert_1.certificate;
}
exports.getCertificate = getCertificate;
function initDotenv() {
    dotenv_1.default.config();
}
exports.initDotenv = initDotenv;
