"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeGenerator = void 0;
const tslib_1 = require("tslib");
const { QRCodeStyling } = require("qr-code-styling-node/lib/qr-code-styling.common.js");
const canvas_1 = tslib_1.__importDefault(require("canvas"));
const { JSDOM } = require("jsdom");
const fs = require("fs");
const fse = require("fs-extra");
const path_1 = tslib_1.__importDefault(require("path"));
const Util_1 = require("./Util");
const qrcode_1 = require("../conf/qrcode");
class QRCodeGenerator {
    generate(format = "png", codeData, style = qrcode_1.defaultStyle) {
        this.format = format;
        if (!style.data)
            style.data = codeData;
        if (this.format == "svg") {
            // For svg type
            var qrCodeImage = new QRCodeStyling(Object.assign({ jsdom: JSDOM, type: "svg" }, style));
            this.buffer = qrCodeImage.getRawData(this.format);
        }
        //if(this.format == 'png')
        else {
            // For canvas type
            var qrCodeImage = new QRCodeStyling(Object.assign({ nodeCanvas: canvas_1.default }, style));
            this.buffer = qrCodeImage.getRawData(this.format);
        }
        return this.buffer;
        //const base64 = buffer.toString('base64')
    }
    save(fileName = new Date().getTime().toString(), filePath = path_1.default.join(process.cwd(), "src", "assets", "qrcodes")) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const file = path_1.default.resolve(`${filePath}`, `${fileName}.${this.format}`);
            const buffer = yield this.buffer;
            fse.outputFile(file, buffer)
                .then(() => {
                this.fileName = `${fileName}.${this.format}`;
                (0, Util_1.log)("saved", `The file has been saved as ${this.fileName}`, Util_1.color.turquoise);
                return this.fileName;
            })
                .catch((err) => {
                console.error(err);
            });
            //fs.writeFileSync(file, buffer, {flag: 'w+'});
        });
    }
}
exports.QRCodeGenerator = QRCodeGenerator;
