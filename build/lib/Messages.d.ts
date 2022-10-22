/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { EZLogin, MultiCurlConf, ResponseFormat } from "../types/EZTexting";
import { Message } from "../types/Messages";
export declare class Messages implements MultiCurlConf {
    baseUrl: string;
    apiUrl: string;
    format: ResponseFormat;
    login: EZLogin;
    messages: Message[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    finished: number;
    callbacks: Function[];
    callback: boolean;
    constructor(format?: ResponseFormat);
    sendMessage(message: Message, callback: Function): void;
    private onResponseHandler;
    private setCurlOptions;
    private onDataHandler;
    private createPostData;
}
