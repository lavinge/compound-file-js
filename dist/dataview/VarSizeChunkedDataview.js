"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_treemap_1 = __importDefault(require("ts-treemap"));
var SimpleDataview_1 = require("./SimpleDataview");
/**
 * @internal
 */
var VariableSizeChunkedDataView = /** @class */ (function () {
    function VariableSizeChunkedDataView(views) {
        this.viewMap = new ts_treemap_1.default();
        var size = 0;
        for (var _i = 0, views_1 = views; _i < views_1.length; _i++) {
            var view = views_1[_i];
            size += view.getSize();
            this.viewMap.set(size - 1, view);
        }
        this.size = size;
    }
    VariableSizeChunkedDataView.prototype.writeAt = function (position, bytes) {
        if (position < 0)
            throw new Error("Cannot write at index < 0: start = " + position);
        if (position + bytes.length > this.size)
            throw new Error("Sub-view should has end index < " + this.size + ": end = " + (position + bytes.length - 1));
        var startingPositionInFirstView;
        var beforeFirst = this.viewMap.lowerKey(position);
        if (beforeFirst === undefined) {
            startingPositionInFirstView = position;
        }
        else {
            startingPositionInFirstView = position - beforeFirst - 1;
        }
        var remaining = bytes.length;
        var currentEntry = this.viewMap.ceilingEntry(position);
        var currentKey = currentEntry[0];
        var currentView = currentEntry[1];
        var bytesToWrite = Math.min(currentView.subView(startingPositionInFirstView).getSize(), remaining);
        remaining -= bytesToWrite;
        currentView.writeAt(startingPositionInFirstView, bytes.slice(0, bytesToWrite));
        while (remaining > 0) {
            currentEntry = this.viewMap.higherEntry(currentKey);
            if (currentEntry === undefined) {
                throw new Error("Preliminary end of chain");
            }
            else {
                bytesToWrite = Math.min(currentView.getSize(), remaining);
                remaining -= bytesToWrite;
                currentView.writeAt(0, bytes.slice(0, bytesToWrite));
            }
        }
        return this;
    };
    VariableSizeChunkedDataView.prototype.getSize = function () {
        return this.size;
    };
    VariableSizeChunkedDataView.prototype.getData = function () {
        var result = [];
        var index = 0;
        for (var _i = 0, _a = Array.from(this.viewMap.values()); _i < _a.length; _i++) {
            var view = _a[_i];
            result.push.apply(result, view.getData());
            index += view.getSize();
        }
        return result;
    };
    VariableSizeChunkedDataView.prototype.subView = function (start, end) {
        if (end == null) {
            if (start < 0)
                throw new Error("Sub-view should has starting index >= 0: start = " + start);
            var _a = this.viewMap.ceilingEntry(start), firstKey = _a[0], firstValue = _a[1];
            var previousKey = void 0;
            if (this.viewMap.lowerEntry(start) === undefined) {
                previousKey = [firstKey, firstValue][0];
            }
            else {
                previousKey = this.viewMap.lowerEntry(start)[0];
            }
            var startingPositionInFirstView = previousKey === firstKey ? start : start - previousKey - 1;
            var result = [];
            result.push(firstValue.subView(startingPositionInFirstView));
            result.push.apply(result, Array.from(this.viewMap.splitHigher(firstKey, false).values()));
            return new VariableSizeChunkedDataView(result);
        }
        else {
            if (start < 0)
                throw new Error("Sub-view should has starting index >= 0: start = " + start);
            if (end > this.size)
                throw new Error("Sub-view should has end index < " + this.getSize() + ": end = " + end);
            if (start >= this.getSize())
                throw new Error("Sub-view should not exceed the size of a view: size = " + this.getSize());
            if (start > end)
                throw new Error("Sub-view start should be less or equal to end: start(" + start + ") / end(" + end + ")");
            if (start === end) {
                return new SimpleDataview_1.SimpleDataview(new Array(0));
            }
            var last = end - 1;
            var firstEntry = this.viewMap.ceilingEntry(start);
            var firstEntryKey = firstEntry[0], firstEntryValue = firstEntry[1];
            var lastEntry = this.viewMap.ceilingEntry(last);
            var lastEntryKey = lastEntry[0], lastEntryValue = lastEntry[1];
            var startingPositionInFirstView = void 0;
            var beforeFirst = this.viewMap.lowerKey(start);
            if (beforeFirst === undefined) {
                startingPositionInFirstView = start;
            }
            else {
                startingPositionInFirstView = start - beforeFirst - 1;
            }
            if (firstEntryKey === lastEntryKey) {
                if (beforeFirst === undefined) {
                    return firstEntryValue.subView(startingPositionInFirstView, end);
                }
                else {
                    return firstEntryValue.subView(startingPositionInFirstView, end - beforeFirst - 1);
                }
            }
            else {
                var beforeLast = this.viewMap.lowerKey(last);
                var result = [];
                result.push(firstEntryValue.subView(startingPositionInFirstView));
                result.push.apply(result, Array.from(this.viewMap.splitHigher(firstEntryKey, false).splitLower(lastEntryKey, false).values()));
                result.push(lastEntryValue.subView(0, end - beforeLast - 1));
                return new VariableSizeChunkedDataView(result);
            }
        }
    };
    VariableSizeChunkedDataView.prototype.allocate = function (length) {
        throw new Error("Unsupported Operation");
    };
    VariableSizeChunkedDataView.prototype.fill = function (filler) {
        this.viewMap.forEach(function (view) { return view.fill(filler); });
        return this;
    };
    VariableSizeChunkedDataView.prototype.readAt = function (position, length) {
        return this.subView(position, position + length).getData();
    };
    VariableSizeChunkedDataView.prototype.isEmpty = function () {
        return this.getSize() === 0;
    };
    return VariableSizeChunkedDataView;
}());
exports.VariableSizeChunkedDataView = VariableSizeChunkedDataView;
//# sourceMappingURL=VarSizeChunkedDataview.js.map