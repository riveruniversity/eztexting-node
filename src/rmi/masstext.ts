import axios from 'axios'

import { Messages, MediaFilesCreate, MediaFilesDelete } from '..'
import { Message, MessageWithFile, ResponseFormat } from '..'
import { Util } from '..'

import { Attendee, AttendeeWithFile } from './Types'

// >>> Settings
import { attendees } from './attendees';


const timestamp = ''; //! SET TIMESTAMP 2022-11-20 15:00
//r const qrUrl = `https://rmi-texting.onrender.com`
const qrUrl = `https://rmi-texting.rmiwebservices.com`
//_const qrUrl = `http://localhost:1996`



// >>> Start
const format: ResponseFormat = 'json';
const newMedia = new MediaFilesCreate(format);
const delMedia = new MediaFilesDelete(format);
const messages = new Messages(format)


sendBulkMessages();

async function sendBulkMessages() {
	//_loadPicture()
	 await createBarcodes(attendees);
	//await Util.sleep(3000)

	for(let attendee of attendees) {

		//? const isLast: boolean = (i === (attendees.length -1)) ? true : false;

		newMedia.createMediaFile(attendee, {filetype: 'png', url: qrUrl + '/qr/show/'}, createMessage)

		await Util.sleep(500)
	}
}
//: -----------------------------------------


async function createMessage(attendee: AttendeeWithFile, error?: Error) {

	//_console.log('👤  Attendee: ', attendee.barcode)

	if (error) return;

	if(!attendee.fam) 
		var text = `Good morning ${attendee.first}. When you arrive at the conference, show your fast pass at the registration.`
	else
		var text = `${attendee.first}'s fast pass`

	//const message: MessageWithFile = {PhoneNumbers: attendee.phone, StampToSend: timestamp, MessageTypeID: '3', Message: text, FileID: attendee.file};
	const message: MessageWithFile = {PhoneNumbers: attendee.phone, StampToSend: timestamp, MessageTypeID: '3', FileID: attendee.file};

	messages.sendMessage(message, attendee, deleteMediaFile)
}
//: -----------------------------------------


async function deleteMediaFile(message: MessageWithFile, error?: Error) {

	console.log('📨  Message: ', message.PhoneNumbers)

	delMedia.deleteMediaFile(message, done)
}


async function done(message: Message) {
	console.log('✅  Done: ', message.PhoneNumbers)
}


async function createBarcodes(attendees: Attendee[], error?: Error) {
	
	console.log("🚀 createBarcodes");
	Util.logStatus({ status: 'Log', location: 'create_barcodes', message: 'started', phone: ''})

	return new Promise<void>(async (resolve) => {

		for(let i=0; i< attendees.length;i++) {

			const attendee = attendees[i]
			
			// (let attendee of attendees) {
			await axios.post(qrUrl + `/qr/create/${attendee.barcode}.png`, {
				firstName: attendee.first,
				lastName: attendee.last,
				index: i
			})
			.then((res: { status: any; config: any }) => {

				let data = JSON.parse(res.config.data)
				let percent = +((data.index+1)/attendees.length).toFixed(2) * 100
				console.log('🎫', `${data.index+1} (${percent}%)` ,'createBarcodes', res.status);
				
				//loadPicture(res.config.url)
				//newMedia.createMediaFile(attendees[data.index], {filetype: 'png', url: qrUrl + '/qr/show/'}, createMessage)
			})
			.catch((error: any) => {
				const err = JSON.stringify(error)
				console.error(error.code, error.config.url);
				Util.logStatus({ status: 'Error', location: 'create_barcodes', message: error.code + ' | ' + error.message + ' | ' + error.config.url, phone: error.status})
			});

			

		}
		Util.logStatus({ status: 'Log', location: 'create_barcodes', message: 'finished', phone: ''})
		resolve()
	})
}



async function loadPicture() {


	for(let attendee of attendees) {

		await axios.get(qrUrl + `/qr/show/${attendee.barcode}.png`)
		.catch((error: any) => {
			
			console.error('showUrl', error.code, error.config.url);
			Util.logStatus({ status: 'Error', location: 'load_picture', message: error.code + ' | ' + error.message + ' | ' + error.config.url, phone: error.status})
		});
	}
}


	