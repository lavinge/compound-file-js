import { Header } from "../Header";
import { Sectors } from "../Sectors";
import { FATtoDIFATFacade } from "./FATtoDIFATFacade";
import { AllocationTable } from "./AllocationTable";
import { Sector } from "../dataview/Sector";
export declare class FAT extends AllocationTable {
    private readonly header;
    private readonly difat;
    constructor(sectors: Sectors, header: Header, difat: FATtoDIFATFacade);
    registerDifatSector(position: number): void;
    protected allocateNewSector(): Sector;
}
