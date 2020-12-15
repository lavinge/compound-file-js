"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var VarSizeChunkedDataview_1 = require("../dataview/VarSizeChunkedDataview");
var RegularStreamRW = /** @class */ (function () {
    function RegularStreamRW(fat, sectors, header) {
        this.fat = fat;
        this.sectors = sectors;
        this.header = header;
    }
    RegularStreamRW.prototype.read = function (startingSector, lengthOrFromIncl, toExcl) {
        var _this = this;
        if (toExcl == null) {
            var result = utils_1.initializedWidth(lengthOrFromIncl, 0);
            var positionInResult = 0;
            for (var _i = 0, _a = this.fat.buildChain(startingSector); _i < _a.length; _i++) {
                var sectorPosition = _a[_i];
                if (lengthOrFromIncl > 0) {
                    var sector = this.sectors.sector(sectorPosition);
                    var bytesToRead = Math.min(sector.getSize(), lengthOrFromIncl);
                    result.splice.apply(result, __spreadArrays([positionInResult, bytesToRead], sector.subView(0, bytesToRead).getData()));
                    positionInResult += bytesToRead;
                    lengthOrFromIncl -= bytesToRead;
                }
                else {
                    break;
                }
            }
            return result;
        }
        else {
            return new VarSizeChunkedDataview_1.VariableSizeChunkedDataView(this.fat.buildChain(startingSector).map(function (sectorPosition) { return _this.sectors.sector(sectorPosition); }))
                .subView(lengthOrFromIncl, toExcl).getData();
        }
    };
    RegularStreamRW.prototype.write = function (data) {
        var firstSectorPosition = null;
        var previousSectorPosition = null;
        for (var i = 0; i < data.length; i += this.header.getSectorShift()) {
            var sector = this.sectors.allocate();
            var writeBytes = Math.min(this.header.getSectorShift(), data.length - i);
            sector.writeAt(0, data.slice(i, i + writeBytes));
            var sectorPosition = sector.getPosition();
            this.fat.registerSector(sectorPosition, previousSectorPosition);
            if (firstSectorPosition == null) {
                firstSectorPosition = sectorPosition;
            }
            previousSectorPosition = sectorPosition;
        }
        return firstSectorPosition;
    };
    RegularStreamRW.prototype.writeAt = function (startingSector, position, data) {
        var _this = this;
        new VarSizeChunkedDataview_1.VariableSizeChunkedDataView(this.fat.buildChain(startingSector).map(function (pos) { return _this.sectors.sector(pos); }))
            .writeAt(position, data);
    };
    RegularStreamRW.prototype.append = function (startingSector, currentSize, data) {
        var sectorChain = this.fat.buildChain(startingSector);
        if (sectorChain.length === 0) {
            return this.write(data);
        }
        var lastSectorPosition = sectorChain[sectorChain.length - 1];
        var lastSector = this.sectors.sector(lastSectorPosition);
        var freeBytesInLastSector = 0;
        var remainingBytes = data.length;
        if (currentSize % this.header.getSectorShift() !== 0) {
            freeBytesInLastSector = lastSector.getSize() - currentSize % this.header.getSectorShift();
            if (freeBytesInLastSector > 0) {
                var byteToWrite = Math.min(freeBytesInLastSector, data.length);
                lastSector.writeAt(lastSector.getSize() - freeBytesInLastSector, data.slice(0, byteToWrite));
                freeBytesInLastSector -= byteToWrite;
                remainingBytes -= byteToWrite;
            }
        }
        if (freeBytesInLastSector > 0 || remainingBytes === 0) {
            return startingSector;
        }
        var numberOfChunks = this.howManyChunksNeeded(remainingBytes);
        var previousSectorPosition = lastSectorPosition;
        for (var i = 0; i < numberOfChunks; i += this.header.getSectorShift()) {
            var sector = this.sectors.allocate();
            var writeBytes = Math.min(this.header.getSectorShift(), data.length - i);
            sector.writeAt(0, data.slice(i, i + writeBytes));
            var sectorPosition = sector.getPosition();
            this.fat.registerSector(sectorPosition, previousSectorPosition);
            previousSectorPosition = sectorPosition;
        }
        return startingSector;
    };
    RegularStreamRW.prototype.howManyChunksNeeded = function (dataLength) {
        var numberOfChunks;
        if (dataLength % this.header.getSectorShift() === 0) {
            numberOfChunks = Math.floor(dataLength / this.header.getSectorShift());
        }
        else {
            numberOfChunks = Math.floor(dataLength / this.header.getSectorShift()) + 1;
        }
        return numberOfChunks;
    };
    return RegularStreamRW;
}());
exports.RegularStreamRW = RegularStreamRW;
//# sourceMappingURL=RegularStream.js.map