import { color, log } from "./Util";
import { defaultStyle } from "../conf/qrcode";

import { OutputFormat } from '../types/QRCode'

const QRCodeStyling  = require("qr-code-styling-node/lib/qr-code-styling.common.js");
const canvas = require("canvas");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require('path')


export class QRCodeGenerator {

    format: OutputFormat;
    buffer!: Buffer;

    constructor(format: OutputFormat) {
        this.format = 'png';
    }


	async style (codeData: string, style = defaultStyle) {

		if (this.format != 'png') { // 'png' 'jpeg' 'webp' 'svg'

			log('error', "Currently only PNG supported. You may add more support under 'controllers/qr.generator.ts'", color.red);
			return
		}
		
		style.data = codeData

		// For canvas type
		const qrCodeImage = new QRCodeStyling({
			canvas, // this is required
			...style,
		})

        qrCodeImage.getRawData(this.format)

        //console.log(this.buffer.toString('base64'))

        console.log('done')

		//const filename = path.resolve('./public/qr') + '/' + codeData + "." + this.format;
        //fs.writeFileSync(filename, this.buffer, {flag: 'w+'});

		//const base64 = buffer.toString('base64')
		//const src = `data:image/${this.format};base64,${base64}`


	}

    generate ( ) {}
}