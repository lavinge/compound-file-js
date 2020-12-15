import { ColorFlag, DirectoryEntry, ObjectType } from "./DirectoryEntry";
import { NodeFactory, RedBlackTree } from "../tree/RedBlackTree";
import { DirectoryEntryChain } from "./DirectoryEntryChain";
import { CFDataview } from "../dataview/СFDataview";
import { StreamDirectoryEntry } from "./StreamDirectoryEntry";
import "../Long";
export declare class StorageDirectoryEntry extends DirectoryEntry {
    static readonly NODE_FACTORY: NodeFactory<DirectoryEntry>;
    protected readonly tree: RedBlackTree<DirectoryEntry>;
    constructor(id: number, directoryEntryChain: DirectoryEntryChain, view: CFDataview, name?: string, colorFlag?: ColorFlag, objectType?: ObjectType);
    setChildDirectoryEntry(entry: DirectoryEntry): void;
    private addChild;
    addStream(name: string, data: number[]): StreamDirectoryEntry;
    addStorage(name: string): StorageDirectoryEntry;
    findChild<T extends DirectoryEntry>(predicate: (dirEntry: DirectoryEntry) => boolean): T;
    findChildren(predicate: (dirEntry: DirectoryEntry) => boolean): DirectoryEntry[];
    children(): DirectoryEntry[];
    storages(): StorageDirectoryEntry[];
    streams(): StreamDirectoryEntry[];
    eachChild(consumer: (directoryEntry: DirectoryEntry) => void, stopPredicate?: (dirEntry: DirectoryEntry) => boolean): void;
}
