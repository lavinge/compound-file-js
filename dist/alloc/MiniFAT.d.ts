import { AllocationTable } from "./AllocationTable";
import { Sector } from "../dataview/Sector";
import { FAT } from "./FAT";
import { Header } from "../Header";
import { Sectors } from "../Sectors";
export declare class MiniFAT extends AllocationTable {
    private readonly header;
    private readonly fat;
    constructor(sectors: Sectors, header: Header, fat: FAT);
    protected allocateNewSector(): Sector;
}
