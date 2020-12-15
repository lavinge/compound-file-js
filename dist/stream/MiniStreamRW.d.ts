import { FAT } from "../alloc/FAT";
import { MiniFAT } from "../alloc/MiniFAT";
import { Header } from "../Header";
import { Sectors } from "../Sectors";
import { CFDataview } from "../dataview/СFDataview";
import { Sector } from "../dataview/Sector";
import { StreamRW } from "./StreamRW";
export declare class MiniStreamRW implements StreamRW {
    static readonly MINI_STREAM_CHUNK_SIZE = 64;
    private readonly miniFAT;
    private readonly header;
    private miniStreamLength;
    private readonly fat;
    private readonly miniStreamSectorChain;
    private readonly sectors;
    constructor(miniFAT: MiniFAT, fat: FAT, firstMiniStreamSector: number, miniStreamLength: number, sectors: Sectors, header: Header);
    read(startingSector: number, lengthOrFromIncl: number, toExcl?: number): number[];
    getMiniSectorData(position: number): CFDataview;
    write(data: number[]): number;
    howManyChunksNeeded(dataLength: number): number;
    writeAt(startingSector: number, position: number, data: number[]): void;
    append(startingSector: number, currentSize: number, data: number[]): number;
    getDataHolderForNextChunk(): CFDataview;
    getSectorForNextChunk(): Sector;
    getMiniStreamLength(): number;
    getMiniStreamFirstSectorPosition(): number;
}
