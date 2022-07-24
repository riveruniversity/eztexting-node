const axios = require('axios');
const fse = require("fs-extra");

import { Messages, MediaFiles } from '..'
import { Message, MediaFile, ResponseFormat } from '..'

import { Attendee } from './Types'

//import { attendees } from './attendees';

const attendees: Attendee[] = [
	//{'name' : "Mikela", 'phone' : '8082053678', 'barcode' : '39966413496402920759001', 'fam' : false},
	{'name' : "Wilhelm", 'phone' : '8134507575', 'barcode' : '41404608996650941709001', 'fam' : false}
]


const format: ResponseFormat = 'json';
const media = new MediaFiles(format);
const messages = new Messages(format)

const attendeeList = getAttendees(attendees);


async function getAttendees(attendees: Attendee[]) {

	const individualMessages: Message[] = []

	for(let i in attendees) {

		const attendee = attendees[i]

		const last = Number(i)+1 == attendees.length ? true : false;
		const file: MediaFile = await getMediaFile(attendee.barcode, last)

		if(!attendee.fam) 
			var message = `Good morning ${attendee.name}. Show this fast pass at the registration.`
		else
			var message = `${attendee.name}'s fast pass`

		individualMessages.push({PhoneNumbers: attendee.phone, StampToSend: '2022-07-24 02:05', MessageTypeID: '3', Message: message, FileID: file.ID});
	}

	
	messages.sendMessage(individualMessages, 'callback')

}



async function getMediaFile(barcode: string, last: boolean) {

	const created = await createBarcode(barcode)
	console.log('created', created);
	
	
	const file: MediaFile | any = await media.createMediaFile(`https://rmi-texting.herokuapp.com/qr/show/${barcode}.png`, last)
	//.then((value: any) => console.log(value.ID))
	//.catch(console.log)

	return file
}


async function createBarcode(barcode: string) {
	

	return new Promise<boolean>((resolve, reject) => {

		axios
		.get(`https://rmi-texting.herokuapp.com/qr/create/${barcode}.png`)
		.then((res: { status: any; }) => {
			console.log(`statusCode: ${res.status}`);
			//console.log(res);
			resolve(true);
		})
		.catch((error: any) => {
			console.error(error);
			reject(false);
		});
	});
}