import { EZLogin } from './EZTexting';
export interface Message {
    toNumbers?: string[];
    groupIds?: string | string[];
    message?: string;
    mediaFileId?: string;
    mediaUrl?: string;
    sendAt?: string;
}
export interface MessageWithFile extends Message {
    mediaFileId: string;
}
export interface PostData extends Message, EZLogin {
}
export type EZTimeStamp = `${number}${number}${number}${number}-${number}${number}-${number}${number} ${number}${number}:${number}${number}`;
export type PhoneNumber = `${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}`;
