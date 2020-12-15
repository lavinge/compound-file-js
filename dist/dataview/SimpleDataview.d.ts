import { CFDataview } from "./СFDataview";
/**
 * @internal
 */
export declare class SimpleDataview implements CFDataview {
    private readonly data;
    constructor(data: NonNullable<number[]>);
    writeAt(position: number, bytes: number[]): CFDataview;
    getSize(): number;
    getData(): number[];
    subView(start: number, end?: number): CFDataview;
    allocate(length: number): CFDataview;
    fill(filler: number[]): CFDataview;
    readAt(position: number, length: number): number[];
    isEmpty(): boolean;
}
