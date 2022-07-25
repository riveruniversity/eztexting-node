/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { EZLogin, MultiConf, ResponseFormat } from "../types/EZTexting";
import { AttendeeWithFile } from "../rmi/Types";
export declare class MediaFilesDelete implements MultiConf {
    baseUrl: string;
    apiUrl: string;
    login: EZLogin;
    format: ResponseFormat;
    attendees: AttendeeWithFile[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    finished: number;
    constructor(format: ResponseFormat);
    deleteMediaFiles(attendees: AttendeeWithFile[]): Promise<boolean>;
    private setCurlOptions;
    private onDataHandler;
    private createPostData;
}
