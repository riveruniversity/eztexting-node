const axios = require('axios');

import { Messages, MediaFiles } from '..'
import { Message, MediaFile, ResponseFormat } from '..'
import * as Util from '../service/Util'

import { Attendee } from './Types'

import { attendees } from './attendees';

// Testing /*
/*
const attendees: Attendee[] = [
	{'name' : "Wilhelm", 'phone' : '8134507575', 'barcode' : '41404608996650941709001', 'fam' : true}
]
*/


const format: ResponseFormat = 'json';
const media = new MediaFiles(format);
const messages = new Messages(format)

const timestamp = '2022-08-31 15:00'; //! SET TIMESTAMP

sendBulkMessages();


async function sendBulkMessages() {
	await createBarcodes(attendees);
	await media.createMediaFiles(attendees, {filetype: 'png', url: `https://rmi-texting.herokuapp.com/qr/show/`}, timestamp);
	//r const attendeeMediaList: Attendee[] = await media.createMediaFiles(attendees, {filetype: 'png', url: `https://rmi-texting.herokuapp.com/qr/show/`});
	//r createMessages(attendeeMediaList, timestamp); 
}


async function createMessages(attendees: Attendee[], timestamp: string) {

	const individualMessages: Message[] = []

	for(let i in attendees) {

		const attendee = attendees[i]

		if(!attendee.fam) 
			var message = `Good morning ${attendee.name}. When you arrive at the conference, show your fast pass at the registration.`
		else
			var message = `${attendee.name}'s fast pass`

		individualMessages.push({PhoneNumbers: attendee.phone, StampToSend: timestamp, MessageTypeID: '3', Message: message, FileID: attendee.file});
	}

	messages.sendMessages(individualMessages, 'callback')
}



async function createBarcodes(attendees: Attendee[]) {
	
	console.log("🚀 createBarcodes");
	Util.logStatus({ status: 'Log', location: 'create_barcodes', message: 'started', phone: ''})

	return new Promise<void>(async (resolve) => {

		for (let attendee of attendees) {
			await axios.get(`https://rmi-texting.herokuapp.com/qr/create/${attendee.barcode}.png`)
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
		Util.logStatus({ status: 'Log', location: 'create_barcodes', message: 'finished', phone: ''})
		resolve()
	})
}