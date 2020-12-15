"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var long_1 = __importDefault(require("long"));
long_1.default.prototype.to4BytesLE = function () {
    return this.toBytesLE().slice(0, 4);
};
long_1.default.prototype.to4BytesBE = function () {
    return this.toBytesBE().slice(0, 4);
};
long_1.default.prototype.to2BytesLE = function () {
    return this.toBytesLE().slice(0, 2);
};
long_1.default.prototype.to2BytesBE = function () {
    return this.toBytesBE().slice(0, 2);
};
var fromBytesLEOriginal = long_1.default.fromBytesLE;
long_1.default.fromBytesLE = function (bytes, unsigned) {
    var bytesLength = bytes.length;
    if (bytesLength === 8) {
        return fromBytesLEOriginal(bytes, unsigned);
    }
    else if (bytesLength === 4) {
        return new long_1.default(bytes[0] |
            bytes[1] << 8 |
            bytes[2] << 16 |
            bytes[3] << 24, 0, unsigned);
    }
    else if (bytesLength === 2) {
        return new long_1.default(bytes[0] |
            bytes[1] << 8, 0, unsigned);
    }
    else {
        throw new Error("Unsupported bytes length: " + bytesLength);
    }
};
//# sourceMappingURL=Long.js.map