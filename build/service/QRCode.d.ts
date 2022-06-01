/// <reference types="node" />
import { OutputFormat, StyleOptions } from "../types/QRCode";
export declare class QRCodeGenerator {
    format: OutputFormat;
    fileName: string;
    buffer: Promise<Buffer>;
    generate(format: import("qr-code-styling-node").Extension | undefined, codeData: string, style?: StyleOptions): Promise<Buffer>;
    save(fileName?: string, filePath?: string): Promise<void>;
}
