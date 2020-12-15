"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color;
(function (Color) {
    Color[Color["RED"] = 0] = "RED";
    Color[Color["BLACK"] = 1] = "BLACK";
})(Color = exports.Color || (exports.Color = {}));
var TreeNode = /** @class */ (function () {
    function TreeNode(value, color) {
        this.leftChild = null;
        this.rightChild = null;
        this.parent = null;
        this.color = color;
        if (value == null)
            throw new Error("Null values are not allowed");
        this.value = value;
    }
    TreeNode.prototype.getLeftChild = function () {
        return this.leftChild;
    };
    TreeNode.prototype.setLeftChild = function (value) {
        this.leftChild = value;
        if (this.leftChild != null) {
            this.leftChild.setParent(this);
        }
    };
    TreeNode.prototype.getValue = function () {
        return this.value;
    };
    TreeNode.prototype.setRightChild = function (value) {
        this.rightChild = value;
        if (this.rightChild != null) {
            this.rightChild.setParent(this);
        }
    };
    TreeNode.prototype.getRightChild = function () {
        return this.rightChild;
    };
    TreeNode.prototype.getParent = function () {
        return this.parent;
    };
    TreeNode.prototype.setParent = function (parent) {
        this.parent = parent;
    };
    TreeNode.prototype.hasChildren = function () {
        return this.leftChild != null || this.rightChild != null;
    };
    TreeNode.prototype.hasTwoChildren = function () {
        return this.leftChild != null && this.rightChild != null;
    };
    TreeNode.prototype.isLeftChild = function (node) {
        return this.leftChild === node;
    };
    TreeNode.prototype.isRightChild = function (node) {
        return this.rightChild === node;
    };
    TreeNode.prototype.deleteChild = function (node) {
        if (node === this.leftChild) {
            this.leftChild = null;
        }
        else if (node === this.rightChild) {
            this.rightChild = null;
        }
    };
    TreeNode.prototype.substituteNode = function (node, substitute) {
        if (node === this.rightChild) {
            this.rightChild = substitute;
            this.rightChild.setParent(this);
        }
        else if (node === this.leftChild) {
            this.leftChild = substitute;
            this.leftChild.setParent(this);
        }
    };
    TreeNode.prototype.getChildrenRecursive = function () {
        var allChildren = [];
        if (this.leftChild != null) {
            allChildren.push.apply(allChildren, this.leftChild.getChildrenRecursive());
            allChildren.push(this.leftChild);
        }
        if (this.rightChild != null) {
            allChildren.push.apply(allChildren, this.rightChild.getChildrenRecursive());
            allChildren.push(this.rightChild);
        }
        return allChildren;
    };
    TreeNode.prototype.getColor = function () {
        return this.color;
    };
    TreeNode.prototype.setColor = function (color) {
        this.color = color;
    };
    TreeNode.prototype.invertColor = function () {
        this.color = this.color === Color.BLACK ? Color.RED : Color.BLACK;
    };
    TreeNode.prototype.uncle = function () {
        var parent = this.getParent();
        var grandParent = this.getParent().getParent();
        if (parent != null && grandParent != null) {
            if (grandParent.isLeftChild(parent)) {
                return grandParent.getRightChild();
            }
            else {
                return grandParent.getLeftChild();
            }
        }
        return null;
    };
    TreeNode.prototype.grandParent = function () {
        var grandParent = null;
        if (this.getParent() != null) {
            grandParent = this.getParent().getParent();
        }
        return grandParent;
    };
    TreeNode.prototype.sibling = function () {
        if (this.getParent() == null) {
            return null;
        }
        else if (this.getParent().isLeftChild(this)) {
            return this.getParent().getRightChild();
        }
        else {
            return this.getParent().getLeftChild();
        }
    };
    return TreeNode;
}());
exports.TreeNode = TreeNode;
//# sourceMappingURL=Node.js.map