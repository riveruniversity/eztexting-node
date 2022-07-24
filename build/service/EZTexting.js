"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDotenv = exports.getCertificate = exports.checkLoginInfo = void 0;
const tslib_1 = require("tslib");
// Dependencies
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
// Modules
const cert_1 = require("../conf/cert");
function checkLoginInfo() {
    if (!process.env.USR || !process.env.PWD)
        throw new Error("Missing parameter: 'Username' or 'Password'! Please add environment variables.");
    return { User: process.env.USR, Password: process.env.PWD };
}
exports.checkLoginInfo = checkLoginInfo;
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
