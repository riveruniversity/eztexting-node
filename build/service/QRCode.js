"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeGenerator = void 0;
var tslib_1 = require("tslib");
var QRCodeStyling = require("qr-code-styling-node/lib/qr-code-styling.common.js").QRCodeStyling;
var canvas_1 = tslib_1.__importDefault(require("canvas"));
var JSDOM = require("jsdom").JSDOM;
var fs = require("fs");
var fse = require("fs-extra");
var path = require("path");
var Util_1 = require("./Util");
var qrcode_1 = require("../conf/qrcode");
var QRCodeGenerator = /** @class */ (function () {
    function QRCodeGenerator() {
    }
    QRCodeGenerator.prototype.generate = function (format, codeData, style) {
        if (format === void 0) { format = "png"; }
        if (style === void 0) { style = qrcode_1.defaultStyle; }
        this.format = format;
        if (!style.data)
            style.data = codeData;
        if (this.format == "svg") {
            // For svg type
            var qrCodeImage = new QRCodeStyling(tslib_1.__assign({ jsdom: JSDOM, type: "svg" }, style));
            this.buffer = qrCodeImage.getRawData(this.format);
        }
        //if(this.format == 'png')
        else {
            // For canvas type
            var qrCodeImage = new QRCodeStyling(tslib_1.__assign({ nodeCanvas: canvas_1.default }, style));
            this.buffer = qrCodeImage.getRawData(this.format);
        }
        return this.buffer;
        //const base64 = buffer.toString('base64')
    };
    QRCodeGenerator.prototype.save = function (fileName, filePath) {
        if (fileName === void 0) { fileName = new Date().getTime().toString(); }
        if (filePath === void 0) { filePath = path.join(process.cwd(), "src", "assets", "qrcodes"); }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var file, buffer;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = path.resolve("".concat(filePath), "".concat(fileName, ".").concat(this.format));
                        return [4 /*yield*/, this.buffer];
                    case 1:
                        buffer = _a.sent();
                        fse.outputFile(file, buffer)
                            .then(function () {
                            _this.fileName = "".concat(fileName, ".").concat(_this.format);
                            (0, Util_1.log)("saved", "The file has been saved as ".concat(_this.fileName), Util_1.color.turquoise);
                            return _this.fileName;
                        })
                            .catch(function (err) {
                            console.error(err);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return QRCodeGenerator;
}());
exports.QRCodeGenerator = QRCodeGenerator;
