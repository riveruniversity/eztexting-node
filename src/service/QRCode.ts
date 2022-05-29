import { color, log } from "./Util";
import { defaultStyle } from "../conf/qrcode";

import { OutputFormat } from '../types/QRCode'

const { QRCodeStyling }  = require("qr-code-styling-node/lib/qr-code-styling.common.js");
const nodeCanvas = require("canvas");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require('path')


export class QRCodeGenerator {

    format: OutputFormat;
    buffer!: Buffer;

    constructor(format: OutputFormat) {
        this.format = 'png';
    }


	generate (codeData: string, style: any = defaultStyle) {

		if (this.format != 'png') { // 'png' 'jpeg' 'webp' 'svg'

			log('error', "Currently only PNG supported. You may add more support under 'controllers/qr.generator.ts'", color.red);
			return
		}
		
		style.data = codeData

		// For canvas type
		const qrCodeImage = new QRCodeStyling({
			nodeCanvas, // this is required
			...style,
		})

        this.buffer = qrCodeImage.getRawData(this.format)
		return this.buffer
		//const base64 = buffer.toString('base64')
	}

    save(filePath: string = __dirname, fileName: string = new Date().getTime().toString()) {
		const file = path.resolve(`${filePath}/qrcodes/${fileName}`) + `${this.format}`
		fs.writeFileSync(file, this.buffer, {flag: 'w+'});
	}
}