import { CFDataview } from "./СFDataview";
/**
 * @internal
 */
export declare class ReferencingSubview implements CFDataview {
    private readonly capacity;
    private readonly start;
    private readonly end;
    private readonly delegate;
    constructor(delegate: CFDataview, start: number, end: number);
    writeAt(position: number, bytes: number[]): CFDataview;
    getSize(): number;
    getData(): number[];
    subView(start: number, end?: number): CFDataview;
    allocate(length: number): CFDataview;
    fill(filler: number[]): CFDataview;
    readAt(position: number, length: number): number[];
    isEmpty(): boolean;
}
