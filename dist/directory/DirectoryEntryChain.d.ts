import { Sectors } from "../Sectors";
import { Header } from "../Header";
import { StreamHolder } from "../stream/StreamHolder";
import { FAT } from "../alloc/FAT";
import { DirectoryEntry, ColorFlag } from "./DirectoryEntry";
import { StreamDirectoryEntry } from "./StreamDirectoryEntry";
import { StorageDirectoryEntry } from "./StorageDirectoryEntry";
import { RootStorageDirectoryEntry } from "./RootStorageDirectoryEntry";
export declare class DirectoryEntryChain {
    static readonly UTF16_TERMINATING_BYTES: number[];
    private readonly sectors;
    private readonly fat;
    private readonly header;
    private readonly sectorChain;
    private readonly streamHolder;
    private directoryEntryCount;
    constructor(sectors: Sectors, fat: FAT, header: Header, streamHolder: StreamHolder);
    private readDirectoryEntryCount;
    getRootStorage(): RootStorageDirectoryEntry;
    getEntryById(i: number): DirectoryEntry;
    createRootStorage(): RootStorageDirectoryEntry;
    createStorage(name: string, colorFlag: ColorFlag): StorageDirectoryEntry;
    createStream(name: string, colorFlag: ColorFlag, data: number[]): StreamDirectoryEntry;
    private getViewForDirectoryEntry;
}
