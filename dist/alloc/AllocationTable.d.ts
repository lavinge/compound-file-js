import { Sectors } from "../Sectors";
import "../Long";
import { Sector } from "../dataview/Sector";
export declare class AllocationTable {
    static readonly ENTRIES_IN_ONE_FAT_SECTOR = 128;
    protected readonly sectors: Sectors;
    protected readonly sectorChain: number[];
    private readonly sectorSize;
    constructor(sectors: Sectors, sectorChain: number[], sectorSize: number);
    buildChain(currentSector: number): number[];
    getValueAt(position: number): number;
    registerSector(sectorPosition: number, previousSectorPosition: number): void;
    protected getFatSectorPointingToAllocatedSector(sectorPosition: number): Sector;
    protected allocateNewSector(): Sector;
    protected calculatePositionInsideFatSector(sectorPosition: number): number;
}
