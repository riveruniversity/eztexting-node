# eztexting-node
📨 Send single, bulk and bulk individual SMS and MMS with [node-libcurl](https://www.npmjs.com/package/node-libcurl) using the EZTexting REST API.

🔀 Requests are being send async via the libcurl Multi and Easy handler. 

🚧 Messages are being sent but request responses are currently only logged in the console. I'm working on adding a callback parameter.

## Environment Dependencies
Create a `.env` file in your root folder and add 3 variables `USR`, `PWD`, and `CRT_PATH`:

```
USR=eztexting_user
PWD=eztexting_pa$$word
CRT_PATH=path/to/certificate/cert.pem
```

> [Dotenv](https://www.dotenv.org/)	: The worldwide standard for securing environment variables



## Install Dev Dependencies
### TypeScript

`npm i @types/node eslint ts-node typescript --save-dev`

### Nodemon (optional)
I personally like to code TypeScript with [nodemon](https://www.npmjs.com/package/nodemon)
> nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

Install: `npm i nodemon --save-dev`
Script: `tsc --project tsconfig.json`

## Send one message to a single phone number

```javascript
import { Messages } from 'eztexting-node'
import { Message, ResponseFormat } from 'eztexting-node'

const format: ResponseFormat = 'json';

const singleMessage: Message[] = [
	{PhoneNumbers: '2057404127', Message: 'Single message', StampToSend: '2022-06-10 16:15'}
]

new Messages(format).sendMessage(singleMessage, 'callback')
```


## Send the same message to multiple phone numbers

```javascript
import { Messages } from 'eztexting-node'
import { Message, ResponseFormat } from 'eztexting-node'

const format: ResponseFormat = 'json';

const bulkMessages: Message[] = [
	{PhoneNumbers: ['2057404127', '205-740-4177'], Subject: "1", Message: "Bulk message"}
];

new Messages(format).sendMessage(bulkMessages, 'callback')
```


## Send individual messages to specific phone numbers

```javascript
import { Messages } from 'eztexting-node'
import { Message, ResponseFormat } from 'eztexting-node'

const format: ResponseFormat = 'json';

const individualMessages: Message[] = [
	{PhoneNumbers: "2057404127", Subject: "1",Message: "Individual message 1"},
	{PhoneNumbers: "205-740-4177", Subject: "2",Message: "Individual message 2"},
	{PhoneNumbers: "(205) 740-4181", Subject: "3",Message: "Individual message 3"}
];

new Messages(format).sendMessage(individualMessages, 'callback')
```


# Send a generated QR Code as picture to specific phone numbers

```javascript
🚧 Working on it...
```


# SSL Certification

https://github.com/JCMais/node-libcurl/blob/develop/COMMON_ISSUES.md

