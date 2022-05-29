# eztexting-node
Send async single, bulk and bulk individual SMS and MMS node-libcurl using the EZTexting REST API.


# Send a single message

```javascript
import { EZTexting } from "../index";
import { MessageFormat } from '../types/message'


// Send single message

```


# Send bulk messages

🚧 🚧 🚧 
I'm working on it. Throws an Error('Handle already running!')



```javascript
import { EZTexting } from "../index";
import { MessageFormat } from '../types/message'


// Send bulk messages
const optionBulk: MessageFormat = { 
    format: "json"
};

const messages = [
    {'PhoneNumbers' : '8134507575', 'subject' : '1', 'Message': JSON.stringify(new Date)},
    {'PhoneNumbers' : '8134507575', 'subject' : '2', 'Message': JSON.stringify(new Date)},
    {'PhoneNumbers' : '8134507575', 'subject' : '3', 'Message': JSON.stringify(new Date)},
    {'PhoneNumbers' : '8134507575', 'subject' : '4', 'Message': JSON.stringify(new Date)},
    {'PhoneNumbers' : '8134507575', 'subject' : '5', 'Message': JSON.stringify(new Date)}
]

const ez = new EZTexting().sendBulkMessage(optionBulk, messages, 'callback');
```


# SSL Certification

https://github.com/JCMais/node-libcurl/blob/develop/COMMON_ISSUES.md

