import { Sector } from "./Sector";
import { CFDataview } from "./СFDataview";
export declare class SimpleSector implements Sector {
    private readonly view;
    private readonly position;
    constructor(view: CFDataview, position: number);
    getPosition(): number;
    writeAt(position: number, bytes: number[]): Sector;
    getSize(): number;
    getData(): number[];
    subView(start: number, end?: number): CFDataview;
    allocate(length: number): CFDataview;
    fill(filler: number[]): Sector;
    readAt(position: number, length: number): number[];
    static from(view: CFDataview, position: number, filler?: number[]): Sector;
    isEmpty(): boolean;
}
