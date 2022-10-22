/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { EZLogin, MultiCurlConf, ResponseFormat } from "../types/EZTexting";
import { Message, MessageWithFile } from "../types/Messages";
export declare class MediaFilesDelete implements MultiCurlConf {
    baseUrl: string;
    apiUrl: string;
    login: EZLogin;
    format: ResponseFormat;
    messages: Message[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    finished: number;
    callbacks: Function[];
    callback: boolean;
    constructor(format: ResponseFormat);
    deleteMediaFile(message: MessageWithFile, callback?: Function): void;
    private responseHandler;
    private setCurlOptions;
    private onDataHandler;
    private createPostData;
}
