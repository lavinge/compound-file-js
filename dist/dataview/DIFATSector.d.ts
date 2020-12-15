import { Sector } from "./Sector";
import "../Long";
import { CFDataview } from "./СFDataview";
export declare class DIFATSector implements Sector {
    private delegate;
    private fatSectors;
    constructor(delegate: Sector);
    getPosition(): number;
    writeAt(position: number, bytes: number[]): CFDataview;
    registerFatSector(sectorPosition: number): void;
    registerNextDifatSector(sectorPosition: number): void;
    getRegisteredFatSectors(): number[];
    hasFreeSpace(): boolean;
    getSize(): number;
    getData(): number[];
    subView(start: number, end?: number): CFDataview;
    allocate(length: number): CFDataview;
    fill(filler: number[]): DIFATSector;
    isEmpty(): boolean;
    readAt(position: number, length: number): number[];
}
