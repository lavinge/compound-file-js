"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleSector_1 = require("./dataview/SimpleSector");
var utils_1 = require("./utils");
var DIFATSector_1 = require("./dataview/DIFATSector");
var Sectors = /** @class */ (function () {
    function Sectors(dataView, header) {
        this.sectors = [];
        this.dataView = dataView;
        this.sectorShift = header.getSectorShift();
        this.header = header;
        this.readSectors();
    }
    Sectors.prototype.sector = function (position) {
        if (position > this.sectors.length) {
            throw new Error();
        }
        return this.sectors[position];
    };
    Sectors.prototype.readSectors = function () {
        // Skip first 512 bytes designated for Header
        if (!this.dataView.isEmpty()) {
            if (this.dataView.getSize() % this.sectorShift !== 0)
                throw new Error();
            for (var i = 1; i < this.dataView.getSize() / this.sectorShift; i++) {
                this.sectors.push(SimpleSector_1.SimpleSector.from(this.dataView.subView(i * this.sectorShift, (i + 1) * this.sectorShift), this.sectors.length));
            }
        }
    };
    Sectors.prototype.allocate = function () {
        var allocated = SimpleSector_1.SimpleSector.from(this.dataView.allocate(this.sectorShift), this.sectors.length);
        allocated.fill(utils_1.FREESECT_MARK_OR_NOSTREAM);
        this.sectors.push(allocated);
        return allocated;
    };
    Sectors.prototype.allocateDIFAT = function () {
        var sector = new DIFATSector_1.DIFATSector(this.allocate());
        sector.fill(utils_1.FREESECT_MARK_OR_NOSTREAM);
        sector.subView(508).writeAt(0, utils_1.ENDOFCHAIN_MARK);
        return sector;
    };
    return Sectors;
}());
exports.Sectors = Sectors;
//# sourceMappingURL=Sectors.js.map