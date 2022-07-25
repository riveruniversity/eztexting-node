"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios = require('axios');
const __1 = require("..");
const Util = tslib_1.__importStar(require("../service/Util"));
const attendees_1 = require("./attendees");
// Testing /*
/*
const attendees: Attendee[] = [
    {'name' : "Mikela", 'phone' : '8134507575', 'barcode' : '39966413496402920759001', 'fam' : false},
    {'name' : "Wilhelm", 'phone' : '8134507575', 'barcode' : '41404608996650941709001', 'fam' : true}
]
*/
const format = 'json';
const media = new __1.MediaFiles(format);
const messages = new __1.Messages(format);
const timestamp = '2022-07-24 06:30'; //! 2022-07-24 06:30
sendBulkMessages();
function sendBulkMessages() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        //[] await createBarcodes(attendees);
        yield media.createMediaFiles(attendees_1.attendees, { filetype: 'png', url: `https://rmi-texting.herokuapp.com/qr/show/` });
        //r const attendeeMediaList: Attendee[] = await media.createMediaFiles(attendees, {filetype: 'png', url: `https://rmi-texting.herokuapp.com/qr/show/`});
        //r createMessages(attendeeMediaList, timestamp); 
    });
}
function createMessages(attendees, timestamp) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const individualMessages = [];
        for (let i in attendees) {
            const attendee = attendees[i];
            if (!attendee.fam)
                var message = `Good morning ${attendee.name}. When you arrive at the conference, show your fast pass at the registration.`;
            else
                var message = `${attendee.name}'s fast pass`;
            individualMessages.push({ PhoneNumbers: attendee.phone, StampToSend: timestamp, MessageTypeID: '3', Message: message, FileID: attendee.file });
        }
        messages.sendMessages(individualMessages, 'callback');
    });
}
function createBarcodes(attendees) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log("🚀 createBarcodes");
        Util.logStatus({ status: 'Log', location: 'create_barcodes', message: 'started', phone: '' });
        return new Promise((resolve) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let attendee of attendees) {
                yield axios.get(`https://rmi-texting.herokuapp.com/qr/create/${attendee.barcode}.png`);
                /*
                .then((res: { status: any; }) => {
                    console.log(`statusCode: ${res.status}`);
                    //console.log(res);
                })
                .catch((error: any) => {
                    console.error(error);
                });
                */
            }
            Util.logStatus({ status: 'Log', location: 'create_barcodes', message: 'finished', phone: '' });
            resolve();
        }));
    });
}
