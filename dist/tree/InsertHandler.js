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
var Node_1 = require("./Node");
var UpdateHandler_1 = require("./UpdateHandler");
var InsertHandler = /** @class */ (function (_super) {
    __extends(InsertHandler, _super);
    function InsertHandler(tree, nodeFactory, comparator) {
        var _this = _super.call(this, tree) || this;
        _this.nodeFactory = nodeFactory;
        _this.comparator = comparator;
        return _this;
    }
    InsertHandler.prototype.insert = function (value) {
        var node = this.simpleInsert(value);
        if (!this.tree.isRoot(node) && !this.tree.isRoot(node.getParent())) {
            this.recolorAndRotateIfNeeded(node);
        }
        return node;
    };
    InsertHandler.prototype.simpleInsert = function (value) {
        if (!this.tree.hasRoot()) {
            var node = this.nodeFactory.create(value, Node_1.Color.BLACK);
            this.tree.setRoot(node);
            return node;
        }
        else {
            var currentNode = this.tree.getRoot();
            while (currentNode != null) {
                if (this.comparator(currentNode.getValue(), value) === 0) {
                    throw new Error("Equal values are not supported: " + value);
                }
                else {
                    if (this.comparator(value, currentNode.getValue()) < 0) {
                        if (currentNode.getLeftChild() == null) {
                            var node = this.nodeFactory.create(value, Node_1.Color.RED);
                            currentNode.setLeftChild(node);
                            return node;
                        }
                        else {
                            currentNode = currentNode.getLeftChild();
                        }
                    }
                    else {
                        if (currentNode.getRightChild() == null) {
                            var node = this.nodeFactory.create(value, Node_1.Color.RED);
                            currentNode.setRightChild(node);
                            return node;
                        }
                        else {
                            currentNode = currentNode.getRightChild();
                        }
                    }
                }
            }
            throw new Error("Unexpected behaviour -- cannot find node location in the tree");
        }
    };
    InsertHandler.prototype.recolorAndRotateIfNeeded = function (node) {
        var grandChild = node;
        var parent = null;
        while (grandChild != null &&
            grandChild.getColor() === Node_1.Color.RED &&
            grandChild.getParent() != null &&
            grandChild.getParent().getColor() === Node_1.Color.RED) {
            parent = grandChild.getParent();
            var uncle = grandChild.uncle();
            var uncleColor = uncle == null ? Node_1.Color.BLACK : uncle.getColor();
            switch (uncleColor) {
                case Node_1.Color.BLACK:
                    this.rotateAndRecolorIfBlackScenario(grandChild);
                    break;
                case Node_1.Color.RED:
                    this.recolorIfRedScenario(grandChild);
                    break;
                default:
                    throw new Error("Should not pass here");
            }
            grandChild = grandChild.grandParent();
        }
    };
    InsertHandler.prototype.rotateSubtree = function (grandParent, parent, grandChild) {
        if (grandParent.isLeftChild(parent) && parent.isLeftChild(grandChild)) {
            this.rightRotate(grandParent, parent);
        }
        else if (grandParent.isLeftChild(parent) && parent.isRightChild(grandChild)) {
            this.leftRotate(parent, grandChild);
            this.rightRotate(grandParent, grandChild);
            grandChild.setColor(Node_1.Color.BLACK);
            grandParent.setColor(Node_1.Color.RED);
        }
        else if (grandParent.isRightChild(parent) && parent.isRightChild(grandChild)) {
            this.leftRotate(grandParent, parent);
        }
        else {
            this.rightRotate(parent, grandChild);
            this.leftRotate(grandParent, grandChild);
            grandChild.setColor(Node_1.Color.BLACK);
            grandParent.setColor(Node_1.Color.RED);
        }
    };
    InsertHandler.prototype.recolorAfterRotate = function (pivot) {
        pivot.setColor(Node_1.Color.BLACK);
        var leftChild = pivot.getLeftChild();
        if (leftChild != null) {
            leftChild.setColor(Node_1.Color.RED);
        }
        var rightChild = pivot.getRightChild();
        if (rightChild != null) {
            rightChild.setColor(Node_1.Color.RED);
        }
    };
    InsertHandler.prototype.recolorIfRedScenario = function (grandChild) {
        var uncle = grandChild.uncle();
        if (uncle != null) {
            uncle.setColor(Node_1.Color.BLACK);
        }
        var parent = grandChild.getParent();
        if (parent != null) {
            parent.setColor(Node_1.Color.BLACK);
        }
        var grandParent = grandChild.grandParent();
        if (grandParent != null) {
            if (this.tree.isRoot(grandParent)) {
                grandParent.setColor(Node_1.Color.BLACK);
            }
            else {
                grandParent.setColor(Node_1.Color.RED);
            }
        }
    };
    InsertHandler.prototype.rotateAndRecolorIfBlackScenario = function (grandChild) {
        var parent = grandChild.getParent();
        var grandParent = grandChild.grandParent();
        this.rotateSubtree(grandParent, parent, grandChild);
    };
    return InsertHandler;
}(UpdateHandler_1.UpdateHandler));
exports.InsertHandler = InsertHandler;
//# sourceMappingURL=InsertHandler.js.map