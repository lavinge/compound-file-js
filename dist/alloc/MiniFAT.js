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
var MiniFAT = /** @class */ (function (_super) {
    __extends(MiniFAT, _super);
    function MiniFAT(sectors, header, fat) {
        var _this = _super.call(this, sectors, fat.buildChain(header.getFirstMinifatSectorLocation()), header.getSectorShift()) || this;
        _this.header = header;
        _this.fat = fat;
        return _this;
    }
    MiniFAT.prototype.allocateNewSector = function () {
        var newSector = _super.prototype.allocateNewSector.call(this);
        var previousSectorPosition = this.sectorChain.length === 1 ? null : this.sectorChain[this.sectorChain.length - 2];
        this.fat.registerSector(newSector.getPosition(), previousSectorPosition);
        this.header.setNumberOfMiniFatSectors(this.sectorChain.length);
        if (this.sectorChain.length === 1) {
            this.header.setFirstMinifatSectorLocation(this.sectorChain[0]);
        }
        return newSector;
    };
    return MiniFAT;
}(AllocationTable_1.AllocationTable));
exports.MiniFAT = MiniFAT;
//# sourceMappingURL=MiniFAT.js.map