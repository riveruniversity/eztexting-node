"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const format = 'json';
// Sending a message to a single phone number
const singleMessage = [
    { PhoneNumbers: '2057404127', Message: 'Single message', StampToSend: '2022-06-10 16:15' }
];
//new Messages(format).sendMessage(singleMessage, 'callback')
// Sending the same message to multiple phone numbers
const bulkMessages = [
    { PhoneNumbers: ['2057404127', '205-740-4177'], Subject: "1", Message: "Bulk message" }
];
//new Messages(format).sendMessage(bulkMessages, 'callback')
// Sending the same message to multiple phone numbers
const individualMessages = [
    { PhoneNumbers: "2057404127", Subject: "1", Message: "Individual message 1" },
    { PhoneNumbers: "205-740-4177", Subject: "2", Message: "Individual message 2" },
    { PhoneNumbers: "(205) 740-4181", Subject: "3", Message: "Individual message 3" }
];
//new Messages(format).sendMessage(individualMessages, 'callback')
