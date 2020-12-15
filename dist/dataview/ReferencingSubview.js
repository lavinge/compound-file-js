"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @internal
 */
var ReferencingSubview = /** @class */ (function () {
    function ReferencingSubview(delegate, start, end) {
        this.delegate = delegate;
        this.capacity = end - start;
        this.start = start;
        this.end = end;
    }
    ReferencingSubview.prototype.writeAt = function (position, bytes) {
        return this.delegate.writeAt(this.start + position, bytes);
    };
    ReferencingSubview.prototype.getSize = function () {
        return this.capacity;
    };
    ReferencingSubview.prototype.getData = function () {
        return this.delegate.readAt(this.start, this.end - this.start);
    };
    ReferencingSubview.prototype.subView = function (start, end) {
        if (end == null) {
            end = this.capacity;
        }
        if (end < start) {
            throw new Error("end < start (" + end + " < " + start + ")");
        }
        if (start < 0) {
            throw new Error("subView start: " + start + ", view start: " + this.start);
        }
        if (end > this.capacity) {
            throw new Error("subView end: " + end + ", view end: " + this.capacity);
        }
        if (start >= this.capacity) {
            throw new Error("subView start: " + start + ", view end: " + this.capacity);
        }
        if (end < 0) {
            throw new Error("subView end: " + end + ", view start: " + this.start);
        }
        return new ReferencingSubview(this.delegate, this.start + start, this.start + end);
    };
    ReferencingSubview.prototype.allocate = function (length) {
        throw new Error("Unsupported operation");
    };
    ReferencingSubview.prototype.fill = function (filler) {
        if (this.getSize() % filler.length !== 0)
            throw new Error();
        var step = filler.length;
        for (var i = 0; i < this.getSize(); i += step) {
            this.writeAt(i, filler);
        }
        return this;
    };
    ReferencingSubview.prototype.readAt = function (position, length) {
        if (this.start + position >= this.end) {
            throw new Error("Starting position cannot be greater then subview 'end'. (starting position: " + position + " < view end: " + this.end + ")");
        }
        if (this.start + position + length >= this.end) {
            throw new Error("Operation exceeds view limits. (read end position " + (position + length) + "< view end: " + this.end + ")");
        }
        return this.delegate.readAt(this.start + position, length);
    };
    ReferencingSubview.prototype.isEmpty = function () {
        return this.getSize() === 0;
    };
    return ReferencingSubview;
}());
exports.ReferencingSubview = ReferencingSubview;
//# sourceMappingURL=ReferencingSubview.js.map