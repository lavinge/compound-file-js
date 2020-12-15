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
var Long = __importStar(require("long"));
require("../Long");
var utils_1 = require("../utils");
var StreamDirectoryEntry = /** @class */ (function (_super) {
    __extends(StreamDirectoryEntry, _super);
    function StreamDirectoryEntry(id, directoryEntryChain, streamHolder, view, name, colorFlag, objectType) {
        if (objectType === void 0) { objectType = DirectoryEntry_1.ObjectType.Stream; }
        var _this = _super.call(this, id, directoryEntryChain, view, name, colorFlag, objectType) || this;
        _this.streamHolder = streamHolder;
        return _this;
    }
    StreamDirectoryEntry.prototype.getStreamData = function () {
        if (this.hasStreamData() && this.getStreamSize() > 0) {
            return this.streamHolder.getStreamData(this.getStreamStartingSector(), this.getStreamSize());
        }
        else {
            return [];
        }
    };
    StreamDirectoryEntry.prototype.setStreamData = function (data) {
        this.setStreamStartingSector(this.streamHolder.setStreamData(data));
        this.setStreamSize(data.length);
    };
    StreamDirectoryEntry.prototype.read = function (fromIncl, toExcl) {
        return this.streamHolder.read(this.getStreamStartingSector(), this.getStreamSize(), fromIncl, toExcl);
    };
    StreamDirectoryEntry.prototype.writeAt = function (position, data) {
        if (position < 0)
            throw new Error("Starting position should be greater than 0: start = " + position);
        if (position + data.length > this.getStreamSize())
            throw new Error("Cannot write beyond the end of the stream: start = " + position + ", end = " + (position + data.length));
        this.streamHolder.writeAt(this.getStreamStartingSector(), this.getStreamSize(), position, data);
    };
    StreamDirectoryEntry.prototype.append = function (data) {
        var startingLocation = this.streamHolder.append(this.getStreamStartingSector(), this.getStreamSize(), data);
        this.setStreamStartingSector(startingLocation);
        this.setStreamSize(this.getStreamSize() + data.length);
    };
    StreamDirectoryEntry.prototype.setStreamSize = function (length) {
        this.view.subView(DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STREAM_SIZE, DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STREAM_SIZE + 4).writeAt(0, Long.fromValue(length).to4BytesLE());
    };
    StreamDirectoryEntry.prototype.getStreamSize = function () {
        return Long.fromBytesLE(this.view.subView(DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STREAM_SIZE, DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STREAM_SIZE + 4).getData()).toNumber();
    };
    StreamDirectoryEntry.prototype.hasStreamData = function () {
        return this.getObjectType() === DirectoryEntry_1.ObjectType.Stream && !utils_1.isEndOfChain(this.getStreamStartingSector());
    };
    return StreamDirectoryEntry;
}(DirectoryEntry_1.DirectoryEntry));
exports.StreamDirectoryEntry = StreamDirectoryEntry;
//# sourceMappingURL=StreamDirectoryEntry.js.map