import { StorageDirectoryEntry } from "./StorageDirectoryEntry";
import { DirectoryEntryChain } from "./DirectoryEntryChain";
import { CFDataview } from "../dataview/СFDataview";
import { ColorFlag, DirectoryEntry, ObjectType } from "./DirectoryEntry";
export declare class RootStorageDirectoryEntry extends StorageDirectoryEntry {
    static readonly NAME = "Root Entry";
    static readonly ID = 0;
    constructor(id: number, directoryEntryChain: DirectoryEntryChain, view: CFDataview, name?: string, colorFlag?: ColorFlag, objectType?: ObjectType);
    getChild(): DirectoryEntry;
    setRightSibling(rightSibling: DirectoryEntry): void;
    setLeftSibling(leftSibling: DirectoryEntry): void;
    setDirectoryEntryName(name: string): void;
}
