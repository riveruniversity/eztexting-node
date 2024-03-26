import { Options, Extension } from "qr-code-styling-node";
export type OutputFormat = Extension;
export interface StyleOptions extends Options {
    dotsOptionsHelper?: {
        colorType: {
            single: boolean;
            gradient: boolean;
        };
        gradient: {
            linear: boolean;
            radial: boolean;
            color1: string;
            color2: string;
            rotation: string;
        };
    };
    cornersSquareOptionsHelper?: {
        colorType: {
            single: boolean;
            gradient: boolean;
        };
        gradient: {
            linear: boolean;
            radial: boolean;
            color1: string;
            color2: string;
            rotation: string;
        };
    };
    cornersDotOptionsHelper?: {
        colorType: {
            single: boolean;
            gradient: boolean;
        };
        gradient: {
            linear: boolean;
            radial: boolean;
            color1: string;
            color2: string;
            rotation: string;
        };
    };
    backgroundOptionsHelper?: {
        colorType: {
            single: boolean;
            gradient: boolean;
        };
        gradient: {
            linear: boolean;
            radial: boolean;
            color1: string;
            color2: string;
            rotation: string;
        };
    };
}
