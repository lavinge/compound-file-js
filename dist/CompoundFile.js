"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Header_1 = require("./Header");
var DIFAT_1 = require("./alloc/DIFAT");
var Sectors_1 = require("./Sectors");
var FAT_1 = require("./alloc/FAT");
var MiniFAT_1 = require("./alloc/MiniFAT");
var DirectoryEntryChain_1 = require("./directory/DirectoryEntryChain");
var FATtoDIFATFacade_1 = require("./alloc/FATtoDIFATFacade");
var MiniStreamRW_1 = require("./stream/MiniStreamRW");
var StreamHolder_1 = require("./stream/StreamHolder");
var RegularStream_1 = require("./stream/RegularStream");
var FixedSizeChunkedDataview_1 = require("./dataview/FixedSizeChunkedDataview");
var utils_1 = require("./utils");
var DirectoryEntry_1 = require("./directory/DirectoryEntry");
var Long = __importStar(require("long"));
require("./Long");
var StorageDirectoryEntry_1 = require("./directory/StorageDirectoryEntry");
var StreamDirectoryEntry_1 = require("./directory/StreamDirectoryEntry");
var CompoundFile = /** @class */ (function () {
    function CompoundFile(dataView) {
        var emptyFile = dataView == null;
        if (emptyFile) {
            dataView = CompoundFile.empty();
        }
        this.dataView = dataView;
        this.header = new Header_1.Header(dataView.subView(0, Header_1.Header.HEADER_LENGTH));
        this.sectors = new Sectors_1.Sectors(dataView, this.header);
        var faTtoDIFATFacade = new FATtoDIFATFacade_1.FATtoDIFATFacade();
        this.difat = new DIFAT_1.DIFAT(this.sectors, this.header, faTtoDIFATFacade);
        faTtoDIFATFacade.setDifat(this.difat);
        this.fat = new FAT_1.FAT(this.sectors, this.header, faTtoDIFATFacade);
        faTtoDIFATFacade.setFat(this.fat);
        this.miniFat = new MiniFAT_1.MiniFAT(this.sectors, this.header, this.fat);
        var miniStreamRW = new MiniStreamRW_1.MiniStreamRW(this.miniFat, this.fat, this.getMiniStreamFirstSectorLocation(), this.getMiniStreamLength(), this.sectors, this.header);
        var me = this;
        var listenableMiniStream = {
            read: function (startingSector, lengthOrFromIncl, toExcl) { return miniStreamRW.read(startingSector, lengthOrFromIncl, toExcl); },
            write: function (data) {
                var firstSectorLocation = miniStreamRW.write(data);
                me.setMiniStreamFirstSectorLocation(miniStreamRW.getMiniStreamFirstSectorPosition());
                me.setMiniStreamLength(miniStreamRW.getMiniStreamLength());
                return firstSectorLocation;
            },
            writeAt: function (startingSector, position, data) { return miniStreamRW.writeAt(startingSector, position, data); },
            append: function (startingSector, currentSize, data) {
                var firstSectorLocation = miniStreamRW.append(startingSector, currentSize, data);
                me.setMiniStreamFirstSectorLocation(miniStreamRW.getMiniStreamFirstSectorPosition());
                me.setMiniStreamLength(miniStreamRW.getMiniStreamLength());
                return firstSectorLocation;
            }
        };
        var streamReader = new StreamHolder_1.StreamHolder(new RegularStream_1.RegularStreamRW(this.fat, this.sectors, this.header), listenableMiniStream, this.header.getMiniStreamCutoffSize());
        this.directoryEntryChain = new DirectoryEntryChain_1.DirectoryEntryChain(this.sectors, this.fat, this.header, streamReader);
        if (emptyFile) {
            this.directoryEntryChain.createRootStorage();
        }
    }
    CompoundFile.fromBytes = function (bytes) {
        return new CompoundFile(new FixedSizeChunkedDataview_1.FixedSizeChunkedDataview(512, bytes));
    };
    CompoundFile.fromUint8Array = function (bytes) {
        return new CompoundFile(new FixedSizeChunkedDataview_1.FixedSizeChunkedDataview(512, [].slice.call(bytes)));
    };
    CompoundFile.empty = function () {
        var dataView = new FixedSizeChunkedDataview_1.FixedSizeChunkedDataview(Header_1.Header.SECTOR_SHIFT_VERSION_3_INT);
        Header_1.Header.empty(dataView.allocate(Header_1.Header.HEADER_LENGTH));
        return dataView;
    };
    CompoundFile.prototype.getMiniStreamFirstSectorLocation = function () {
        if (utils_1.ENDOFCHAIN_MARK_INT === this.header.getFirstDirectorySectorLocation()) {
            return utils_1.ENDOFCHAIN_MARK_INT;
        }
        else {
            return Long.fromBytesLE(this.sectors.sector(this.header.getFirstDirectorySectorLocation()).subView(DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STARTING_SECTOR_LOCATION, DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STARTING_SECTOR_LOCATION + 4).getData()).toNumber();
        }
    };
    CompoundFile.prototype.getMiniStreamLength = function () {
        if (utils_1.ENDOFCHAIN_MARK_INT === this.header.getFirstDirectorySectorLocation()) {
            return 0;
        }
        else {
            return Long.fromBytesLE(this.sectors.sector(this.header.getFirstDirectorySectorLocation()).subView(DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STREAM_SIZE, DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STREAM_SIZE + 4).getData()).toNumber();
        }
    };
    CompoundFile.prototype.setMiniStreamFirstSectorLocation = function (position) {
        this.sectors.sector(this.header.getFirstDirectorySectorLocation())
            .subView(DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STARTING_SECTOR_LOCATION, DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STARTING_SECTOR_LOCATION + 4)
            .writeAt(0, position >= 0 ? Long.fromValue(position).to4BytesLE() : utils_1.ENDOFCHAIN_MARK);
    };
    CompoundFile.prototype.setMiniStreamLength = function (size) {
        this.sectors.sector(this.header.getFirstDirectorySectorLocation())
            .subView(DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STREAM_SIZE, DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.STREAM_SIZE + 4)
            .writeAt(0, Long.fromValue(size).to4BytesLE());
    };
    CompoundFile.prototype.getRootStorage = function () {
        return this.directoryEntryChain.getRootStorage();
    };
    CompoundFile.prototype.asBytes = function () {
        return this.dataView.getData();
    };
    CompoundFile.prototype.rewrite = function () {
        var copy = new CompoundFile();
        var rootStorage = this.getRootStorage();
        var rootStorageCopy = copy.getRootStorage();
        rootStorage.eachChild(this.copyConsumer(rootStorageCopy));
        return copy;
    };
    CompoundFile.prototype.copyConsumer = function (parent) {
        var consumer = this.copyConsumer.bind(this);
        return function (directoryEntry) {
            if (directoryEntry instanceof StorageDirectoryEntry_1.StorageDirectoryEntry) {
                var copy = parent.addStorage(directoryEntry.getDirectoryEntryName());
                directoryEntry.eachChild(consumer(copy));
            }
            else if (directoryEntry instanceof StreamDirectoryEntry_1.StreamDirectoryEntry) {
                parent.addStream(directoryEntry.getDirectoryEntryName(), directoryEntry.getStreamData());
            }
            else {
                throw new Error('Unsupported object type: ' + (typeof directoryEntry));
            }
        };
    };
    return CompoundFile;
}());
exports.CompoundFile = CompoundFile;
//# sourceMappingURL=CompoundFile.js.map