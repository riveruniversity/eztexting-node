import { Messages, QRCodeGenerator } from '.'


const qr = new QRCodeGenerator('png')

qr.generate("testing it")
qr.save(__dirname)
