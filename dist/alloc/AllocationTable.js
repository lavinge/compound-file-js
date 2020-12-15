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
var AllocationTable = /** @class */ (function () {
    function AllocationTable(sectors, sectorChain, sectorSize) {
        this.sectorChain = [];
        this.sectors = sectors;
        this.sectorChain = sectorChain;
        this.sectorSize = sectorSize;
    }
    AllocationTable.prototype.buildChain = function (currentSector) {
        if (utils_1.isEndOfChain(currentSector)) {
            return [];
        }
        var chain = [];
        while (!utils_1.isEndOfChain(currentSector)) {
            chain.push(currentSector);
            currentSector = this.getValueAt(currentSector);
        }
        return chain;
    };
    AllocationTable.prototype.getValueAt = function (position) {
        var sectorNumber = Math.floor(position * 4 / this.sectorSize);
        var shiftInsideSector = position * 4 % this.sectorSize;
        if (sectorNumber > this.sectorChain.length) {
            throw new Error();
        }
        return Long.fromBytesLE(this.sectors.sector(this.sectorChain[sectorNumber]).subView(shiftInsideSector, shiftInsideSector + 4).getData()).toNumber();
    };
    AllocationTable.prototype.registerSector = function (sectorPosition, previousSectorPosition) {
        this.getFatSectorPointingToAllocatedSector(sectorPosition).writeAt(this.calculatePositionInsideFatSector(sectorPosition), utils_1.ENDOFCHAIN_MARK);
        if (previousSectorPosition != null) {
            this.getFatSectorPointingToAllocatedSector(previousSectorPosition).writeAt(this.calculatePositionInsideFatSector(previousSectorPosition), Long.fromValue(sectorPosition).to4BytesLE());
        }
    };
    AllocationTable.prototype.getFatSectorPointingToAllocatedSector = function (sectorPosition) {
        var fatSectorInChain = Math.floor(sectorPosition / AllocationTable.ENTRIES_IN_ONE_FAT_SECTOR);
        if (this.sectorChain.length <= fatSectorInChain) {
            var targetSector = null;
            while (this.sectorChain.length <= fatSectorInChain) {
                targetSector = this.allocateNewSector();
            }
            return targetSector;
        }
        else {
            return this.sectors.sector(this.sectorChain[fatSectorInChain]);
        }
    };
    AllocationTable.prototype.allocateNewSector = function () {
        var fatSector = this.sectors.allocate();
        var sectorPosition = fatSector.getPosition();
        this.sectorChain.push(sectorPosition);
        return fatSector;
    };
    AllocationTable.prototype.calculatePositionInsideFatSector = function (sectorPosition) {
        return sectorPosition % AllocationTable.ENTRIES_IN_ONE_FAT_SECTOR * 4;
    };
    AllocationTable.ENTRIES_IN_ONE_FAT_SECTOR = 128;
    return AllocationTable;
}());
exports.AllocationTable = AllocationTable;
//# sourceMappingURL=AllocationTable.js.map