"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AllocationTable_1 = require("./AllocationTable");
var utils_1 = require("../utils");
var FAT = /** @class */ (function (_super) {
    __extends(FAT, _super);
    function FAT(sectors, header, difat) {
        var _this = _super.call(this, sectors, difat.getFatSectorChain(), header.getSectorShift()) || this;
        _this.header = header;
        _this.difat = difat;
        return _this;
    }
    FAT.prototype.registerDifatSector = function (position) {
        this.getFatSectorPointingToAllocatedSector(position).writeAt(this.calculatePositionInsideFatSector(position), utils_1.DISECT_MARK);
    };
    FAT.prototype.allocateNewSector = function () {
        var newSector = _super.prototype.allocateNewSector.call(this);
        var sectorPosition = newSector.getPosition();
        var fatSectorPointingToAllocatedSector = this.getFatSectorPointingToAllocatedSector(sectorPosition);
        var positionInsideFatSector = this.calculatePositionInsideFatSector(sectorPosition);
        fatSectorPointingToAllocatedSector.writeAt(positionInsideFatSector, utils_1.FATSECT_MARK);
        this.difat.registerFatSectorInDIFAT(newSector.getPosition());
        this.header.setNumberOfFatSectors(this.sectorChain.length);
        return newSector;
    };
    return FAT;
}(AllocationTable_1.AllocationTable));
exports.FAT = FAT;
//# sourceMappingURL=FAT.js.map