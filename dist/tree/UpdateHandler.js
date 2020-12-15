"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UpdateHandler = /** @class */ (function () {
    function UpdateHandler(tree) {
        this.tree = tree;
    }
    UpdateHandler.prototype.rightRotate = function (subTreeRoot, pivot) {
        var parent = subTreeRoot.getParent();
        if (parent == null) {
            subTreeRoot.setLeftChild(pivot.getRightChild());
            pivot.setRightChild(subTreeRoot);
            this.tree.setRoot(pivot);
        }
        else {
            var isLeftSubTree = parent.isLeftChild(subTreeRoot);
            subTreeRoot.setLeftChild(pivot.getRightChild());
            pivot.setRightChild(subTreeRoot);
            if (isLeftSubTree) {
                parent.setLeftChild(pivot);
            }
            else {
                parent.setRightChild(pivot);
            }
        }
        this.swapColor(subTreeRoot, pivot);
    };
    UpdateHandler.prototype.leftRotate = function (subTreeRoot, pivot) {
        var parent = subTreeRoot.getParent();
        if (parent == null) {
            subTreeRoot.setRightChild(pivot.getLeftChild());
            pivot.setLeftChild(subTreeRoot);
            this.tree.setRoot(pivot);
        }
        else {
            var isLeftSubTree = parent.isLeftChild(subTreeRoot);
            subTreeRoot.setRightChild(pivot.getLeftChild());
            pivot.setLeftChild(subTreeRoot);
            if (isLeftSubTree) {
                parent.setLeftChild(pivot);
            }
            else {
                parent.setRightChild(pivot);
            }
        }
        this.swapColor(subTreeRoot, pivot);
    };
    UpdateHandler.prototype.swapColor = function (node1, node2) {
        var node1Color = node1.getColor();
        node1.setColor(node2.getColor());
        node2.setColor(node1Color);
    };
    return UpdateHandler;
}());
exports.UpdateHandler = UpdateHandler;
//# sourceMappingURL=UpdateHandler.js.map