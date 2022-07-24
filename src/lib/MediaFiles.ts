// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";

import path, { resolve } from "path";


// Services
import * as EZService from "../service/EZTexting";
import { setMessageParams } from '../service/Messages';

// Types
import { EZLogin, MediaFilesConf, ResponseFormat } from "../types/EZTexting";
import { MediaFile, PostData } from "../types/MediaFiles";

// Conf
import { conf } from '../conf/curl'
import { rejects } from "assert";



export class MediaFiles implements MediaFilesConf {

	baseUrl = conf.baseUrl
	apiUrl = '/sending/files?format='
	login: EZLogin;

    format: ResponseFormat = 'json';

    curl: Curl;


	constructor(format: ResponseFormat) {
		EZService.initDotenv();

		this.login = EZService.checkLoginInfo();
		
		this.format = format
		this.curl = new Curl();
	}


	async createMediaFile (source: string , closeConnection: boolean = true): Promise<MediaFile|unknown> {

		console.log("🚀 createMediaFile");

        console.log(source);
        
		const promise = new Promise((resolve, reject) => {

            this.curl.on('end', (statusCode: number, body: string, headers: any, curlInstance: Curl) => {
                console.info('Status Code: ', statusCode)
                //- console.info('Headers: ', headers)
                //- console.info('Body length: ', body.length)
                //- console.info('Body: ', body)
    
                const Jsonfile = JSON.parse(body)
                const mediaFile: MediaFile =Jsonfile.Response.Entry
              
                // always close the `Curl` instance when you don't need it anymore
                // Keep in mind we can do multiple requests with the same `Curl` instance
                //  before it's closed, we just need to set new options if needed
                //  and call `.perform()` again.
                //r this.close = this.curl.close.bind(this.curl);
                if (closeConnection) this.curl.close();
                resolve(mediaFile)
            })

            this.curl.on('error', (error, errorCode) => {
                console.error('Error: ', error)
                console.error('Code: ', errorCode)
                this.curl.close()
                reject(error)
            })

            this.curl.perform();
            
        })

		this.setCurlOptions(source);
        //this.setEndHandler(closeConnection);
        //this.setErrorHandler();
        
        return promise
	}


	private setCurlOptions(source: string) {
		this.curl.setOpt(Curl.option.URL, this.baseUrl + this.apiUrl + this.format);
		this.curl.setOpt(Curl.option.POST, true);
		this.curl.setOpt(Curl.option.POSTFIELDS, this.createPostData(source));
		this.curl.setOpt(Curl.option.CAINFO, EZService.getCertificate());
		this.curl.setOpt(Curl.option.FOLLOWLOCATION, true);
	}


    private setEndHandler(closeConnection: boolean) {
        this.curl.on('end', (statusCode: number, body: string, headers: any, curlInstance: Curl) => {

        })
    }


    private setErrorHandler() {
        this.curl.on('error', (error, errorCode) => {

        })
    }

    
	private createPostData(source: string) {
	
		const postLogin: EZLogin = EZService.checkLoginInfo();
		const postParams: Object  = {Source: source}
		const postData: PostData | any = {...postLogin, ...postParams}
        const postString = new URLSearchParams(postData).toString();

        const params = `User=${postLogin.User}&Password=${postLogin.Password}&Source=${source}`
        
		return params
	}
}