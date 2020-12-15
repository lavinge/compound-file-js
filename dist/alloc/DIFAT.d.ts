import { Sectors } from "../Sectors";
import { Header } from "../Header";
import "../Long";
import { FATtoDIFATFacade } from "./FATtoDIFATFacade";
export declare class DIFAT {
    private readonly sectors;
    private readonly header;
    private readonly faTtoDIFATFacade;
    private readonly difatSectors;
    constructor(sectors: Sectors, header: Header, faTtoDIFATFacade: FATtoDIFATFacade);
    readDifatSectors(): void;
    getFatSectorChain(): number[];
    registerFATSector(sectorPosition: number): void;
}
