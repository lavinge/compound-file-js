import { CFDataview } from "../dataview/СFDataview";
import { DirectoryEntryChain } from "./DirectoryEntryChain";
import "../Long";
import { Color } from "../tree/Node";
export declare enum ColorFlag {
    RED = 0,
    BLACK = 1
}
export declare enum ObjectType {
    Storage = 1,
    Stream = 2,
    RootStorage = 5,
    Unknown = 0
}
export declare function toNodeColor(colorFlag: ColorFlag): Color;
export declare function toColorFlag(color: Color): ColorFlag;
export declare class DirectoryEntry {
    static readonly ENTRY_LENGTH = 128;
    static readonly ENTRY_NAME_MAXIMUM_LENGTH_UTF16_STRING = 31;
    static readonly ENTRY_NAME_MAXIMUM_LENGTH = 64;
    protected view: CFDataview;
    private objectType;
    private colorFlag;
    private id;
    protected directoryEntryChain: DirectoryEntryChain;
    static FLAG_POSITION: {
        DIRECTORY_ENTRY_NAME: number;
        DIRECTORY_ENTRY_NAME_LENGTH: number;
        OBJECT_TYPE: number;
        COLOR_FLAG: number;
        LEFT_SIBLING: number;
        RIGHT_SIBLING: number;
        CHILD: number;
        CLSID: number;
        STATE_BITS: number;
        CREATION_TIME: number;
        MODIFY_TIME: number;
        STARTING_SECTOR_LOCATION: number;
        STREAM_SIZE: number;
    };
    constructor(id: number, directoryEntryChain: DirectoryEntryChain, view: CFDataview, name?: string, colorFlag?: ColorFlag, objectType?: ObjectType);
    compareTo(o: DirectoryEntry): number;
    setRightSibling(rightSibling: DirectoryEntry): void;
    static setRightSibling(view: CFDataview, position: number): void;
    setLeftSibling(leftSibling: DirectoryEntry): void;
    static setLeftSibling(view: CFDataview, position: number): void;
    setDirectoryEntryName(name: string): void;
    getId(): number;
    getDirectoryEntryName(): string;
    getDirectoryEntryNameLength(): number;
    getDirectoryEntryNameLengthUTF8(): number;
    getChild(): DirectoryEntry;
    protected getChildPosition(): number;
    static getChildPosition(view: CFDataview): number;
    private setObjectType;
    getLeftSibling(): DirectoryEntry;
    getLeftSiblingPosition(): number;
    static getLeftSiblingPosition(view: CFDataview): number;
    getRightSibling(): DirectoryEntry;
    getRightSiblingPosition(): number;
    static getRightSiblingPosition(view: CFDataview): number;
    getStreamStartingSector(): number;
    setStreamStartingSector(startingSector: number): void;
    traverse(action: (d: DirectoryEntry) => void): void;
    getObjectType(): ObjectType;
    getColorFlag(): ColorFlag;
    setColorFlag(colorFlag: ColorFlag): void;
    invertColor(): void;
    setCLSID(bytes: number[]): void;
    setStateBits(bytes: number[]): void;
    setCreationTime(bytes: number[]): void;
    setModifiedTime(bytes: number[]): void;
    getCLSID(): number[];
    getStateBits(): number[];
    getCreationTime(): number[];
    getModifiedTime(): number[];
}
