# eztexting-node
📨 Send single, bulk and bulk individual SMS and MMS [node-libcurl](https://www.npmjs.com/package/node-libcurl) using the EZTexting REST API.

🔀 Requests are being send async via the libcurl Multi and Easy handler. 

🚧 Messages are being sent but request responses are currently only logged in the console. I'm working on adding a callback parameter.



## Send one message to a single phone number
---

```javascript
import { Messages } from 'eztexting-node'
import { Message, ResponseFormat } from 'eztexting-node'

const singleMessage: Message[] = [
	{PhoneNumbers: '2057404127', Message: 'Single message', StampToSend: '2022-06-10 16:15'}
]

new Messages(format).sendMessage(singleMessage, 'callback')
```


## Send the same message to multiple phone numbers
---
```javascript
import { Messages } from 'eztexting-node'
import { Message, ResponseFormat } from 'eztexting-node'

const bulkMessages: Message[] = [
	{PhoneNumbers: ['2057404127', '205-740-4177'], Subject: "1", Message: "Bulk message"}
];

new Messages(format).sendMessage(bulkMessages, 'callback')
```


## Send individual messages to specific phone numbers
---
```javascript
import { Messages } from 'eztexting-node'
import { Message, ResponseFormat } from 'eztexting-node'

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

