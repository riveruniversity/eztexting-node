"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeGenerator = void 0;
var tslib_1 = require("tslib");
var Util_1 = require("./Util");
var qrcode_1 = require("../conf/qrcode");
var QRCodeStyling = require("qr-code-styling-node/lib/qr-code-styling.common.js").QRCodeStyling;
var canvas = require("canvas");
var JSDOM = require("jsdom").JSDOM;
var fs = require("fs");
var path = require('path');
var QRCodeGenerator = /** @class */ (function () {
    function QRCodeGenerator(format) {
        this.format = 'png';
    }
    QRCodeGenerator.prototype.style = function (codeData, style) {
        if (style === void 0) { style = qrcode_1.defaultStyle; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var qrCodeImage, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.format != 'png') { // 'png' 'jpeg' 'webp' 'svg'
                            (0, Util_1.log)('error', "Currently only PNG supported. You may add more support under 'controllers/qr.generator.ts'", Util_1.color.red);
                            return [2 /*return*/];
                        }
                        style.data = codeData;
                        qrCodeImage = new QRCodeStyling(tslib_1.__assign({ canvas: canvas }, style));
                        _a = this;
                        return [4 /*yield*/, qrCodeImage.getRawData(this.format)];
                    case 1:
                        _a.buffer = _b.sent();
                        console.log(this.buffer.toString('base64'));
                        console.log('done');
                        return [2 /*return*/];
                }
            });
        });
    };
    QRCodeGenerator.prototype.generate = function () { };
    return QRCodeGenerator;
}());
exports.QRCodeGenerator = QRCodeGenerator;
