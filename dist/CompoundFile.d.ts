import { CFDataview } from "./dataview/СFDataview";
import "./Long";
import { RootStorageDirectoryEntry } from "./directory/RootStorageDirectoryEntry";
export declare class CompoundFile {
    private readonly header;
    private readonly difat;
    private readonly sectors;
    private readonly fat;
    private readonly miniFat;
    private readonly directoryEntryChain;
    private dataView;
    static fromBytes(bytes: number[]): CompoundFile;
    static fromUint8Array(bytes: Uint8Array): CompoundFile;
    constructor(dataView?: CFDataview);
    private static empty;
    getMiniStreamFirstSectorLocation(): number;
    getMiniStreamLength(): number;
    setMiniStreamFirstSectorLocation(position: number): void;
    setMiniStreamLength(size: number): void;
    getRootStorage(): RootStorageDirectoryEntry;
    asBytes(): number[];
    rewrite(): CompoundFile;
    private copyConsumer;
}
