"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReferencingSubview_1 = require("./ReferencingSubview");
var SimpleDataview_1 = require("./SimpleDataview");
var utils_1 = require("../utils");
/**
 * @internal
 */
var FixedSizeChunkedDataview = /** @class */ (function () {
    function FixedSizeChunkedDataview(chunkSize, dataChunks) {
        var _a;
        this.chunks = [];
        this.chunkSize = chunkSize;
        if (dataChunks != null) {
            if (typeof dataChunks[0] === 'number') {
                if (dataChunks.length % chunkSize !== 0)
                    throw new Error();
                var dataLength = dataChunks.length;
                var rawView = new SimpleDataview_1.SimpleDataview(dataChunks);
                for (var i = 0; i < dataLength; i += 512) {
                    this.chunks.push(new ReferencingSubview_1.ReferencingSubview(rawView, i, i + 512));
                }
            }
            else {
                (_a = this.chunks).push.apply(_a, dataChunks);
            }
        }
    }
    FixedSizeChunkedDataview.prototype.writeAt = function (position, bytes) {
        return this.chunks[Math.floor(position / 512)].writeAt(position % 512, bytes);
    };
    FixedSizeChunkedDataview.prototype.getSize = function () {
        return this.chunks.length * this.chunkSize;
    };
    FixedSizeChunkedDataview.prototype.getData = function () {
        var result = [];
        for (var _i = 0, _a = this.chunks; _i < _a.length; _i++) {
            var chunk = _a[_i];
            result.push.apply(result, chunk.getData());
        }
        return result;
    };
    FixedSizeChunkedDataview.prototype.subView = function (start, end) {
        if (end == null)
            throw new Error("'end' parameter is mandatory");
        if (Math.floor(start / this.chunkSize) !== Math.floor((end - 1) / this.chunkSize))
            throw new Error("Can only get subview enclosed by one chunk. Actual values: " + start + " - " + end);
        if (start === end)
            throw new Error("Cannot get subview of size 0");
        var chunk = this.chunks[Math.floor(start / this.chunkSize)];
        if (end % this.chunkSize === 0) {
            return chunk.subView(start % this.chunkSize);
        }
        else {
            return chunk.subView(start % this.chunkSize, end % this.chunkSize);
        }
    };
    FixedSizeChunkedDataview.prototype.allocate = function (length) {
        if (length !== this.chunkSize)
            throw new Error();
        var view = new SimpleDataview_1.SimpleDataview(utils_1.initializedWidth(length, 0));
        this.chunks.push(view);
        return view;
    };
    FixedSizeChunkedDataview.prototype.fill = function (filler) {
        throw new Error("Unsupported operation");
    };
    FixedSizeChunkedDataview.prototype.readAt = function (position, length) {
        throw new Error("Unsupported operation");
    };
    FixedSizeChunkedDataview.prototype.isEmpty = function () {
        return false;
    };
    return FixedSizeChunkedDataview;
}());
exports.FixedSizeChunkedDataview = FixedSizeChunkedDataview;
//# sourceMappingURL=FixedSizeChunkedDataview.js.map