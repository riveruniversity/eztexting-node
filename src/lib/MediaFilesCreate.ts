// Dependencies
import { Curl, Easy, Multi, CurlCode } from "node-libcurl";

// Services
import * as EZService from "../service/EZTexting";
import * as Util from '../service/Util'

// Types
import { EZLogin, MultiCurlConf } from "../types/EZTexting";
import { MediaFile } from "../types/MediaFiles";
import { Log } from "../service/Util";
import { Contact } from "../types/Contacts"


// Conf
import { conf } from '../conf/curl'


export class MediaFilesCreate implements MultiCurlConf {

  baseUrl = conf.baseUrl
  apiUrl = '/media-files'
  login: string;
  verbose: boolean = false;

  contacts: Contact[] = [];

  multi: Multi;
  handles: Easy[] = [];
  handlesData: Buffer[] | any = [];
  waitBeforeClose: number = 15000; // ms
  finished: number = 0;

  callbacks: Function[] = [];
  callback: boolean = false;


  constructor(verbose: boolean = false) {
    EZService.initDotenv();

    this.verbose = verbose;
    this.login = EZService.getAuth();
    this.multi = new Multi();
  }
  //: _________________________________________


  createMediaFile(contact: Contact, url: string, callback?: Function): void {

    const count = this.contacts.push(contact);
    if (this.verbose) console.log("🚀", count - 1, "createMediaFile ", contact.barcode);

    if (callback) {
      this.callback = true
      this.callbacks.push(callback)
    }

    this.multi.onMessage(this.responseHandler);

    //* start the request
    this.setCurlOptions(url, count - 1)
  }
  //: -----------------------------------------


  private responseHandler = async (error: Error, handle: Easy, errorCode: CurlCode) => {
    const responseCode = handle.getInfo("RESPONSE_CODE").data;
    const handleUrl = handle.getInfo("EFFECTIVE_URL");
    const handleIndex: number = this.handles.indexOf(handle);
    const handleData: Buffer[] = this.handlesData[handleIndex];
    const handlePhone: string | any = this.contacts[handleIndex].phone;

    if (this.verbose) console.log("🛬", handleIndex, "createMediaFile returned: ", responseCode);
    //i console.log("📞  Phone: ", handlePhone);
    //i console.log("☁️  media file: ", handleIndex);
    if (this.verbose) console.log(`🔗  handleUrl:`, handleUrl.data)
    if (this.verbose) console.log("💠  active create handles: ", this.multi.getCount());

    // remove completed from the Multi instance and close it
    this.multi.removeHandle(handle);
    handle.close();

    if (!error) {
      const responseData: string = handleData.join().toString();

      if (responseCode == 201 || responseCode == 200) {
        try {
          const json = JSON.parse(responseData) as { id: string; };
          const { id: fileId } = json;
          this.contacts[handleIndex].file = fileId  // Add new File ID to Attendees Array

          var log: Partial<Log> = { status: 'Success', message: 'File: ' + fileId }
        }
        catch (err) {
          console.log(`↩️ `, responseData)
          var log: Partial<Log> = { status: 'Error', message: responseData }
        }

      }
      else {
        console.log(`↩️ `, responseData)
        var log: Partial<Log> = { status: 'Error', message: responseData }
      }


    }
    else {
      console.log(handlePhone, ' returned error: "', error.message, '" with errorcode: ', errorCode);
      var log: Partial<Log> = { status: 'Curl Error', message: error.message }
    }

    const completeLog: Log = { status: log.status!, message: log.message!, phone: handlePhone, location: 'create_media', id: this.contacts[handleIndex].barcode }
    Util.logStatus(completeLog)


    //* return
    if (this.callback) {
      const isError = log.status != 'Success' ? log : false;
      const callback = this.callbacks[handleIndex]
      callback(this.contacts[handleIndex], isError)
    }

    // Wait for more requests before closing 
    await Util.sleep(this.waitBeforeClose)

    // >>> All finished
    if (++this.finished === this.contacts.length) {
      console.log("🚁 finished creating all media files!");

      this.multi.close();
    }
  }
  //: -----------------------------------------


  private setCurlOptions(source: string, i: number) {

    const handle = new Easy();
    handle.setOpt(Curl.option.URL, this.baseUrl + this.apiUrl + `?&handle=${i}`);
    handle.setOpt(Curl.option.POST, true);
    handle.setOpt(Curl.option.HTTPHEADER, ['Content-Type: application/json', `Authorization: ${this.login}`]);
    handle.setOpt(Curl.option.POSTFIELDS, this.createPostData(source));
    handle.setOpt(Curl.option.CAINFO, EZService.getCertificate());
    handle.setOpt(Curl.option.FOLLOWLOCATION, true);
    handle.setOpt(Curl.option.WRITEFUNCTION, (data: Buffer, size: number, nmemb: number) => {
      return this.onDataHandler(handle, data, size, nmemb)
    });

    this.handlesData.push([]);
    this.handles.push(handle);
    this.multi.addHandle(handle);
  }
  //: -----------------------------------------


  private onDataHandler(handle: Easy, data: Buffer, size: number, nmemb: number) {

    const key = this.handles.indexOf(handle);
    this.handlesData[key].push(data);

    //_console.log("onDataHandler: =======================")
    //_console.log("#️⃣  handle: ", key)
    //_console.log("🗄️  data: ", data)

    return size * nmemb;
  }
  //: -----------------------------------------


  private createPostData(source: string) {

    return `{ "mediaUrl": "${source}" }`
  }

  get activeHandles() {
    return this.multi.getCount();
  }
}