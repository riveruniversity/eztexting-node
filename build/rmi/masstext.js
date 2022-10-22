"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const __1 = require("..");
const Util = tslib_1.__importStar(require("../service/Util"));
// >>> Settings
//!import { attendees } from './attendees';
// Testing /*
const attendees = [
    { 'name': "Willie", 'phone': '8138990000', 'barcode': '100001', 'fam': false },
    { 'name': "Winnie", 'phone': '8138990001', 'barcode': '100002', 'fam': true }
];
const timestamp = ''; //! SET TIMESTAMP 2022-08-31 15:00
const qrUrl = `https://rmi-texting.herokuapp.com/qr/`;
// >>> Start
const format = 'json';
const newMedia = new __1.MediaFilesCreate(format);
const delMedia = new __1.MediaFilesDelete(format);
const messages = new __1.Messages(format);
sendBulkMessages();
function sendBulkMessages() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield createBarcodes(attendees);
        yield Util.sleep(3000);
        attendees.forEach((attendee, i) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            //? const isLast: boolean = (i === (attendees.length -1)) ? true : false;
            newMedia.createMediaFile(attendee, { filetype: 'png', url: qrUrl + 'show/' }, createMessage);
        }));
    });
}
//: -----------------------------------------
function createMessage(attendee, error) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log('👤  Attendee: ', attendee);
        if (!attendee.fam)
            var text = `Good morning ${attendee.name}. When you arrive at the conference, show your fast pass at the registration.`;
        else
            var text = `${attendee.name}'s fast pass`;
        const message = { PhoneNumbers: attendee.phone, StampToSend: timestamp, MessageTypeID: '3', Message: text, FileID: attendee.file };
        messages.sendMessage(message, deleteMediaFile);
    });
}
//: -----------------------------------------
function deleteMediaFile(message) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log('📨  Message: ', message);
        delMedia.deleteMediaFile(message, done);
    });
}
function done(message) {
    console.log('✅  Done: ', message);
}
function createBarcodes(attendees) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log("🚀 createBarcodes");
        Util.logStatus({ status: 'Log', location: 'create_barcodes', message: 'started', phone: '' });
        return new Promise((resolve) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let attendee of attendees) {
                yield axios_1.default.get(qrUrl + `/create/${attendee.barcode}.png`)
                    /*
                    .then((res: { status: any; }) => {
                        console.log(`statusCode: ${res.status}`);
                        //console.log(res);
                    })
                    */
                    .catch((error) => {
                    console.error(error);
                });
            }
            Util.logStatus({ status: 'Log', location: 'create_barcodes', message: 'finished', phone: '' });
            resolve();
        }));
    });
}
