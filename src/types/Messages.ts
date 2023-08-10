import { EZLogin } from './EZTexting'

export interface Message {
    toNumbers?: string[];
    groupIds?: string | string[];
    // Subject?: string;
    message?: string;
    // MessageTypeID?: '1' | '2' | '3';
    mediaFileId?: string;
    mediaUrl?: string;
	  sendAt?: string;
}

export interface MessageWithFile extends Message {
    mediaFileId: string;
}

export interface PostData extends Message, EZLogin {}


// yyyy-mm-dd HH:MM
export type EZTimeStamp = `${number}${number}${number}${number}-${number}${number}-${number}${number} ${number}${number}:${number}${number}`
export type PhoneNumber = `${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}`