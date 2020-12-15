"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InsertHandler_1 = require("./InsertHandler");
var DeleteHandler_1 = require("./DeleteHandler");
var RedBlackTree = /** @class */ (function () {
    function RedBlackTree(nodeFactory, comparator) {
        this.root = null;
        this.insertHandler = new InsertHandler_1.InsertHandler(this, nodeFactory, comparator);
        this.deleteHandler = new DeleteHandler_1.DeleteHandler(this, comparator);
        this.comparator = comparator;
    }
    RedBlackTree.prototype.delete = function (node) {
        this.deleteHandler.delete(node);
    };
    RedBlackTree.prototype.insert = function (value) {
        return this.insertHandler.insert(value);
    };
    RedBlackTree.prototype.findNode = function (value) {
        if (this.root == null) {
            return null;
        }
        else {
            var nextNode = this.root;
            while (nextNode != null) {
                if (this.comparator(nextNode.getValue(), value) === 0) {
                    return nextNode;
                }
                else {
                    if (this.comparator(value, nextNode.getValue()) > 0) {
                        nextNode = nextNode.getRightChild();
                    }
                    else {
                        nextNode = nextNode.getLeftChild();
                    }
                }
            }
            return null;
        }
    };
    RedBlackTree.prototype.getRoot = function () {
        return this.root;
    };
    RedBlackTree.prototype.hasRoot = function () {
        return this.root != null;
    };
    RedBlackTree.prototype.isRoot = function (node) {
        return this.root === node;
    };
    RedBlackTree.prototype.setRoot = function (node) {
        this.root = node;
        if (this.root != null) {
            this.root.setParent(null);
        }
    };
    return RedBlackTree;
}());
exports.RedBlackTree = RedBlackTree;
//# sourceMappingURL=RedBlackTree.js.map