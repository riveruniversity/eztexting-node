import { EZLogin } from './EZTexting'

export interface MediaFile {
    ID: number;
    Name: string;
    Path: string;
}

export interface MediaFileOptions {
    filetype: 'png' | 'jpg' | 'jpeg' | 'gif' | 'mp3' | 'wav' | 'mp4' | '3gp';
    url: string;
    path?: string;
    isLast?: boolean;
}

export interface PostData extends MediaFile, EZLogin {}