import { DIFAT } from "./DIFAT";
import { FAT } from "./FAT";
export declare class FATtoDIFATFacade {
    private difat;
    private fat;
    setDifat(difat: DIFAT): void;
    setFat(fat: FAT): void;
    getFatSectorChain(): number[];
    registerFatSectorInDIFAT(sectorPosition: number): void;
    registerDifatSectorInFAT(sectorPosition: number): void;
}
