"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DirectoryEntry_1 = require("./DirectoryEntry");
var Node_1 = require("../tree/Node");
var DirectoryEntryNode = /** @class */ (function (_super) {
    __extends(DirectoryEntryNode, _super);
    function DirectoryEntryNode(value, color) {
        var _this = _super.call(this, value, color) || this;
        _this.setColor(color);
        return _this;
    }
    DirectoryEntryNode.prototype.getLeftChild = function () {
        var leftChild = _super.prototype.getLeftChild.call(this);
        if (leftChild == null && this.getValue().getLeftSibling() != null) {
            var directoryEntry = this.getValue().getLeftSibling();
            leftChild = new DirectoryEntryNode(directoryEntry, DirectoryEntry_1.toNodeColor(directoryEntry.getColorFlag()));
            _super.prototype.setLeftChild.call(this, leftChild);
        }
        if (leftChild != null && leftChild.getParent() == null) {
            leftChild.setParent(this);
        }
        return leftChild;
    };
    DirectoryEntryNode.prototype.getRightChild = function () {
        var rightChild = _super.prototype.getRightChild.call(this);
        if (rightChild == null && this.getValue().getRightSibling() != null) {
            var directoryEntry = this.getValue().getRightSibling();
            rightChild = new DirectoryEntryNode(directoryEntry, DirectoryEntry_1.toNodeColor(directoryEntry.getColorFlag()));
            _super.prototype.setRightChild.call(this, rightChild);
        }
        if (rightChild != null && rightChild.getParent() == null) {
            rightChild.setParent(this);
        }
        return rightChild;
    };
    DirectoryEntryNode.prototype.setLeftChild = function (leftChild) {
        _super.prototype.setLeftChild.call(this, leftChild);
        this.getValue().setLeftSibling(leftChild == null ? null : leftChild.getValue());
    };
    DirectoryEntryNode.prototype.setRightChild = function (rightChild) {
        _super.prototype.setRightChild.call(this, rightChild);
        this.getValue().setRightSibling(rightChild == null ? null : rightChild.getValue());
    };
    DirectoryEntryNode.prototype.deleteChild = function (node) {
        if (this.isLeftChild(node)) {
            this.getValue().setLeftSibling(null);
        }
        else if (this.isRightChild(node)) {
            this.getValue().setRightSibling(null);
        }
        _super.prototype.deleteChild.call(this, node);
    };
    DirectoryEntryNode.prototype.substituteNode = function (node, substitute) {
        if (this.isRightChild(node)) {
            this.getValue().setRightSibling(substitute.getValue());
        }
        else if (this.isLeftChild(node)) {
            this.getValue().setLeftSibling(substitute.getValue());
        }
        _super.prototype.substituteNode.call(this, node, substitute);
    };
    DirectoryEntryNode.prototype.setColor = function (color) {
        _super.prototype.setColor.call(this, color);
        this.getValue().setColorFlag(DirectoryEntry_1.toColorFlag(color));
    };
    DirectoryEntryNode.prototype.invertColor = function () {
        _super.prototype.invertColor.call(this);
        this.getValue().invertColor();
    };
    return DirectoryEntryNode;
}(Node_1.TreeNode));
exports.DirectoryEntryNode = DirectoryEntryNode;
//# sourceMappingURL=DirectoryEntryNode.js.map