/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { MultiCurlConf } from "../types/EZTexting";
import { Message } from "../types/Messages";
import { Contact } from "../types/Contacts";
export declare class Messages implements MultiCurlConf {
    baseUrl: string;
    apiUrl: string;
    login: string;
    messages: Message[];
    contacts: Contact[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    waitBeforeClose: number;
    finished: number;
    callbacks: Function[];
    callback: boolean;
    constructor();
    sendMessage(message: Message, attendee: Contact, callback: Function): void;
    private onResponseHandler;
    private setCurlOptions;
    private onDataHandler;
    private createPostData;
    get activeHandles(): number;
}
