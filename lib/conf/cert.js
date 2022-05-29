"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificate = void 0;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var rootPath = process.cwd();
exports.certificate = path_1.default.join(__dirname, 'cacert.pem');
