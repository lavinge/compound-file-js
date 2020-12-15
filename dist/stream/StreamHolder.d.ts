import { StreamRW } from "./StreamRW";
export declare class StreamHolder {
    private readonly regularStreamRW;
    private readonly miniStreamRW;
    private readonly sizeThreshold;
    constructor(regularStreamRW: StreamRW, miniStreamRW: StreamRW, sizeThreshold: number);
    private forSize;
    getStreamData(startingLocation: number, size: number): number[];
    setStreamData(data: number[]): number;
    read(startingLocation: number, size: number, fromIncl: number, toExcl: number): number[];
    writeAt(startingLocation: number, size: number, position: number, data: number[]): void;
    append(startingLocation: number, size: number, data: number[]): number;
}
