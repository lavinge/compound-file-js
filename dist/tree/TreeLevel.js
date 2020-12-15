"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./Node");
var TreeLevel = /** @class */ (function () {
    function TreeLevel(parent, nodeFactory) {
        this.parent = parent;
        this.nodeFactory = nodeFactory;
    }
    TreeLevel.prototype.left = function (value, color, levelBuilder) {
        var node = new Node_1.TreeNode(value, color);
        this.parent.setLeftChild(node);
        if (levelBuilder != null) {
            levelBuilder(new TreeLevel(node, this.nodeFactory));
        }
    };
    TreeLevel.prototype.right = function (value, color, levelBuilder) {
        var node = new Node_1.TreeNode(value, color);
        this.parent.setRightChild(node);
        if (levelBuilder != null) {
            levelBuilder(new TreeLevel(node, this.nodeFactory));
        }
    };
    return TreeLevel;
}());
exports.TreeLevel = TreeLevel;
//# sourceMappingURL=TreeLevel.js.map