"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./Node");
var RedBlackTree_1 = require("./RedBlackTree");
var TreeLevel_1 = require("./TreeLevel");
var TreeBuilder = /** @class */ (function () {
    function TreeBuilder(nodeFactory, comparator) {
        this.tree = new RedBlackTree_1.RedBlackTree(nodeFactory, comparator);
        this.nodeFactory = nodeFactory;
    }
    TreeBuilder.empty = function (nodeFactory, comparator) {
        return new TreeBuilder(nodeFactory, comparator);
    };
    TreeBuilder.prototype.setRootNode = function (value, levelBuilder) {
        var node = new Node_1.TreeNode(value, Node_1.Color.BLACK);
        this.tree.setRoot(node);
        if (levelBuilder != null) {
            levelBuilder(new TreeLevel_1.TreeLevel(node, this.nodeFactory));
        }
        return this;
    };
    TreeBuilder.prototype.build = function () {
        return this.tree;
    };
    return TreeBuilder;
}());
exports.TreeBuilder = TreeBuilder;
//# sourceMappingURL=TreeBuilder.js.map