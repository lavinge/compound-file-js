"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ReferencingSubview_1 = require("./ReferencingSubview");
var utils_1 = require("../utils");
/**
 * @internal
 */
var SimpleDataview = /** @class */ (function () {
    function SimpleDataview(data) {
        this.data = data;
    }
    SimpleDataview.prototype.writeAt = function (position, bytes) {
        var _a;
        if (position + bytes.length > this.data.length) {
            throw new Error(bytes.length + " + " + position + " > " + this.data.length);
        }
        (_a = this.data).splice.apply(_a, __spreadArrays([position, bytes.length], bytes));
        return this;
    };
    SimpleDataview.prototype.getSize = function () {
        return this.data.length;
    };
    SimpleDataview.prototype.getData = function () {
        return this.data;
    };
    SimpleDataview.prototype.subView = function (start, end) {
        if (end == null) {
            end = this.data.length;
        }
        var dataStart = 0;
        var dataEnd = this.data.length;
        if (end < start) {
            throw new Error("end < start (" + end + " < " + start + ")");
        }
        if (start < dataStart) {
            throw new Error("subView start: " + start + ", view start: " + dataStart);
        }
        if (end > dataEnd) {
            throw new Error("subView end: " + end + ", view end: " + dataEnd);
        }
        if (start >= dataEnd) {
            throw new Error("subView start: " + start + ", view end: " + dataEnd);
        }
        if (end < dataStart) {
            throw new Error("subView end: " + end + ", view start: " + dataStart);
        }
        return new ReferencingSubview_1.ReferencingSubview(this, start, end);
    };
    SimpleDataview.prototype.allocate = function (length) {
        throw new Error("Unsupported operation");
    };
    SimpleDataview.prototype.fill = function (filler) {
        utils_1.fill(this.data, filler);
        return this;
    };
    SimpleDataview.prototype.readAt = function (position, length) {
        return this.data.slice(position, position + length);
    };
    SimpleDataview.prototype.isEmpty = function () {
        return this.getSize() === 0;
    };
    return SimpleDataview;
}());
exports.SimpleDataview = SimpleDataview;
//# sourceMappingURL=SimpleDataview.js.map