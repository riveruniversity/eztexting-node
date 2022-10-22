import { Curl } from "node-libcurl";
import { EZLogin, ResponseFormat } from "../types/EZTexting";
import { MediaFile } from "../types/MediaFiles";
export declare class MediaFiles {
    baseUrl: string;
    apiUrl: string;
    login: EZLogin;
    format: ResponseFormat;
    curl: Curl;
    constructor(format: ResponseFormat);
    createMediaFile(source: string, closeConnection?: boolean): Promise<MediaFile | unknown>;
    private setCurlOptions;
    private setEndHandler;
    private setErrorHandler;
    private createPostData;
}
