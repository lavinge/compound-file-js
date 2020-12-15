"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var DirectoryEntry_1 = require("./DirectoryEntry");
var StreamDirectoryEntry_1 = require("./StreamDirectoryEntry");
var StorageDirectoryEntry_1 = require("./StorageDirectoryEntry");
var RootStorageDirectoryEntry_1 = require("./RootStorageDirectoryEntry");
var DirectoryEntryChain = /** @class */ (function () {
    function DirectoryEntryChain(sectors, fat, header, streamHolder) {
        this.directoryEntryCount = 0;
        this.sectors = sectors;
        this.fat = fat;
        this.header = header;
        this.sectorChain = fat.buildChain(header.getFirstDirectorySectorLocation());
        this.streamHolder = streamHolder;
        this.readDirectoryEntryCount();
    }
    DirectoryEntryChain.prototype.readDirectoryEntryCount = function () {
        if (this.sectorChain.length !== 0) {
            var maxDirectoryEntryPosition = -1;
            for (var _i = 0, _a = this.sectorChain; _i < _a.length; _i++) {
                var sectorPosition = _a[_i];
                var sector = this.sectors.sector(sectorPosition);
                for (var i = 0; i < 4; i++) {
                    var directoryEntryView = sector.subView(i * 128, (i + 1) * 128);
                    var leftSiblingPosition = DirectoryEntry_1.DirectoryEntry.getLeftSiblingPosition(directoryEntryView);
                    var rightSiblingPosition = DirectoryEntry_1.DirectoryEntry.getRightSiblingPosition(directoryEntryView);
                    var childPosition = DirectoryEntry_1.DirectoryEntry.getChildPosition(directoryEntryView);
                    if (!utils_1.isFreeSectOrNoStream(leftSiblingPosition)) {
                        maxDirectoryEntryPosition = Math.max(maxDirectoryEntryPosition, leftSiblingPosition);
                    }
                    if (!utils_1.isFreeSectOrNoStream(rightSiblingPosition)) {
                        maxDirectoryEntryPosition = Math.max(maxDirectoryEntryPosition, rightSiblingPosition);
                    }
                    if (!utils_1.isFreeSectOrNoStream(childPosition)) {
                        maxDirectoryEntryPosition = Math.max(maxDirectoryEntryPosition, childPosition);
                    }
                }
            }
            this.directoryEntryCount = maxDirectoryEntryPosition + 1;
        }
    };
    DirectoryEntryChain.prototype.getRootStorage = function () {
        return this.getEntryById(0);
    };
    DirectoryEntryChain.prototype.getEntryById = function (i) {
        if (i < 0 || i > this.directoryEntryCount - 1) {
            throw new Error("No such element " + i);
        }
        var sectorNumber = Math.floor(i / 4);
        var shiftInsideSector = i % 4 * 128;
        var view = this.sectors.sector(this.sectorChain[sectorNumber]).subView(shiftInsideSector, shiftInsideSector + 128);
        var objectType = view.subView(DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.OBJECT_TYPE, DirectoryEntry_1.DirectoryEntry.FLAG_POSITION.OBJECT_TYPE + 1).getData()[0];
        if (objectType === DirectoryEntry_1.ObjectType.RootStorage) {
            return new RootStorageDirectoryEntry_1.RootStorageDirectoryEntry(i, this, view);
        }
        else if (objectType === DirectoryEntry_1.ObjectType.Storage) {
            return new StorageDirectoryEntry_1.StorageDirectoryEntry(i, this, view);
        }
        else {
            return new StreamDirectoryEntry_1.StreamDirectoryEntry(i, this, this.streamHolder, view);
        }
    };
    DirectoryEntryChain.prototype.createRootStorage = function () {
        if (this.directoryEntryCount !== 0) {
            throw new Error("Root Storage should be the first Directory Entry");
        }
        var view = this.getViewForDirectoryEntry();
        return new RootStorageDirectoryEntry_1.RootStorageDirectoryEntry(0, this, view, RootStorageDirectoryEntry_1.RootStorageDirectoryEntry.NAME, DirectoryEntry_1.ColorFlag.BLACK, DirectoryEntry_1.ObjectType.RootStorage);
    };
    DirectoryEntryChain.prototype.createStorage = function (name, colorFlag) {
        return new StorageDirectoryEntry_1.StorageDirectoryEntry(this.directoryEntryCount, this, this.getViewForDirectoryEntry(), name, colorFlag);
    };
    DirectoryEntryChain.prototype.createStream = function (name, colorFlag, data) {
        var streamEntry = new StreamDirectoryEntry_1.StreamDirectoryEntry(this.directoryEntryCount, this, this.streamHolder, this.getViewForDirectoryEntry(), name, colorFlag);
        if (data.length > 0) {
            streamEntry.setStreamData(data);
        }
        return streamEntry;
    };
    DirectoryEntryChain.prototype.getViewForDirectoryEntry = function () {
        var directoriesRegisteredInCurrentSector = this.directoryEntryCount % 4;
        try {
            if (directoriesRegisteredInCurrentSector === 0) {
                var directoryEntrySector = this.sectors.allocate();
                if (this.sectorChain.length === 0) {
                    this.header.setFirstDirectorySectorLocation(directoryEntrySector.getPosition());
                    this.fat.registerSector(directoryEntrySector.getPosition(), null);
                }
                else {
                    this.fat.registerSector(directoryEntrySector.getPosition(), this.sectorChain[this.sectorChain.length - 1]);
                }
                this.sectorChain.push(directoryEntrySector.getPosition());
                return directoryEntrySector.subView(0, 128);
            }
            else {
                return this.sectors.sector(this.sectorChain[this.sectorChain.length - 1])
                    .subView(directoriesRegisteredInCurrentSector * DirectoryEntry_1.DirectoryEntry.ENTRY_LENGTH, (directoriesRegisteredInCurrentSector + 1) * DirectoryEntry_1.DirectoryEntry.ENTRY_LENGTH);
            }
        }
        finally {
            this.directoryEntryCount++;
        }
    };
    DirectoryEntryChain.UTF16_TERMINATING_BYTES = [0, 0];
    return DirectoryEntryChain;
}());
exports.DirectoryEntryChain = DirectoryEntryChain;
//# sourceMappingURL=DirectoryEntryChain.js.map