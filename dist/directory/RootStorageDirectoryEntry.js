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
var StorageDirectoryEntry_1 = require("./StorageDirectoryEntry");
var DirectoryEntry_1 = require("./DirectoryEntry");
var Node_1 = require("../tree/Node");
var DirectoryEntryNode_1 = require("./DirectoryEntryNode");
var RootStorageDirectoryEntry = /** @class */ (function (_super) {
    __extends(RootStorageDirectoryEntry, _super);
    function RootStorageDirectoryEntry(id, directoryEntryChain, view, name, colorFlag, objectType) {
        if (objectType === void 0) { objectType = DirectoryEntry_1.ObjectType.Storage; }
        var _this = _super.call(this, id, directoryEntryChain, view, name, colorFlag, objectType) || this;
        var child = _this.getChild();
        if (child != null) {
            _this.tree.setRoot(new DirectoryEntryNode_1.DirectoryEntryNode(child, Node_1.Color.BLACK));
        }
        return _this;
    }
    RootStorageDirectoryEntry.prototype.getChild = function () {
        if (this.getChildPosition() === RootStorageDirectoryEntry.ID) {
            throw new Error("Root Entry child cannot have ID == 0");
        }
        return _super.prototype.getChild.call(this);
    };
    RootStorageDirectoryEntry.prototype.setRightSibling = function (rightSibling) {
        if (rightSibling != null) {
            throw new Error("Root Storage cannot have siblings");
        }
    };
    RootStorageDirectoryEntry.prototype.setLeftSibling = function (leftSibling) {
        if (leftSibling != null) {
            throw new Error("Root Storage cannot have siblings");
        }
    };
    RootStorageDirectoryEntry.prototype.setDirectoryEntryName = function (name) {
        if ("Root Entry" !== name) {
            throw new Error("Name of Root Storage directory entry is always " + RootStorageDirectoryEntry.NAME);
        }
        _super.prototype.setDirectoryEntryName.call(this, name);
    };
    RootStorageDirectoryEntry.NAME = "Root Entry";
    RootStorageDirectoryEntry.ID = 0;
    return RootStorageDirectoryEntry;
}(StorageDirectoryEntry_1.StorageDirectoryEntry));
exports.RootStorageDirectoryEntry = RootStorageDirectoryEntry;
//# sourceMappingURL=RootStorageDirectoryEntry.js.map