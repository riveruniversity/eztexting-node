import { color, log } from "./Util";
import { defaultStyle } from "../conf/qrcode";

import { OutputFormat } from '../types/QRCode'

const { QRCodeStyling }  = require("qr-code-styling-node/lib/qr-code-styling.common.js");
import nodeCanvas from "canvas";
const { JSDOM } = require("jsdom");
const fs = require("fs");
const fse = require('fs-extra')
const path = require('path')


export class QRCodeGenerator {

    format: OutputFormat;
    buffer!: Promise<Buffer>;

    constructor(format: OutputFormat) {
        this.format = format;
    }


	generate (codeData: string, style: any = defaultStyle) {

		if (this.format != 'png' && this.format != 'svg') { // 'png' 'jpeg' 'webp' 'svg'

			log('error', "Currently only PNG supported. You may add more support under 'controllers/qr.generator.ts'", color.red);
			return
		}
		
		style.data = codeData

		if(this.format == 'png')
		{
			// For canvas type
			var qrCodeImage = new QRCodeStyling({
				nodeCanvas, // this is required
				...style,
			})
		}
		else {
			// For svg type
			var qrCodeImage = new QRCodeStyling({
				jsdom: JSDOM, // this is required
				type: "svg",
				...style
			});
		}

        this.buffer = qrCodeImage.getRawData(this.format)
		//.then((buffer: Buffer) => this.buffer = buffer) 

		

		//const file = path.resolve(`${new Date().getTime().toString()}.${this.format}`)
		//fs.writeFileSync(file, this.buffer, {flag: 'w+'});

		//const base64 = buffer.toString('base64')
	}

    async save(fileName: string = new Date().getTime().toString(), filePath: string = path.join(process.cwd(), 'src', 'assets', 'qrcodes')) {
		
		const file = path.resolve(`${filePath}`,`${fileName}.${this.format}`)

		const buffer = await this.buffer

		fse.outputFile(file, buffer)
		.then(() => {
			log('save', 'The file has been saved!', color.turquoise);
		})
		.catch((err: Error) => {
			console.error(err)
		});

		//fs.writeFileSync(file, buffer, {flag: 'w+'});
	}
}