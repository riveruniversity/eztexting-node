/// <reference types="node" />
import { Easy, Multi, CurlCode } from "node-libcurl";
import { Message, ResponseFormat } from "../types/Messages";
import { EZLogin, CurlConf } from "../types/EZTexting";
export declare class Messages implements CurlConf {
    baseUrl: string;
    apiUrl: string;
    login: EZLogin;
    format: ResponseFormat;
    messages: Message[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    finished: number;
    constructor(format: ResponseFormat);
    sendMessage(messages: Message[], callback: any): void;
    setCurlOptions(message: Message, i: number): void;
    onResponseHandler: (error: Error, handle: Easy, errorCode: CurlCode) => void;
    onDataHandler(handle: Easy, data: Buffer, size: number, nmemb: number): number;
    createPostData(message: Message): string;
}
