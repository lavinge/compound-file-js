import { CFDataview } from "./dataview/СFDataview";
export declare class DifatEntries {
    private readonly view;
    private readonly difatEntries;
    constructor(dataView: CFDataview);
    getDifatEntries(): number[];
    registerFatSector(sectorPosition: number): void;
    isFull(): boolean;
}
