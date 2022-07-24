"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios = require('axios');
const fse = require("fs-extra");
const __1 = require("..");
//import { attendees } from './attendees';
const attendees = [
    //{'name' : "Mikela", 'phone' : '8082053678', 'barcode' : '39966413496402920759001', 'fam' : false},
    { 'name': "Wilhelm", 'phone': '8134507575', 'barcode': '41404608996650941709001', 'fam': false }
];
const format = 'json';
const media = new __1.MediaFiles(format);
const messages = new __1.Messages(format);
const attendeeList = getAttendees(attendees);
function getAttendees(attendees) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const individualMessages = [];
        for (let i in attendees) {
            const attendee = attendees[i];
            const last = Number(i) + 1 == attendees.length ? true : false;
            const file = yield getMediaFile(attendee.barcode, last);
            if (!attendee.fam)
                var message = `Good morning ${attendee.name}. Show this fast pass at the registration.`;
            else
                var message = `${attendee.name}'s fast pass`;
            individualMessages.push({ PhoneNumbers: attendee.phone, StampToSend: '2022-07-24 02:05', MessageTypeID: '3', Message: message, FileID: file.ID });
        }
        messages.sendMessage(individualMessages, 'callback');
    });
}
function getMediaFile(barcode, last) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const created = yield createBarcode(barcode);
        console.log('created', created);
        const file = yield media.createMediaFile(`https://rmi-texting.herokuapp.com/qr/show/${barcode}.png`, last);
        //.then((value: any) => console.log(value.ID))
        //.catch(console.log)
        return file;
    });
}
function createBarcode(barcode) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://rmi-texting.herokuapp.com/qr/create/${barcode}.png`)
                .then((res) => {
                console.log(`statusCode: ${res.status}`);
                //console.log(res);
                resolve(true);
            })
                .catch((error) => {
                console.error(error);
                reject(false);
            });
        });
    });
}
