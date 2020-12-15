"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Long = __importStar(require("long"));
require("../Long");
var utils_1 = require("../utils");
var DIFATSector = /** @class */ (function () {
    function DIFATSector(delegate) {
        this.fatSectors = [];
        this.delegate = delegate;
        for (var i = 0; i < delegate.getSize() - 4 - 1; i += 4) {
            var fatSectorPosition = delegate.subView(i, i + 4).getData();
            if (utils_1.isFreeSectOrNoStream(fatSectorPosition)) {
                break;
            }
            else {
                this.fatSectors.push(Long.fromBytesLE(fatSectorPosition).toNumber());
            }
        }
    }
    DIFATSector.prototype.getPosition = function () {
        return this.delegate.getPosition();
    };
    DIFATSector.prototype.writeAt = function (position, bytes) {
        if (utils_1.isEndOfChain(bytes) && position !== 508)
            throw new Error();
        if (utils_1.isFreeSectOrNoStream(bytes) && this.fatSectors.length > position / 4)
            throw new Error();
        if (!utils_1.isEndOfChain(bytes) && !utils_1.isFreeSectOrNoStream(bytes) && position !== 508) {
            if (this.fatSectors.length !== position / 4) {
                throw new Error();
            }
        }
        this.fatSectors.push(Long.fromBytesLE(bytes).toNumber());
        return this.delegate.writeAt(position, bytes);
    };
    DIFATSector.prototype.registerFatSector = function (sectorPosition) {
        if (this.fatSectors.length >= 127) {
            throw new Error();
        }
        this.writeAt(this.fatSectors.length * 4, Long.fromValue(sectorPosition).to4BytesLE());
    };
    DIFATSector.prototype.registerNextDifatSector = function (sectorPosition) {
        this.writeAt(508, Long.fromValue(sectorPosition).to4BytesLE());
    };
    DIFATSector.prototype.getRegisteredFatSectors = function () {
        return this.fatSectors;
    };
    DIFATSector.prototype.hasFreeSpace = function () {
        return this.fatSectors.length < 127;
    };
    DIFATSector.prototype.getSize = function () {
        return this.delegate.getSize();
    };
    DIFATSector.prototype.getData = function () {
        return this.delegate.getData();
    };
    DIFATSector.prototype.subView = function (start, end) {
        return this.delegate.subView(start, end);
    };
    DIFATSector.prototype.allocate = function (length) {
        return this.delegate.allocate(length);
    };
    DIFATSector.prototype.fill = function (filler) {
        this.delegate.fill(filler);
        return this;
    };
    DIFATSector.prototype.isEmpty = function () {
        return this.delegate.isEmpty();
    };
    DIFATSector.prototype.readAt = function (position, length) {
        return this.delegate.readAt(position, length);
    };
    return DIFATSector;
}());
exports.DIFATSector = DIFATSector;
//# sourceMappingURL=DIFATSector.js.map