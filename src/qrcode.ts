import { Messages, QRCodeGenerator } from '.'


const qrPng = new QRCodeGenerator('png')

qrPng.generate("testing it")
qrPng.save('wilhelm')


const qrSvg = new QRCodeGenerator('svg')

qrSvg.generate("testing it")
qrSvg.save('winnie')

