"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleSector = /** @class */ (function () {
    function SimpleSector(view, position) {
        this.view = view;
        this.position = position;
    }
    SimpleSector.prototype.getPosition = function () {
        return this.position;
    };
    SimpleSector.prototype.writeAt = function (position, bytes) {
        this.view.writeAt(position, bytes);
        return this;
    };
    SimpleSector.prototype.getSize = function () {
        return this.view.getSize();
    };
    SimpleSector.prototype.getData = function () {
        return this.view.getData();
    };
    SimpleSector.prototype.subView = function (start, end) {
        return this.view.subView(start, end);
    };
    SimpleSector.prototype.allocate = function (length) {
        return this.view.allocate(length);
    };
    SimpleSector.prototype.fill = function (filler) {
        this.view.fill(filler);
        return this;
    };
    SimpleSector.prototype.readAt = function (position, length) {
        return this.view.readAt(position, length);
    };
    SimpleSector.from = function (view, position, filler) {
        var simpleSector = new SimpleSector(view, position);
        if (filler != null) {
            simpleSector.fill(filler);
        }
        return simpleSector;
    };
    SimpleSector.prototype.isEmpty = function () {
        return this.getSize() === 0;
    };
    return SimpleSector;
}());
exports.SimpleSector = SimpleSector;
//# sourceMappingURL=SimpleSector.js.map