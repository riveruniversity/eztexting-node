/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { EZLogin, MultiConf, ResponseFormat } from "../types/EZTexting";
import { MediaFileOptions } from "../types/MediaFiles";
import { Attendee } from "../rmi/Types";
export declare class MediaFiles implements MultiConf {
    baseUrl: string;
    apiUrl: string;
    login: EZLogin;
    format: ResponseFormat;
    attendees: Attendee[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    finished: number;
    constructor(format: ResponseFormat);
    createMediaFiles(attendees: Attendee[], params: MediaFileOptions): Promise<Attendee[]>;
    private setCurlOptions;
    private onDataHandler;
    private createPostData;
}
