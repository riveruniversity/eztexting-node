import { EZLogin } from './EZTexting'

export interface MediaFile {
    ID: number;
    Name: string;
    Path: string;
}


export interface PostData extends MediaFile, EZLogin {}