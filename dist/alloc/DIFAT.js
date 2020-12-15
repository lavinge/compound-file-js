"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var Long = __importStar(require("long"));
require("../Long");
var DIFATSector_1 = require("../dataview/DIFATSector");
var DIFAT = /** @class */ (function () {
    function DIFAT(sectors, header, faTtoDIFATFacade) {
        this.difatSectors = [];
        this.sectors = sectors;
        this.header = header;
        this.faTtoDIFATFacade = faTtoDIFATFacade;
        this.readDifatSectors();
    }
    DIFAT.prototype.readDifatSectors = function () {
        var firstDifatSectorLocation = this.header.getFirstDifatSectorLocation();
        if (!utils_1.isEndOfChain(firstDifatSectorLocation)) {
            var lastSector = new DIFATSector_1.DIFATSector(this.sectors.sector(firstDifatSectorLocation));
            this.difatSectors.push(lastSector);
            var nextSectorPosition = Long.fromBytesLE(lastSector.subView(this.header.getSectorShift() - 4, this.header.getSectorShift()).getData()).toNumber();
            while (!utils_1.isEndOfChain(nextSectorPosition)) {
                lastSector = new DIFATSector_1.DIFATSector(this.sectors.sector(nextSectorPosition));
                this.difatSectors.push(lastSector);
                nextSectorPosition = Long.fromBytesLE(lastSector.subView(this.header.getSectorShift() - 4, this.header.getSectorShift()).getData()).toNumber();
            }
        }
    };
    DIFAT.prototype.getFatSectorChain = function () {
        var result = [];
        result.push.apply(result, this.header.getDifatEntries());
        for (var _i = 0, _a = this.difatSectors; _i < _a.length; _i++) {
            var difatSector = _a[_i];
            result.push.apply(result, difatSector.getRegisteredFatSectors());
        }
        return result;
    };
    DIFAT.prototype.registerFATSector = function (sectorPosition) {
        if (!this.header.canFitMoreDifatEntries()) {
            var difatSector = void 0;
            if (this.difatSectors.length === 0) {
                difatSector = this.sectors.allocateDIFAT();
                this.faTtoDIFATFacade.registerDifatSectorInFAT(difatSector.getPosition());
                this.header.setFirstDifatSectorLocation(difatSector.getPosition());
                this.difatSectors.push(difatSector);
                this.header.setNumberOfDifatSectors(this.difatSectors.length);
            }
            else if (!this.difatSectors[this.difatSectors.length - 1].hasFreeSpace()) {
                difatSector = this.sectors.allocateDIFAT();
                this.faTtoDIFATFacade.registerDifatSectorInFAT(difatSector.getPosition());
                this.difatSectors[this.difatSectors.length - 1].registerNextDifatSector(difatSector.getPosition());
                this.difatSectors.push(difatSector);
                this.header.setNumberOfDifatSectors(this.difatSectors.length);
            }
            else {
                difatSector = this.difatSectors[this.difatSectors.length - 1];
            }
            difatSector.registerFatSector(sectorPosition);
        }
        else {
            this.header.registerFatSector(sectorPosition);
        }
    };
    return DIFAT;
}());
exports.DIFAT = DIFAT;
//# sourceMappingURL=DIFAT.js.map