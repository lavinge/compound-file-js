"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StreamHolder = /** @class */ (function () {
    function StreamHolder(regularStreamRW, miniStreamRW, sizeThreshold) {
        this.regularStreamRW = regularStreamRW;
        this.miniStreamRW = miniStreamRW;
        this.sizeThreshold = sizeThreshold;
    }
    StreamHolder.prototype.forSize = function (size) {
        if (size >= this.sizeThreshold) {
            return this.regularStreamRW;
        }
        else {
            return this.miniStreamRW;
        }
    };
    StreamHolder.prototype.getStreamData = function (startingLocation, size) {
        return this.forSize(size).read(startingLocation, size);
    };
    StreamHolder.prototype.setStreamData = function (data) {
        return this.forSize(data.length).write(data);
    };
    StreamHolder.prototype.read = function (startingLocation, size, fromIncl, toExcl) {
        return this.forSize(size).read(startingLocation, fromIncl, toExcl);
    };
    StreamHolder.prototype.writeAt = function (startingLocation, size, position, data) {
        this.forSize(size).writeAt(startingLocation, position, data);
    };
    StreamHolder.prototype.append = function (startingLocation, size, data) {
        if (size < this.sizeThreshold && size + data.length >= this.sizeThreshold) {
            var result = this.forSize(size).read(startingLocation, size);
            result.push.apply(result, data);
            return this.forSize(size + data.length).write(result);
        }
        else {
            return this.forSize(size).append(startingLocation, size, data);
        }
    };
    return StreamHolder;
}());
exports.StreamHolder = StreamHolder;
//# sourceMappingURL=StreamHolder.js.map