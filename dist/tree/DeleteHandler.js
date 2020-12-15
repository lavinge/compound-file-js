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
var UpdateHandler_1 = require("./UpdateHandler");
var Node_1 = require("./Node");
var DeleteHandler = /** @class */ (function (_super) {
    __extends(DeleteHandler, _super);
    function DeleteHandler(tree, comparator) {
        var _this = _super.call(this, tree) || this;
        _this.comparator = comparator;
        return _this;
    }
    DeleteHandler.prototype.delete = function (node) {
        if (!node.hasChildren()) {
            if (this.tree.isRoot(node)) {
                this.tree.setRoot(null);
            }
            else {
                if (node.getColor() === Node_1.Color.BLACK) {
                    var sibling = node.sibling();
                    node.getParent().deleteChild(node);
                    this.recover(sibling);
                }
                else {
                    node.getParent().deleteChild(node);
                }
            }
        }
        else if (node.hasTwoChildren()) {
            var substituteWith = this.inOrderPredecessor(node);
            this.swap(node, substituteWith);
            this.delete(node);
        }
        else {
            var substituteWith = void 0;
            if (node.getRightChild() == null) {
                substituteWith = node.getLeftChild();
            }
            else {
                substituteWith = node.getRightChild();
            }
            if (this.tree.isRoot(node)) {
                this.tree.setRoot(substituteWith);
                substituteWith.setColor(Node_1.Color.BLACK);
            }
            else if (substituteWith.getColor() === Node_1.Color.RED || node.getColor() === Node_1.Color.RED) {
                node.getParent().substituteNode(node, substituteWith);
                substituteWith.setColor(Node_1.Color.BLACK);
            }
            else {
                var sibling = node.sibling();
                node.getParent().substituteNode(node, substituteWith);
                this.recover(sibling);
            }
        }
    };
    DeleteHandler.prototype.inOrderPredecessor = function (node) {
        var _this = this;
        if (node.getLeftChild() == null) {
            return null;
        }
        else {
            var allChildren = node.getLeftChild().getChildrenRecursive();
            allChildren.push(node.getLeftChild());
            allChildren.sort(function (a, b) { return _this.comparator(a.getValue(), b.getValue()); });
            return allChildren[allChildren.length - 1];
        }
    };
    DeleteHandler.prototype.recover = function (sibling) {
        var siblingColor = sibling.getColor();
        var siblingsLeftChild = sibling.getLeftChild();
        var siblingsRightChild = sibling.getRightChild();
        var siblingLeftChildColor = siblingsLeftChild == null ? Node_1.Color.BLACK : siblingsLeftChild.getColor();
        var siblingRightChildColor = siblingsRightChild == null ? Node_1.Color.BLACK : siblingsRightChild.getColor();
        var isSiblingLeftChild = sibling.getParent().isLeftChild(sibling);
        if (siblingColor === Node_1.Color.BLACK) {
            if (siblingLeftChildColor === Node_1.Color.RED || siblingRightChildColor === Node_1.Color.RED) {
                if (sibling.getParent().isLeftChild(sibling)) {
                    if (siblingLeftChildColor === Node_1.Color.RED) {
                        this.rightRotate(sibling.getParent(), sibling);
                        siblingsLeftChild.setColor(Node_1.Color.BLACK);
                    }
                    else {
                        this.leftRotate(sibling, sibling.getRightChild());
                        this.rightRotate(sibling.grandParent(), sibling.getParent());
                        sibling.setColor(Node_1.Color.BLACK);
                    }
                }
                else {
                    if (siblingRightChildColor === Node_1.Color.RED) {
                        this.leftRotate(sibling.getParent(), sibling);
                        siblingsRightChild.setColor(Node_1.Color.BLACK);
                    }
                    else {
                        this.rightRotate(sibling, sibling.getLeftChild());
                        this.leftRotate(sibling.grandParent(), sibling.getParent());
                        sibling.setColor(Node_1.Color.BLACK);
                    }
                }
            }
            else {
                sibling.setColor(Node_1.Color.RED);
                var parent_1 = sibling.getParent();
                if (parent_1.getColor() === Node_1.Color.BLACK && !this.tree.isRoot(parent_1)) {
                    this.recover(parent_1.sibling());
                }
                else {
                    parent_1.setColor(Node_1.Color.BLACK);
                }
            }
        }
        else {
            var parent_2 = sibling.getParent();
            var newSibling = void 0;
            sibling.setColor(Node_1.Color.BLACK);
            parent_2.setColor(Node_1.Color.RED);
            if (isSiblingLeftChild) {
                newSibling = sibling.getRightChild();
                this.rightRotate(sibling.getParent(), sibling);
            }
            else {
                newSibling = sibling.getLeftChild();
                this.leftRotate(sibling.getParent(), sibling);
            }
            this.recover(newSibling);
        }
    };
    DeleteHandler.prototype.swap = function (node1, node2) {
        if (node1.getParent() === node2) {
            this.swapChildParent(node2, node1);
        }
        else if (node2.getParent() === node1) {
            this.swapChildParent(node1, node2);
        }
        else {
            var node1Parent = node1.getParent();
            var node1LeftChild = node1.getLeftChild();
            var node1RightChild = node1.getRightChild();
            var node2Parent = node2.getParent();
            var node2LeftChild = node2.getLeftChild();
            var node2RightChild = node2.getRightChild();
            var node1Color = node1.getColor();
            var node2Color = node2.getColor();
            node1.setLeftChild(node2LeftChild);
            node1.setRightChild(node2RightChild);
            node2.setLeftChild(node1LeftChild);
            node2.setRightChild(node1RightChild);
            node1.setColor(node2Color);
            node2.setColor(node1Color);
            if (node1Parent == null) {
                this.tree.setRoot(node2);
            }
            else {
                node1Parent.substituteNode(node1, node2);
            }
            if (node2Parent == null) {
                this.tree.setRoot(node1);
            }
            else {
                node2Parent.substituteNode(node2, node1);
            }
        }
    };
    DeleteHandler.prototype.swapChildParent = function (parent, child) {
        var parentColor = parent.getColor();
        var childColor = child.getColor();
        var leftGrandChild = child.getLeftChild();
        var rightGrandChild = child.getRightChild();
        var grandParent = parent.getParent();
        if (grandParent == null) {
            this.tree.setRoot(child);
        }
        else if (grandParent.isLeftChild(parent)) {
            grandParent.setLeftChild(child);
        }
        else {
            grandParent.setRightChild(child);
        }
        if (parent.isLeftChild(child)) {
            var rightChild = parent.getRightChild();
            child.setLeftChild(parent);
            child.setRightChild(rightChild);
        }
        else {
            var leftChild = parent.getLeftChild();
            child.setRightChild(parent);
            child.setLeftChild(leftChild);
        }
        child.setColor(parentColor);
        parent.setLeftChild(leftGrandChild);
        parent.setRightChild(rightGrandChild);
        parent.setColor(childColor);
    };
    return DeleteHandler;
}(UpdateHandler_1.UpdateHandler));
exports.DeleteHandler = DeleteHandler;
//# sourceMappingURL=DeleteHandler.js.map