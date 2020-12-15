import { CFDataview } from "./dataview/СFDataview";
import { Header } from "./Header";
import { Sector } from "./dataview/Sector";
import { DIFATSector } from "./dataview/DIFATSector";
export declare class Sectors {
    private readonly dataView;
    private readonly sectorShift;
    private readonly header;
    private readonly sectors;
    constructor(dataView: CFDataview, header: Header);
    sector(position: number): Sector;
    readSectors(): void;
    allocate(): Sector;
    allocateDIFAT(): DIFATSector;
}
