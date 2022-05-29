import { EZLogin } from './EZTexting'

export interface Message {
    PhoneNumbers?: string | string[] | number | number[];
    Groups?: string | string[];
    Subject?: string;
    Message?: string;
    MessageTypeID?: '1' | '2' | '3';
    FileID?: string;
	StampToSend?: string;
}

export interface PostData extends Message, EZLogin {}


// yyyy-mm-dd HH:MM
export type EZTimeStamp = `${number}${number}${number}${number}-${number}${number}-${number}${number} ${number}${number}:${number}${number}`
export type PhoneNumber = `${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}`

export type ResponseFormat = 'json' | 'xml';