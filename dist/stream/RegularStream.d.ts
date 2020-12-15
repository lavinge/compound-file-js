import { FAT } from "../alloc/FAT";
import { Header } from "../Header";
import { Sectors } from "../Sectors";
import { StreamRW } from "./StreamRW";
export declare class RegularStreamRW implements StreamRW {
    private readonly fat;
    private readonly sectors;
    private readonly header;
    constructor(fat: FAT, sectors: Sectors, header: Header);
    read(startingSector: number, lengthOrFromIncl: number, toExcl?: number): number[];
    write(data: number[]): number;
    writeAt(startingSector: number, position: number, data: number[]): void;
    append(startingSector: number, currentSize: number, data: number[]): number;
    private howManyChunksNeeded;
}
