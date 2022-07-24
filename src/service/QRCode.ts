const {	QRCodeStyling} = require("qr-code-styling-node/lib/qr-code-styling.common.js");
import nodeCanvas from "canvas";
const { JSDOM } = require("jsdom");
const fs = require("fs");
const fse = require("fs-extra");
import path from "path";

import { color, log } from "./Util";
import { defaultStyle } from "../conf/qrcode";

import { OutputFormat, StyleOptions } from "../types/QRCode";

export class QRCodeGenerator {
	
	format!: OutputFormat;
	fileName!: string;
	buffer!: Promise<Buffer>;

	generate(format: OutputFormat = "png", codeData: string, style: StyleOptions = defaultStyle): Promise<Buffer> {
		this.format = format;

		if(!style.data) style.data = codeData;

		if (this.format == "svg") {
			// For svg type
			var qrCodeImage = new QRCodeStyling({
				jsdom: JSDOM, // this is required
				type: "svg",
				...style,
			});
			this.buffer = qrCodeImage.getRawData(this.format);
		}
		//if(this.format == 'png')
		else {
			// For canvas type
			var qrCodeImage = new QRCodeStyling({
				nodeCanvas, // this is required
				...style,
			});
			this.buffer = qrCodeImage.getRawData(this.format);
		}

		return this.buffer;

		//const base64 = buffer.toString('base64')
	}

	async save(fileName: string = new Date().getTime().toString(), filePath: string = path.join(process.cwd(), "src", "assets", "qrcodes")) {
		const file = path.resolve(`${filePath}`, `${fileName}.${this.format}`);
		
		const buffer = await this.buffer;

		fse.outputFile(file, buffer)
		.then(() => {
			this.fileName = `${fileName}.${this.format}`;
			log("saved",`The file has been saved as ${this.fileName}`,color.turquoise);

			return this.fileName;
		})
		.catch((err: Error) => {
			console.error(err);
		});

		//fs.writeFileSync(file, buffer, {flag: 'w+'});
	}
}
