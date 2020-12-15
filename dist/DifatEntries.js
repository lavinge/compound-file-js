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
var utils_1 = require("./utils");
var Long = __importStar(require("long"));
var DifatEntries = /** @class */ (function () {
    function DifatEntries(dataView) {
        this.difatEntries = [];
        this.view = dataView;
        for (var i = 0; i < this.view.getSize(); i += 4) {
            var entry = this.view.subView(i, i + 4).getData();
            if (utils_1.isFreeSectOrNoStream(entry)) {
                break;
            }
            this.difatEntries.push(Long.fromBytesLE(entry).toNumber());
        }
    }
    DifatEntries.prototype.getDifatEntries = function () {
        return this.difatEntries;
    };
    DifatEntries.prototype.registerFatSector = function (sectorPosition) {
        if (this.difatEntries.length >= Header_1.Header.DIFAT_ENTRIES_LIMIT_IN_HEADER) {
            throw new Error("Unable to register additional FAT sector in Header");
        }
        this.view.writeAt(this.difatEntries.length * 4, Long.fromValue(sectorPosition).to4BytesLE());
        this.difatEntries.push(sectorPosition);
    };
    DifatEntries.prototype.isFull = function () {
        return this.difatEntries.length >= Header_1.Header.DIFAT_ENTRIES_LIMIT_IN_HEADER;
    };
    return DifatEntries;
}());
exports.DifatEntries = DifatEntries;
//# sourceMappingURL=DifatEntries.js.map