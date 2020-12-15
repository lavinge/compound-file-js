"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Long = __importStar(require("long"));
require("../Long");
var utils_1 = require("../utils");
var Node_1 = require("../tree/Node");
var ColorFlag;
(function (ColorFlag) {
    ColorFlag[ColorFlag["RED"] = 0] = "RED";
    ColorFlag[ColorFlag["BLACK"] = 1] = "BLACK";
})(ColorFlag = exports.ColorFlag || (exports.ColorFlag = {}));
var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["Storage"] = 1] = "Storage";
    ObjectType[ObjectType["Stream"] = 2] = "Stream";
    ObjectType[ObjectType["RootStorage"] = 5] = "RootStorage";
    ObjectType[ObjectType["Unknown"] = 0] = "Unknown";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));
function toNodeColor(colorFlag) {
    return colorFlag === ColorFlag.BLACK ? Node_1.Color.BLACK : Node_1.Color.RED;
}
exports.toNodeColor = toNodeColor;
function toColorFlag(color) {
    return color === Node_1.Color.BLACK ? ColorFlag.BLACK : ColorFlag.RED;
}
exports.toColorFlag = toColorFlag;
var DirectoryEntry = /** @class */ (function () {
    function DirectoryEntry(id, directoryEntryChain, view, name, colorFlag, objectType) {
        this.id = id;
        this.directoryEntryChain = directoryEntryChain;
        this.view = view;
        if (name == null) {
            if (view.getSize() !== DirectoryEntry.ENTRY_LENGTH)
                throw new Error();
            var nameLength = Long.fromBytesLE(view.subView(DirectoryEntry.FLAG_POSITION.DIRECTORY_ENTRY_NAME_LENGTH, DirectoryEntry.FLAG_POSITION.DIRECTORY_ENTRY_NAME_LENGTH + 2).getData()).toNumber();
            if (nameLength < 0 || nameLength > DirectoryEntry.ENTRY_NAME_MAXIMUM_LENGTH)
                throw new Error();
            this.objectType = view.subView(DirectoryEntry.FLAG_POSITION.OBJECT_TYPE, DirectoryEntry.FLAG_POSITION.OBJECT_TYPE + 1).getData()[0];
            this.colorFlag = view.subView(DirectoryEntry.FLAG_POSITION.COLOR_FLAG, DirectoryEntry.FLAG_POSITION.COLOR_FLAG + 1).getData()[0];
            this.setStateBits(utils_1.initializedWidth(4, 0));
            this.setCLSID(utils_1.initializedWidth(16, 0));
            this.setModifiedTime(utils_1.initializedWidth(8, 0));
            this.setCreationTime(utils_1.initializedWidth(8, 0));
        }
        else {
            this.setObjectType(objectType);
            this.setColorFlag(colorFlag);
            var nameLength = name.length * 2 + 2;
            if (nameLength < 0 || nameLength > DirectoryEntry.ENTRY_NAME_MAXIMUM_LENGTH)
                throw new Error();
            this.setDirectoryEntryName(name);
            this.setLeftSibling(null);
            this.setRightSibling(null);
            view.subView(DirectoryEntry.FLAG_POSITION.STREAM_SIZE, DirectoryEntry.FLAG_POSITION.STREAM_SIZE + 8).writeAt(0, Long.fromValue(0).toBytesLE());
            this.setStreamStartingSector(utils_1.ENDOFCHAIN_MARK_INT);
        }
    }
    DirectoryEntry.prototype.compareTo = function (o) {
        var result = this.getDirectoryEntryName().length - o.getDirectoryEntryName().length;
        if (result === 0) {
            if (this.getDirectoryEntryName().toUpperCase() > o.getDirectoryEntryName().toUpperCase()) {
                return 1;
            }
            else if (this.getDirectoryEntryName().toUpperCase() < o.getDirectoryEntryName().toUpperCase()) {
                return -1;
            }
            else {
                return 0;
            }
        }
        return result;
    };
    DirectoryEntry.prototype.setRightSibling = function (rightSibling) {
        if (rightSibling == null) {
            this.view.subView(DirectoryEntry.FLAG_POSITION.RIGHT_SIBLING, DirectoryEntry.FLAG_POSITION.RIGHT_SIBLING + 4).writeAt(0, utils_1.FREESECT_MARK_OR_NOSTREAM);
        }
        else {
            this.view.subView(DirectoryEntry.FLAG_POSITION.RIGHT_SIBLING, DirectoryEntry.FLAG_POSITION.RIGHT_SIBLING + 4).writeAt(0, Long.fromValue(rightSibling.getId()).to4BytesLE());
        }
    };
    DirectoryEntry.setRightSibling = function (view, position) {
        view.subView(DirectoryEntry.FLAG_POSITION.RIGHT_SIBLING, DirectoryEntry.FLAG_POSITION.RIGHT_SIBLING + 4).writeAt(0, Long.fromValue(position).to4BytesLE());
    };
    DirectoryEntry.prototype.setLeftSibling = function (leftSibling) {
        if (leftSibling == null) {
            this.view.subView(DirectoryEntry.FLAG_POSITION.LEFT_SIBLING, DirectoryEntry.FLAG_POSITION.LEFT_SIBLING + 4).writeAt(0, utils_1.FREESECT_MARK_OR_NOSTREAM);
        }
        else {
            this.view.subView(DirectoryEntry.FLAG_POSITION.LEFT_SIBLING, DirectoryEntry.FLAG_POSITION.LEFT_SIBLING + 4).writeAt(0, Long.fromValue(leftSibling.getId()).to4BytesLE());
        }
    };
    DirectoryEntry.setLeftSibling = function (view, position) {
        view.subView(DirectoryEntry.FLAG_POSITION.LEFT_SIBLING, DirectoryEntry.FLAG_POSITION.LEFT_SIBLING + 4).writeAt(0, Long.fromValue(position).to4BytesLE());
    };
    DirectoryEntry.prototype.setDirectoryEntryName = function (name) {
        if (!name) {
            throw new Error("Directory Entry name should be non-null and non-empty string");
        }
        if (name.length > DirectoryEntry.ENTRY_NAME_MAXIMUM_LENGTH_UTF16_STRING) {
            throw new Error("Directory Entry name may contain 31 UTF-16 at most + NULL terminated character");
        }
        this.view
            .subView(DirectoryEntry.FLAG_POSITION.DIRECTORY_ENTRY_NAME, DirectoryEntry.FLAG_POSITION.DIRECTORY_ENTRY_NAME + DirectoryEntry.ENTRY_NAME_MAXIMUM_LENGTH)
            .writeAt(0, utils_1.addTrailingZeros(utils_1.toUTF16Bytes(name), DirectoryEntry.ENTRY_NAME_MAXIMUM_LENGTH));
        var lengthInBytesIncludingTerminatorSymbol = name.length;
        this.view
            .subView(DirectoryEntry.FLAG_POSITION.DIRECTORY_ENTRY_NAME_LENGTH, DirectoryEntry.FLAG_POSITION.DIRECTORY_ENTRY_NAME_LENGTH + 2)
            .writeAt(0, Long.fromValue(lengthInBytesIncludingTerminatorSymbol * 2 + 2).to2BytesLE());
    };
    DirectoryEntry.prototype.getId = function () {
        return this.id;
    };
    DirectoryEntry.prototype.getDirectoryEntryName = function () {
        return utils_1.toUTF16WithNoTrailingZeros(this.view
            .subView(DirectoryEntry.FLAG_POSITION.DIRECTORY_ENTRY_NAME, DirectoryEntry.FLAG_POSITION.DIRECTORY_ENTRY_NAME + DirectoryEntry.ENTRY_NAME_MAXIMUM_LENGTH)
            .getData());
    };
    DirectoryEntry.prototype.getDirectoryEntryNameLength = function () {
        return Long.fromBytesLE(this.view
            .subView(DirectoryEntry.FLAG_POSITION.DIRECTORY_ENTRY_NAME_LENGTH, DirectoryEntry.FLAG_POSITION.DIRECTORY_ENTRY_NAME_LENGTH + 2).getData()).toNumber();
    };
    DirectoryEntry.prototype.getDirectoryEntryNameLengthUTF8 = function () {
        return (this.getDirectoryEntryNameLength() - 2) / 2;
    };
    DirectoryEntry.prototype.getChild = function () {
        var childPosition = this.getChildPosition();
        return utils_1.isFreeSectOrNoStream(childPosition) ? null : this.directoryEntryChain.getEntryById(childPosition);
    };
    DirectoryEntry.prototype.getChildPosition = function () {
        return DirectoryEntry.getChildPosition(this.view);
    };
    DirectoryEntry.getChildPosition = function (view) {
        return Long.fromBytesLE(view.subView(DirectoryEntry.FLAG_POSITION.CHILD, DirectoryEntry.FLAG_POSITION.CHILD + 4).getData()).toNumber();
    };
    DirectoryEntry.prototype.setObjectType = function (objectType) {
        this.objectType = objectType;
        this.view
            .subView(DirectoryEntry.FLAG_POSITION.OBJECT_TYPE, DirectoryEntry.FLAG_POSITION.OBJECT_TYPE + 1)
            .writeAt(0, [objectType]);
    };
    DirectoryEntry.prototype.getLeftSibling = function () {
        var leftSiblingPosition = this.getLeftSiblingPosition();
        return utils_1.isFreeSectOrNoStream(leftSiblingPosition) || utils_1.isEndOfChain(leftSiblingPosition) ? null : this.directoryEntryChain.getEntryById(leftSiblingPosition);
    };
    DirectoryEntry.prototype.getLeftSiblingPosition = function () {
        return DirectoryEntry.getLeftSiblingPosition(this.view);
    };
    DirectoryEntry.getLeftSiblingPosition = function (view) {
        return Long.fromBytesLE(view.subView(DirectoryEntry.FLAG_POSITION.LEFT_SIBLING, DirectoryEntry.FLAG_POSITION.LEFT_SIBLING + 4).getData()).toNumber();
    };
    DirectoryEntry.prototype.getRightSibling = function () {
        var rightSiblingPosition = this.getRightSiblingPosition();
        return utils_1.isFreeSectOrNoStream(rightSiblingPosition) ? null : this.directoryEntryChain.getEntryById(rightSiblingPosition);
    };
    DirectoryEntry.prototype.getRightSiblingPosition = function () {
        return DirectoryEntry.getRightSiblingPosition(this.view);
    };
    DirectoryEntry.getRightSiblingPosition = function (view) {
        return Long.fromBytesLE(view.subView(DirectoryEntry.FLAG_POSITION.RIGHT_SIBLING, DirectoryEntry.FLAG_POSITION.RIGHT_SIBLING + 4).getData()).toNumber();
    };
    DirectoryEntry.prototype.getStreamStartingSector = function () {
        return Long.fromBytesLE(this.view.subView(DirectoryEntry.FLAG_POSITION.STARTING_SECTOR_LOCATION, DirectoryEntry.FLAG_POSITION.STARTING_SECTOR_LOCATION + 4).getData()).toNumber();
    };
    DirectoryEntry.prototype.setStreamStartingSector = function (startingSector) {
        this.view
            .subView(DirectoryEntry.FLAG_POSITION.STARTING_SECTOR_LOCATION, DirectoryEntry.FLAG_POSITION.STARTING_SECTOR_LOCATION + 4)
            .writeAt(0, Long.fromValue(startingSector).to4BytesLE());
    };
    DirectoryEntry.prototype.traverse = function (action) {
        var _a, _b, _c;
        action(this);
        (_a = this.getLeftSibling()) === null || _a === void 0 ? void 0 : _a.traverse(action);
        (_b = this.getRightSibling()) === null || _b === void 0 ? void 0 : _b.traverse(action);
        (_c = this.getChild()) === null || _c === void 0 ? void 0 : _c.traverse(action);
    };
    DirectoryEntry.prototype.getObjectType = function () {
        return this.objectType;
    };
    DirectoryEntry.prototype.getColorFlag = function () {
        return this.colorFlag;
    };
    DirectoryEntry.prototype.setColorFlag = function (colorFlag) {
        this.colorFlag = colorFlag;
        this.view
            .subView(DirectoryEntry.FLAG_POSITION.COLOR_FLAG, DirectoryEntry.FLAG_POSITION.COLOR_FLAG + 1)
            .writeAt(0, [colorFlag]);
    };
    DirectoryEntry.prototype.invertColor = function () {
        this.colorFlag === ColorFlag.BLACK ? this.setColorFlag(ColorFlag.RED) : this.setColorFlag(ColorFlag.BLACK);
    };
    DirectoryEntry.prototype.setCLSID = function (bytes) {
        this.view.subView(DirectoryEntry.FLAG_POSITION.CLSID, DirectoryEntry.FLAG_POSITION.CLSID + 16).writeAt(0, bytes);
    };
    DirectoryEntry.prototype.setStateBits = function (bytes) {
        this.view.subView(DirectoryEntry.FLAG_POSITION.STATE_BITS, DirectoryEntry.FLAG_POSITION.STATE_BITS + 4).writeAt(0, bytes);
    };
    DirectoryEntry.prototype.setCreationTime = function (bytes) {
        this.view.subView(DirectoryEntry.FLAG_POSITION.CREATION_TIME, DirectoryEntry.FLAG_POSITION.CREATION_TIME + 8).writeAt(0, bytes);
    };
    DirectoryEntry.prototype.setModifiedTime = function (bytes) {
        this.view.subView(DirectoryEntry.FLAG_POSITION.MODIFY_TIME, DirectoryEntry.FLAG_POSITION.MODIFY_TIME + 8).writeAt(0, bytes);
    };
    DirectoryEntry.prototype.getCLSID = function () {
        return this.view.subView(DirectoryEntry.FLAG_POSITION.CLSID, DirectoryEntry.FLAG_POSITION.CLSID + 16).getData();
    };
    DirectoryEntry.prototype.getStateBits = function () {
        return this.view.subView(DirectoryEntry.FLAG_POSITION.STATE_BITS, DirectoryEntry.FLAG_POSITION.STATE_BITS + 4).getData();
    };
    DirectoryEntry.prototype.getCreationTime = function () {
        return this.view.subView(DirectoryEntry.FLAG_POSITION.CREATION_TIME, DirectoryEntry.FLAG_POSITION.CREATION_TIME + 8).getData();
    };
    DirectoryEntry.prototype.getModifiedTime = function () {
        return this.view.subView(DirectoryEntry.FLAG_POSITION.MODIFY_TIME, DirectoryEntry.FLAG_POSITION.MODIFY_TIME + 8).getData();
    };
    DirectoryEntry.ENTRY_LENGTH = 128;
    DirectoryEntry.ENTRY_NAME_MAXIMUM_LENGTH_UTF16_STRING = 31;
    DirectoryEntry.ENTRY_NAME_MAXIMUM_LENGTH = 64;
    DirectoryEntry.FLAG_POSITION = {
        DIRECTORY_ENTRY_NAME: 0,
        DIRECTORY_ENTRY_NAME_LENGTH: 64,
        OBJECT_TYPE: 66,
        COLOR_FLAG: 67,
        LEFT_SIBLING: 68,
        RIGHT_SIBLING: 72,
        CHILD: 76,
        CLSID: 80,
        STATE_BITS: 96,
        CREATION_TIME: 100,
        MODIFY_TIME: 108,
        STARTING_SECTOR_LOCATION: 116,
        STREAM_SIZE: 120,
    };
    return DirectoryEntry;
}());
exports.DirectoryEntry = DirectoryEntry;
//# sourceMappingURL=DirectoryEntry.js.map