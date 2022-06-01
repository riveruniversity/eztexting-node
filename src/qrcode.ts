import { Messages, QRCodeGenerator, OutputFormat, StyleOptions } from ".";


// PNG with Promise handler
const qr = new QRCodeGenerator();

qr.generate("png", "Willie")
	 .then((buffer: Buffer) => {var base64 = buffer.toString("base64")})
	 .catch((err: Error) => console.error(err));




// Create SVG and Save
const style: StyleOptions = {"width":300,"height":300,"data":"https://qr-code-styling.com","margin":0,"qrOptions":{"typeNumber":0,"mode":"Byte","errorCorrectionLevel":"Q"},"imageOptions":{"hideBackgroundDots":true,"imageSize":0.4,"margin":0},"dotsOptions":{"type":"extra-rounded","color":"#6a1a4c"},"backgroundOptions":{"color":"#ffffff"},"dotsOptionsHelper":{"colorType":{"single":true,"gradient":false},"gradient":{"linear":true,"radial":false,"color1":"#6a1a4c","color2":"#6a1a4c","rotation":"0"}},"cornersSquareOptions":{"type":"extra-rounded","color":"#000000"},"cornersSquareOptionsHelper":{"colorType":{"single":true,"gradient":false},"gradient":{"linear":true,"radial":false,"color1":"#000000","color2":"#000000","rotation":"0"}},"cornersDotOptions":{"color":"#000000"},"cornersDotOptionsHelper":{"colorType":{"single":true,"gradient":false},"gradient":{"linear":true,"radial":false,"color1":"#000000","color2":"#000000","rotation":"0"}},"backgroundOptionsHelper":{"colorType":{"single":true,"gradient":false},"gradient":{"linear":true,"radial":false,"color1":"#ffffff","color2":"#ffffff","rotation":"0"}}}
qr.generate("svg", '', style);

// Optional parameter ([filename, dir])
// If no filename is passed, the filename is the current unix timestamp
qr.save("StyleWebsite");

