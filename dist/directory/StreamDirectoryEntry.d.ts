import { ColorFlag, DirectoryEntry, ObjectType } from "./DirectoryEntry";
import { DirectoryEntryChain } from "./DirectoryEntryChain";
import { CFDataview } from "../dataview/СFDataview";
import "../Long";
import { StreamHolder } from "../stream/StreamHolder";
export declare class StreamDirectoryEntry extends DirectoryEntry {
    private readonly streamHolder;
    constructor(id: number, directoryEntryChain: DirectoryEntryChain, streamHolder: StreamHolder, view: CFDataview, name?: string, colorFlag?: ColorFlag, objectType?: ObjectType);
    getStreamData(): number[];
    setStreamData(data: number[]): void;
    read(fromIncl: number, toExcl: number): number[];
    writeAt(position: number, data: number[]): void;
    append(data: number[]): void;
    setStreamSize(length: number): void;
    getStreamSize(): number;
    hasStreamData(): boolean;
}
