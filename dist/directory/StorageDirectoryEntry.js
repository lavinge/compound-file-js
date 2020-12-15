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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DirectoryEntry_1 = require("./DirectoryEntry");
var RedBlackTree_1 = require("../tree/RedBlackTree");
var Node_1 = require("../tree/Node");
var DirectoryEntryNode_1 = require("./DirectoryEntryNode");
var StreamDirectoryEntry_1 = require("./StreamDirectoryEntry");
var Long = __importStar(require("long"));
require("../Long");
var StorageDirectoryEntry = /** @class */ (function (_super) {
    __extends(StorageDirectoryEntry, _super);
    function StorageDirectoryEntry(id, directoryEntryChain, view, name, colorFlag, objectType) {
        if (objectType === void 0) { objectType = DirectoryEntry_1.ObjectType.Storage; }
        var _this = _super.call(this, id, directoryEntryChain, view, name, colorFlag, objectType) || this;
        _this.tree = new RedBlackTree_1.RedBlackTree(StorageDirectoryEntry.NODE_FACTORY, function (o1, o2) { return o1.compareTo(o2); });
        var child = _this.getChild();
        if (child != null) {
            _this.tree.setRoot(new DirectoryEntryNode_1.DirectoryEntryNode(child, Node_1.Color.BLACK));
        }
        return _this;
    }
    StorageDirectoryEntry.prototype.setChildDirectoryEntry = function (entry) {
        this.view.subView(DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.CHILD, DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.CHILD + 4).writeAt(0, Long.fromValue(entry.getId()).to4BytesLE());
    };
    StorageDirectoryEntry.prototype.addChild = function (entry) {
        this.tree.insert(entry);
        this.setChildDirectoryEntry(this.tree.getRoot().getValue());
        return entry;
    };
    StorageDirectoryEntry.prototype.addStream = function (name, data) {
        return this.addChild(this.directoryEntryChain.createStream(name, DirectoryEntry_1.ColorFlag.RED, data));
    };
    StorageDirectoryEntry.prototype.addStorage = function (name) {
        return this.addChild(this.directoryEntryChain.createStorage(name, DirectoryEntry_1.ColorFlag.RED));
    };
    StorageDirectoryEntry.prototype.findChild = function (predicate) {
        var result = null;
        this.eachChild(function (directoryEntry) { return result = directoryEntry; }, predicate);
        return result;
    };
    StorageDirectoryEntry.prototype.findChildren = function (predicate) {
        var children = [];
        this.eachChild(function (directoryEntry) {
            if (predicate(directoryEntry)) {
                children.push(directoryEntry);
            }
        }, function () { return false; });
        return children;
    };
    StorageDirectoryEntry.prototype.children = function () {
        var children = [];
        this.eachChild(function (directoryEntry) {
            children.push(directoryEntry);
        });
        return children;
    };
    StorageDirectoryEntry.prototype.storages = function () {
        return this.children().filter(function (directoryEntry) { return directoryEntry instanceof StorageDirectoryEntry; }).map(function (directoryEntry) { return directoryEntry; });
    };
    StorageDirectoryEntry.prototype.streams = function () {
        return this.children().filter(function (directoryEntry) { return directoryEntry instanceof StreamDirectoryEntry_1.StreamDirectoryEntry; }).map(function (directoryEntry) { return directoryEntry; });
    };
    StorageDirectoryEntry.prototype.eachChild = function (consumer, stopPredicate) {
        if (stopPredicate == null) {
            stopPredicate = function () { return false; };
        }
        var visitedNodes = [];
        var currentNode = this.tree.getRoot();
        if (currentNode == null) {
            return;
        }
        while (true) {
            if (currentNode != null && visitedNodes.indexOf(currentNode.getValue().getId()) === -1) {
                visitedNodes.push(currentNode.getValue().getId());
                consumer(currentNode.getValue());
                if (stopPredicate(currentNode.getValue())) {
                    break;
                }
            }
            var leftChild = currentNode.getLeftChild();
            if (leftChild != null && visitedNodes.indexOf(leftChild.getValue().getId()) === -1) {
                currentNode = currentNode.getLeftChild();
                continue;
            }
            var rightChild = currentNode.getRightChild();
            if (rightChild != null && visitedNodes.indexOf(rightChild.getValue().getId()) === -1) {
                currentNode = currentNode.getRightChild();
                continue;
            }
            var parent_1 = currentNode.getParent();
            if (parent_1 != null) {
                currentNode = currentNode.getParent();
                continue;
            }
            break;
        }
    };
    StorageDirectoryEntry.NODE_FACTORY = {
        create: function (value, color) { return new DirectoryEntryNode_1.DirectoryEntryNode(value, color); }
    };
    return StorageDirectoryEntry;
}(DirectoryEntry_1.DirectoryEntry));
exports.StorageDirectoryEntry = StorageDirectoryEntry;
//# sourceMappingURL=StorageDirectoryEntry.js.map