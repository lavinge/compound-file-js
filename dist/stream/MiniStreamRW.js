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
var MiniStreamRW = /** @class */ (function () {
    function MiniStreamRW(miniFAT, fat, firstMiniStreamSector, miniStreamLength, sectors, header) {
        this.miniFAT = miniFAT;
        this.fat = fat;
        this.miniStreamLength = miniStreamLength;
        if (firstMiniStreamSector >= 0) {
            this.miniStreamSectorChain = fat.buildChain(firstMiniStreamSector);
        }
        else {
            this.miniStreamSectorChain = [];
        }
        this.sectors = sectors;
        this.header = header;
    }
    MiniStreamRW.prototype.read = function (startingSector, lengthOrFromIncl, toExcl) {
        var _this = this;
        if (toExcl == null) {
            var result = utils_1.initializedWidth(lengthOrFromIncl, 0);
            var position = 0;
            for (var _i = 0, _a = this.miniFAT.buildChain(startingSector); _i < _a.length; _i++) {
                var sectorNumber = _a[_i];
                if (lengthOrFromIncl > 0) {
                    var data = this.getMiniSectorData(sectorNumber);
                    var bytesToRead = Math.min(data.getSize(), lengthOrFromIncl);
                    result.splice.apply(result, __spreadArrays([position, bytesToRead], data.subView(0, bytesToRead).getData()));
                    position += bytesToRead;
                    lengthOrFromIncl -= bytesToRead;
                }
                else {
                    break;
                }
            }
            return result;
        }
        else {
            return new VarSizeChunkedDataview_1.VariableSizeChunkedDataView(this.miniFAT.buildChain(startingSector).map(function (position) { return _this.getMiniSectorData(position); }))
                .subView(lengthOrFromIncl, toExcl).getData();
        }
    };
    MiniStreamRW.prototype.getMiniSectorData = function (position) {
        var sectorPosition = Math.floor(position * this.header.getMiniSectorShift() / this.header.getSectorShift());
        var shiftInsideSector = position * this.header.getMiniSectorShift() % this.header.getSectorShift();
        return this.sectors.sector(this.miniStreamSectorChain[sectorPosition]).subView(shiftInsideSector, shiftInsideSector + this.header.getMiniSectorShift());
    };
    MiniStreamRW.prototype.write = function (data) {
        if (data.length <= 0) {
            throw new Error();
        }
        var numberOfChunks = this.howManyChunksNeeded(data.length);
        var firstMiniSectorPosition = utils_1.ENDOFCHAIN_MARK_INT;
        for (var i = 0; i < numberOfChunks; i++) {
            var bytesFromPosition = i * this.header.getMiniSectorShift();
            var bytesUpToPosition = Math.min((i + 1) * this.header.getMiniSectorShift(), data.length);
            var bytesToWrite = data.slice(bytesFromPosition, bytesUpToPosition);
            this.getDataHolderForNextChunk().writeAt(0, bytesToWrite);
            var miniSectorPosition = this.miniStreamLength / this.header.getMiniSectorShift();
            if (firstMiniSectorPosition === utils_1.ENDOFCHAIN_MARK_INT) {
                firstMiniSectorPosition = miniSectorPosition;
            }
            if (i === 0) {
                this.miniFAT.registerSector(miniSectorPosition, null);
            }
            else {
                this.miniFAT.registerSector(miniSectorPosition, miniSectorPosition - 1);
            }
            this.miniStreamLength += this.header.getMiniSectorShift();
        }
        return firstMiniSectorPosition;
    };
    MiniStreamRW.prototype.howManyChunksNeeded = function (dataLength) {
        var numberOfChunks;
        if (dataLength % this.header.getMiniSectorShift() === 0) {
            numberOfChunks = Math.floor(dataLength / this.header.getMiniSectorShift());
        }
        else {
            numberOfChunks = Math.floor(dataLength / this.header.getMiniSectorShift()) + 1;
        }
        return numberOfChunks;
    };
    MiniStreamRW.prototype.writeAt = function (startingSector, position, data) {
        var _this = this;
        new VarSizeChunkedDataview_1.VariableSizeChunkedDataView(this.miniFAT.buildChain(startingSector).map(function (pos) { return _this.getMiniSectorData(pos); }))
            .writeAt(position, data);
    };
    MiniStreamRW.prototype.append = function (startingSector, currentSize, data) {
        var sectorChain = this.miniFAT.buildChain(startingSector);
        if (sectorChain.length === 0) {
            return this.write(data);
        }
        var lastSectorPosition = sectorChain[sectorChain.length - 1];
        var lastSector = this.getMiniSectorData(lastSectorPosition);
        var freeBytesInLastSector = 0;
        var remainingBytes = data.length;
        if (currentSize % this.header.getMiniSectorShift() !== 0) {
            freeBytesInLastSector = lastSector.getSize() - currentSize % this.header.getMiniSectorShift();
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
        for (var i = 0; i < numberOfChunks; i++) {
            var bytesFromPosition = i * this.header.getMiniSectorShift();
            var bytesUpToPosition = Math.min((i + 1) * this.header.getMiniSectorShift(), data.length);
            var bytesToWrite = data.slice(bytesFromPosition, bytesUpToPosition);
            this.getDataHolderForNextChunk().writeAt(0, bytesToWrite);
            var miniSectorPosition = this.miniStreamLength / this.header.getMiniSectorShift();
            if (i === 0) {
                this.miniFAT.registerSector(miniSectorPosition, lastSectorPosition);
            }
            else {
                this.miniFAT.registerSector(miniSectorPosition, miniSectorPosition - 1);
            }
            this.miniStreamLength += this.header.getMiniSectorShift();
        }
        return startingSector;
    };
    MiniStreamRW.prototype.getDataHolderForNextChunk = function () {
        var currentSector = this.getSectorForNextChunk();
        var positionInCurrentSector = this.miniStreamLength % this.header.getSectorShift();
        return currentSector.subView(positionInCurrentSector, positionInCurrentSector + this.header.getMiniSectorShift());
    };
    MiniStreamRW.prototype.getSectorForNextChunk = function () {
        if (this.miniStreamSectorChain.length === 0) {
            var sector = this.sectors.allocate();
            this.fat.registerSector(sector.getPosition(), null);
            this.miniStreamSectorChain.push(sector.getPosition());
            return sector;
        }
        else if (this.miniStreamLength % this.header.getSectorShift() === 0) {
            var sector = this.sectors.allocate();
            this.fat.registerSector(sector.getPosition(), this.sectors.sector(this.miniStreamSectorChain[this.miniStreamSectorChain.length - 1]).getPosition());
            this.miniStreamSectorChain.push(sector.getPosition());
            return sector;
        }
        else {
            return this.sectors.sector(this.miniStreamSectorChain[this.miniStreamSectorChain.length - 1]);
        }
    };
    MiniStreamRW.prototype.getMiniStreamLength = function () {
        return this.miniStreamLength;
    };
    MiniStreamRW.prototype.getMiniStreamFirstSectorPosition = function () {
        return this.miniStreamLength <= 0 ? utils_1.FREESECT_MARK_OR_NOSTREAM_INT : this.miniStreamSectorChain[0];
    };
    MiniStreamRW.MINI_STREAM_CHUNK_SIZE = 64;
    return MiniStreamRW;
}());
exports.MiniStreamRW = MiniStreamRW;
//# sourceMappingURL=MiniStreamRW.js.map