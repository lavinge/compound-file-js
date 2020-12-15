import { CFDataview } from "./СFDataview";
/**
 * @internal
 */
export declare class FixedSizeChunkedDataview implements CFDataview {
    private readonly chunkSize;
    private readonly chunks;
    constructor(chunkSize: number, dataChunks?: number[] | CFDataview[]);
    writeAt(position: number, bytes: number[]): CFDataview;
    getSize(): number;
    getData(): number[];
    subView(start: number, end?: number): CFDataview;
    allocate(length: number): CFDataview;
    fill(filler: number[]): CFDataview;
    readAt(position: number, length: number): number[];
    isEmpty(): boolean;
}
