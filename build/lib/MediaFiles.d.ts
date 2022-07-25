/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { EZLogin, MultiConf, ResponseFormat } from "../types/EZTexting";
import { MediaFileOptions } from "../types/MediaFiles";
import { Attendee, AttendeeWithFile } from "../rmi/Types";
export declare class MediaFiles implements MultiConf {
    baseUrl: string;
    apiUrl: string;
    login: EZLogin;
    format: ResponseFormat;
    attendeesList: Attendee[];
    attendeesChunk: AttendeeWithFile[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    finished: number;
    constructor(format: ResponseFormat);
    createMediaFiles(attendees: Attendee[], params: MediaFileOptions): Promise<Attendee[]>;
    private setCurlOptions;
    private onDataHandler;
    private createPostData;
    createMessages(attendees: AttendeeWithFile[], timestamp: string): Promise<void>;
    deleteMediaFiles(attendees: AttendeeWithFile[]): Promise<void>;
}
