"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificate = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
//const rootPath =  process.cwd()
exports.certificate = process.env.CRT_PATH ? process.env.CRT_PATH : path_1.default.join(__dirname, 'cacert.pem');
