"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
// >>> Create PNG and Save
const qr = new _1.QRCodeGenerator();
const style = {
    width: 320,
    height: 320,
    margin: 0,
    data: "",
    qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "Q",
    },
    dotsOptions: {
        type: "classy-rounded",
        color: "#1c0576",
        gradient: {
            type: "radial",
            rotation: 0,
            colorStops: [
                { offset: 0, color: "#d66800" },
                { offset: 1, color: "#030303" },
            ],
        },
    },
    dotsOptionsHelper: {
        colorType: { single: true, gradient: false },
        gradient: {
            linear: true,
            radial: false,
            color1: "#6a1a4c",
            color2: "#6a1a4c",
            rotation: "0",
        },
    },
    backgroundOptions: { color: "#ffffff" },
    cornersSquareOptions: {
        type: "extra-rounded",
        color: "#000000",
        gradient: undefined,
    },
    cornersSquareOptionsHelper: {
        colorType: { single: true, gradient: false },
        gradient: {
            linear: true,
            radial: false,
            color1: "#000000",
            color2: "#000000",
            rotation: "0",
        },
    },
    cornersDotOptions: { type: undefined, color: "#000000" },
    cornersDotOptionsHelper: {
        colorType: { single: true, gradient: false },
        gradient: {
            linear: true,
            radial: false,
            color1: "#000000",
            color2: "#000000",
            rotation: "0",
        },
    },
    backgroundOptionsHelper: {
        colorType: { single: true, gradient: false },
        gradient: {
            linear: true,
            radial: false,
            color1: "#ffffff",
            color2: "#ffffff",
            rotation: "0",
        },
    },
};
qr.generate("png", 'testPic', style);
// Optional parameter ([filename, dir])
// If no filename is passed, the filename is the current unix timestamp
qr.save("testPic", __dirname);
// >>> Create new Media File from URL
// const media = new MediaFiles();
// media
// 	//.createMediaFile(__dirname + '\\testPic.png', true)
// 	.createMediaFile(path.resolve('testPic.png'), true)
// 	.then((value: any) => console.log(value.ID))
// 	.catch(console.log)
