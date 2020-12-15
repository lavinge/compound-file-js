"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Long = __importStar(require("long"));
require("./Long");
var utf16_char_codes_1 = require("utf16-char-codes");
exports.FREESECT_MARK_OR_NOSTREAM = [0xff, 0xff, 0xff, 0xff];
exports.FREESECT_MARK_OR_NOSTREAM_INT = Long.fromBytesLE(exports.FREESECT_MARK_OR_NOSTREAM).toNumber();
exports.DISECT_MARK = [0xfc, 0xff, 0xff, 0xff];
exports.DISECT_MARK_INT = Long.fromBytesLE(exports.DISECT_MARK).toNumber();
exports.FATSECT_MARK = [0xfd, 0xff, 0xff, 0xff];
exports.FATSECT_MARK_INT = Long.fromBytesLE(exports.FATSECT_MARK).toNumber();
exports.ENDOFCHAIN_MARK = [0xfe, 0xff, 0xff, 0xff];
exports.ENDOFCHAIN_MARK_INT = Long.fromBytesLE(exports.ENDOFCHAIN_MARK).toNumber();
exports.MAX_POSSIBLE_POSITION = [0xfa, 0xff, 0xff, 0xff];
exports.DIFF_BETWEEN_EPOCHS_1970_1601 = 11644473599996;
/**
 * @internal
 * @param target
 * @param filler
 */
function fill(target, filler) {
    if (target.length % filler.length !== 0)
        throw new Error();
    var step = filler.length;
    for (var i = 0; i < target.length; i += step) {
        target.splice.apply(target, __spreadArrays([i, 4], filler));
    }
}
exports.fill = fill;
function isFreeSectOrNoStream(value) {
    if (value instanceof Array) {
        return equal(exports.FREESECT_MARK_OR_NOSTREAM, value);
    }
    else {
        return value === exports.FREESECT_MARK_OR_NOSTREAM_INT;
    }
}
exports.isFreeSectOrNoStream = isFreeSectOrNoStream;
function isEndOfChain(value) {
    if (value instanceof Array) {
        return equal(exports.ENDOFCHAIN_MARK, value);
    }
    else {
        return value === exports.ENDOFCHAIN_MARK_INT;
    }
}
exports.isEndOfChain = isEndOfChain;
function equal(buf1, buf2) {
    if (buf1.length !== buf2.length)
        return false;
    for (var i = 0; i !== buf1.length; i++) {
        if (buf1[i] !== buf2[i])
            return false;
    }
    return true;
}
exports.equal = equal;
function initializedWidth(size, value) {
    var data = new Array(size);
    if (value instanceof Array) {
        for (var i = 0; i < size; i += value.length) {
            data.splice.apply(data, __spreadArrays([i, value.length], value));
        }
    }
    else {
        data.fill(value);
    }
    return data;
}
exports.initializedWidth = initializedWidth;
function toUTF16String(bytes) {
    var result = [];
    for (var i = 0; i < bytes.length; i += 2) {
        result.push(utf16_char_codes_1.fromCodePoint(Long.fromBytesLE([bytes[i], bytes[i + 1]]).toNumber()));
    }
    return result.join("");
}
exports.toUTF16String = toUTF16String;
function toUTF16Bytes(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        var charBytes = Long.fromValue(utf16_char_codes_1.codePointAt(str, i)).to2BytesLE();
        if (charBytes.length !== 2) {
            throw new Error("Each character in UTF-16 encoding should be presented with 2 bytes");
        }
        bytes.push.apply(bytes, charBytes);
    }
    return bytes;
}
exports.toUTF16Bytes = toUTF16Bytes;
function addTrailingZeros(original, maximumLength) {
    var result = original.slice(0, original.length);
    for (var i = original.length; i < maximumLength; i++) {
        result[i] = 0;
    }
    return result;
}
exports.addTrailingZeros = addTrailingZeros;
function toUTF16WithNoTrailingZeros(bytes) {
    return toUTF16String(removeTrailingZeros(bytes));
}
exports.toUTF16WithNoTrailingZeros = toUTF16WithNoTrailingZeros;
function removeTrailingZeros(bytes) {
    var resultingLength = bytes.length;
    for (var i = bytes.length - 1; i > 0; i -= 2) {
        if (bytes[i] === 0 && bytes[i - 1] === 0) {
            resultingLength = i - 1;
        }
        else {
            break;
        }
    }
    return bytes.slice(0, resultingLength);
}
exports.removeTrailingZeros = removeTrailingZeros;
//# sourceMappingURL=utils.js.map