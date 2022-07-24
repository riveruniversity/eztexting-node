/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { EZLogin, MultiConf, ResponseFormat } from "../types/EZTexting";
import { Message } from "../types/Messages";
export declare class Messages implements MultiConf {
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
    sendMessages(messages: Message[], callback: any): void;
    private setCurlOptions;
    private onResponseHandler;
    private onDataHandler;
    private createPostData;
}
