"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FATtoDIFATFacade = /** @class */ (function () {
    function FATtoDIFATFacade() {
    }
    FATtoDIFATFacade.prototype.setDifat = function (difat) {
        this.difat = difat;
    };
    FATtoDIFATFacade.prototype.setFat = function (fat) {
        this.fat = fat;
    };
    FATtoDIFATFacade.prototype.getFatSectorChain = function () {
        return this.difat.getFatSectorChain();
    };
    FATtoDIFATFacade.prototype.registerFatSectorInDIFAT = function (sectorPosition) {
        this.difat.registerFATSector(sectorPosition);
    };
    FATtoDIFATFacade.prototype.registerDifatSectorInFAT = function (sectorPosition) {
        this.fat.registerDifatSector(sectorPosition);
    };
    return FATtoDIFATFacade;
}());
exports.FATtoDIFATFacade = FATtoDIFATFacade;
//# sourceMappingURL=FATtoDIFATFacade.js.map