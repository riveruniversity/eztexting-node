import { Messages } from '.'
import { Message } from '.'



// Sending a message to a single phone number
const singleMessage: Message[] = [
	{toNumbers: ['2057404127'], message: 'Single message', sendAt: '2022-06-10 16:15'}
]
//new Messages(format).sendMessages(singleMessage, 'callback')


// Sending the same message to multiple phone numbers
const bulkMessages: Message[] = [
	{toNumbers: ['2057404127', '205-740-4177'], message: "Bulk message"}
];

//new Messages(format).sendMessage(bulkMessages, 'callback')


// Sending the same message to multiple phone numbers
const individualMessages: Message[] = [
	{toNumbers: ["2057404127"], message: "Individual message 1"},
	{toNumbers: ["205-740-4177"], message: "Individual message 2"},
	{toNumbers: ["(205) 740-4181"], message: "Individual message 3"}
];

//new Messages(format).sendMessages(individualMessages, 'callback')