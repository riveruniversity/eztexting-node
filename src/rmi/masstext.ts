import axios from 'axios'

import { Messages, MediaFilesCreate, MediaFilesDelete } from '..'
import { Message, MessageWithFile, ResponseFormat } from '..'
import * as Util from '../service/Util'

import { Attendee, AttendeeWithFile } from './Types'

// >>> Settings
//!import { attendees } from './attendees';

// Testing /*

const attendees: Attendee[] = [
	{'name' : "Willie", 'phone' : '8138990000', 'barcode' : '100001', 'fam' : false},
	{'name' : "Winnie", 'phone' : '8138990001', 'barcode' : '100002', 'fam' : true}
]

const timestamp = ''; //! SET TIMESTAMP 2022-08-31 15:00
const qrUrl = `https://rmi-texting.herokuapp.com/qr/`



// >>> Start
const format: ResponseFormat = 'json';
const newMedia = new MediaFilesCreate(format);
const delMedia = new MediaFilesDelete(format);
const messages = new Messages(format)


sendBulkMessages();

async function sendBulkMessages() {
	await createBarcodes(attendees);

	await Util.sleep(3000)

	attendees.forEach(async (attendee: Attendee, i: number) => {

		//? const isLast: boolean = (i === (attendees.length -1)) ? true : false;

		newMedia.createMediaFile(attendee, {filetype: 'png', url: qrUrl + 'show/'}, createMessage)

	});
}
//: -----------------------------------------


async function createMessage(attendee: AttendeeWithFile, error?: Error) {

	console.log('👤  Attendee: ', attendee)

	if(!attendee.fam) 
		var text = `Good morning ${attendee.name}. When you arrive at the conference, show your fast pass at the registration.`
	else
		var text = `${attendee.name}'s fast pass`

	const message: MessageWithFile = {PhoneNumbers: attendee.phone, StampToSend: timestamp, MessageTypeID: '3', Message: text, FileID: attendee.file};

	messages.sendMessage(message, deleteMediaFile)
}
//: -----------------------------------------


async function deleteMediaFile(message: MessageWithFile) {

	console.log('📨  Message: ', message)

	delMedia.deleteMediaFile(message, done)
}


function done(message: Message) {
	console.log('✅  Done: ', message)
}


async function createBarcodes(attendees: Attendee[]) {
	
	console.log("🚀 createBarcodes");
	Util.logStatus({ status: 'Log', location: 'create_barcodes', message: 'started', phone: ''})

	return new Promise<void>(async (resolve) => {

		for (let attendee of attendees) {
			await axios.get(qrUrl + `/create/${attendee.barcode}.png`)
			/*
			.then((res: { status: any; }) => {
				console.log(`statusCode: ${res.status}`);
				//console.log(res);
			})
			*/
			.catch((error: any) => {
				console.error(error);
			});

		}
		Util.logStatus({ status: 'Log', location: 'create_barcodes', message: 'finished', phone: ''})
		resolve()
	})
}