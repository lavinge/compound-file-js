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
var DifatEntries_1 = require("./DifatEntries");
var utils_1 = require("./utils");
var Header = /** @class */ (function () {
    function Header(dataView) {
        /*
            if(dataView.getSize() !== Header.HEADER_LENGTH) {
                throw new Error();
            }
            if(!equal(Header.HEADER_SIGNATURE, dataView.subView(Header.FLAG_POSITION.SIGNATURE, Header.FLAG_POSITION.SIGNATURE + 8).getData()))
                throw new Error();
            if(!equal(Header.MINOR_VERSION_3, dataView.subView(Header.FLAG_POSITION.MINOR_VERSION, Header.FLAG_POSITION.MINOR_VERSION +2).getData()))
                throw new Error();
            if(!equal(Header.MAJOR_VERSION_3, dataView.subView(Header.FLAG_POSITION.MAJOR_VERSION, Header.FLAG_POSITION.MAJOR_VERSION +2).getData()))
                throw new Error();
            if(!equal(Header.BYTE_ORDER_LITTLE_ENDIAN, dataView.subView(Header.FLAG_POSITION.BYTE_ORDER, Header.FLAG_POSITION.BYTE_ORDER + 2).getData()))
                throw new Error();
            if(!equal(Header.SECTOR_SHIFT_VERSION_3, dataView.subView(Header.FLAG_POSITION.SECTOR_SHIFT, Header.FLAG_POSITION.SECTOR_SHIFT + 2).getData()))
                throw new Error();
            if(!equal(Header.MINI_SECTOR_SHIFT_VERSION_3, dataView.subView(Header.FLAG_POSITION.MINI_SECTOR_SHIFT, Header.FLAG_POSITION.MINI_SECTOR_SHIFT + 2).getData()))
                throw new Error();
            if(!equal(initializedWidth(6, 0), dataView.subView(34, 40).getData()))
                throw new Error();
            if(!equal(initializedWidth(4, 0), dataView.subView(40, 44).getData()))
                throw new Error();
            if(!equal(Header.MINI_STREAM_CUTOFF_SIZE, dataView.subView(Header.FLAG_POSITION.MINI_STREAM_CUTOFF_SIZE_POSITION, Header.FLAG_POSITION.MINI_STREAM_CUTOFF_SIZE_POSITION + 4).getData()))
                throw new Error();
            */
        this.dataView = dataView;
        this.difatEntries = new DifatEntries_1.DifatEntries(this.dataView.subView(Header.FLAG_POSITION.DIFAT_ENTRIES_FIRST_POSITION));
    }
    Header.empty = function (dataView) {
        dataView
            .subView(Header.FLAG_POSITION.SIGNATURE, Header.FLAG_POSITION.SIGNATURE + 8)
            .writeAt(0, Header.HEADER_SIGNATURE);
        dataView
            .subView(Header.FLAG_POSITION.MINOR_VERSION, Header.FLAG_POSITION.MINOR_VERSION + 2)
            .writeAt(0, Header.MINOR_VERSION_3);
        dataView
            .subView(Header.FLAG_POSITION.MAJOR_VERSION, Header.FLAG_POSITION.MAJOR_VERSION + 2)
            .writeAt(0, Header.MAJOR_VERSION_3);
        dataView
            .subView(Header.FLAG_POSITION.BYTE_ORDER, Header.FLAG_POSITION.BYTE_ORDER + 2)
            .writeAt(0, Header.BYTE_ORDER_LITTLE_ENDIAN);
        dataView
            .subView(Header.FLAG_POSITION.SECTOR_SHIFT, Header.FLAG_POSITION.SECTOR_SHIFT + 2)
            .writeAt(0, Header.SECTOR_SHIFT_VERSION_3);
        dataView
            .subView(Header.FLAG_POSITION.MINI_SECTOR_SHIFT, Header.FLAG_POSITION.MINI_SECTOR_SHIFT + 2)
            .writeAt(0, Header.MINI_SECTOR_SHIFT_VERSION_3);
        dataView
            .subView(Header.FLAG_POSITION.MINI_STREAM_CUTOFF_SIZE_POSITION, Header.FLAG_POSITION.MINI_STREAM_CUTOFF_SIZE_POSITION + 4)
            .writeAt(0, Header.MINI_STREAM_CUTOFF_SIZE);
        dataView
            .subView(Header.FLAG_POSITION.MINI_STREAM_CUTOFF_SIZE_POSITION, Header.FLAG_POSITION.MINI_STREAM_CUTOFF_SIZE_POSITION + 4)
            .writeAt(0, Header.MINI_STREAM_CUTOFF_SIZE);
        dataView
            .subView(Header.FLAG_POSITION.FIRST_DIFAT_SECTOR, Header.FLAG_POSITION.FIRST_DIFAT_SECTOR + 4)
            .writeAt(0, utils_1.ENDOFCHAIN_MARK);
        dataView
            .subView(Header.FLAG_POSITION.FIRST_MINIFAT_SECTOR, Header.FLAG_POSITION.FIRST_MINIFAT_SECTOR + 4)
            .writeAt(0, utils_1.ENDOFCHAIN_MARK);
        dataView
            .subView(Header.FLAG_POSITION.FIRST_DIRECTORY_SECTOR, Header.FLAG_POSITION.FIRST_DIRECTORY_SECTOR + 4)
            .writeAt(0, utils_1.ENDOFCHAIN_MARK);
        dataView
            .subView(Header.FLAG_POSITION.DIFAT_ENTRIES_FIRST_POSITION, 512)
            .fill(utils_1.FREESECT_MARK_OR_NOSTREAM);
        return new Header(dataView);
    };
    Header.prototype.getFirstDirectorySectorLocation = function () {
        return Long.fromBytesLE(this.dataView
            .subView(Header.FLAG_POSITION.FIRST_DIRECTORY_SECTOR, Header.FLAG_POSITION.FIRST_DIRECTORY_SECTOR + 4)
            .getData()).toNumber();
    };
    Header.prototype.getNumberOfFatSectors = function () {
        return Long.fromBytesLE(this.dataView
            .subView(Header.FLAG_POSITION.NUMBER_OF_FAT_SECTORS, Header.FLAG_POSITION.NUMBER_OF_FAT_SECTORS + 4)
            .getData()).toNumber();
    };
    Header.prototype.getFirstMinifatSectorLocation = function () {
        return Long.fromBytesLE(this.dataView
            .subView(Header.FLAG_POSITION.FIRST_MINIFAT_SECTOR, Header.FLAG_POSITION.FIRST_MINIFAT_SECTOR + 4)
            .getData()).toNumber();
    };
    Header.prototype.getFirstDifatSectorLocation = function () {
        return Long.fromBytesLE(this.dataView
            .subView(Header.FLAG_POSITION.FIRST_DIFAT_SECTOR, Header.FLAG_POSITION.FIRST_DIFAT_SECTOR + 4)
            .getData()).toNumber();
    };
    Header.prototype.getNumberOfMiniFatSectors = function () {
        return Long.fromBytesLE(this.dataView
            .subView(Header.FLAG_POSITION.NUMBER_OF_MINIFAT_SECTORS, Header.FLAG_POSITION.NUMBER_OF_MINIFAT_SECTORS + 4)
            .getData()).toNumber();
    };
    Header.prototype.getNumberOfDifatSectors = function () {
        return Long.fromBytesLE(this.dataView
            .subView(Header.FLAG_POSITION.NUMBER_OF_DIFAT_SECTORS, Header.FLAG_POSITION.NUMBER_OF_DIFAT_SECTORS + 4)
            .getData()).toNumber();
    };
    Header.prototype.getDifatEntries = function () {
        return this.difatEntries.getDifatEntries();
    };
    Header.prototype.canFitMoreDifatEntries = function () {
        return !this.difatEntries.isFull();
    };
    Header.prototype.setNumberOfFatSectors = function (i) {
        this.dataView
            .subView(Header.FLAG_POSITION.NUMBER_OF_FAT_SECTORS, Header.FLAG_POSITION.NUMBER_OF_FAT_SECTORS + 4)
            .writeAt(0, Long.fromValue(i).to4BytesLE());
    };
    Header.prototype.setFirstDirectorySectorLocation = function (i) {
        this.dataView
            .subView(Header.FLAG_POSITION.FIRST_DIRECTORY_SECTOR, Header.FLAG_POSITION.FIRST_DIRECTORY_SECTOR + 4)
            .writeAt(0, Long.fromValue(i).to4BytesLE());
    };
    Header.prototype.setFirstMinifatSectorLocation = function (i) {
        this.dataView
            .subView(Header.FLAG_POSITION.FIRST_MINIFAT_SECTOR, Header.FLAG_POSITION.FIRST_MINIFAT_SECTOR + 4)
            .writeAt(0, Long.fromValue(i).to4BytesLE());
    };
    Header.prototype.setNumberOfMiniFatSectors = function (i) {
        this.dataView
            .subView(Header.FLAG_POSITION.NUMBER_OF_MINIFAT_SECTORS, Header.FLAG_POSITION.NUMBER_OF_MINIFAT_SECTORS + 4)
            .writeAt(0, Long.fromValue(i).to4BytesLE());
    };
    Header.prototype.setFirstDifatSectorLocation = function (i) {
        this.dataView
            .subView(Header.FLAG_POSITION.FIRST_DIFAT_SECTOR, Header.FLAG_POSITION.FIRST_DIFAT_SECTOR + 4)
            .writeAt(0, Long.fromValue(i).to4BytesLE());
    };
    Header.prototype.setNumberOfDifatSectors = function (i) {
        this.dataView
            .subView(Header.FLAG_POSITION.NUMBER_OF_DIFAT_SECTORS, Header.FLAG_POSITION.NUMBER_OF_DIFAT_SECTORS + 4)
            .writeAt(0, Long.fromValue(i).to4BytesLE());
    };
    Header.prototype.getSectorShift = function () {
        return Math.pow(2, Long.fromBytesLE(this.dataView
            .subView(Header.FLAG_POSITION.SECTOR_SHIFT, Header.FLAG_POSITION.SECTOR_SHIFT + 2)
            .getData()).toNumber());
    };
    Header.prototype.getMiniSectorShift = function () {
        return Math.pow(2, Long.fromBytesLE(this.dataView
            .subView(Header.FLAG_POSITION.MINI_SECTOR_SHIFT, Header.FLAG_POSITION.MINI_SECTOR_SHIFT + 2)
            .getData()).toNumber());
    };
    Header.prototype.getMiniStreamCutoffSize = function () {
        return Long.fromBytesLE(this.dataView
            .subView(Header.FLAG_POSITION.MINI_STREAM_CUTOFF_SIZE_POSITION, Header.FLAG_POSITION.MINI_STREAM_CUTOFF_SIZE_POSITION + 4)
            .getData()).toNumber();
    };
    Header.prototype.registerFatSector = function (sectorPosition) {
        this.difatEntries.registerFatSector(sectorPosition);
    };
    Header.FLAG_POSITION = {
        SIGNATURE: 0,
        CLSID: 8,
        MINOR_VERSION: 24,
        MAJOR_VERSION: 26,
        BYTE_ORDER: 28,
        SECTOR_SHIFT: 30,
        MINI_SECTOR_SHIFT: 32,
        MINI_STREAM_CUTOFF_SIZE_POSITION: 56,
        FIRST_DIRECTORY_SECTOR: 48,
        NUMBER_OF_FAT_SECTORS: 44,
        FIRST_MINIFAT_SECTOR: 60,
        NUMBER_OF_MINIFAT_SECTORS: 64,
        FIRST_DIFAT_SECTOR: 68,
        NUMBER_OF_DIFAT_SECTORS: 72,
        DIFAT_ENTRIES_FIRST_POSITION: 76,
    };
    Header.HEADER_SIGNATURE = [
        0xe1,
        0x1a,
        0xb1,
        0xa1,
        0xe0,
        0x11,
        0xcf,
        0xd0,
    ].reverse();
    Header.MAJOR_VERSION_3 = [0x03, 0x00];
    Header.MINOR_VERSION_3 = [0x3e, 0x00];
    Header.BYTE_ORDER_LITTLE_ENDIAN = [0xfe, 0xff];
    Header.SECTOR_SHIFT_VERSION_3 = [0x09, 0x00];
    Header.SECTOR_SHIFT_VERSION_3_INT = Math.pow(2, Long.fromBytesLE(Header.SECTOR_SHIFT_VERSION_3).toNumber());
    Header.MINI_SECTOR_SHIFT_VERSION_3 = [0x06, 0x00];
    Header.MINI_SECTOR_SHIFT_VERSION_3_INT = Math.pow(2, Long.fromBytesLE(Header.MINI_SECTOR_SHIFT_VERSION_3).toNumber());
    Header.MINI_STREAM_CUTOFF_SIZE_INT = 0x00001000;
    Header.MINI_STREAM_CUTOFF_SIZE = Long.fromValue(Header.MINI_STREAM_CUTOFF_SIZE_INT).to4BytesLE();
    Header.HEADER_LENGTH = 512;
    Header.DIFAT_ENTRIES_LIMIT_IN_HEADER = 109;
    return Header;
}());
exports.Header = Header;
//# sourceMappingURL=Header.js.map