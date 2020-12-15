import "./Long";
export declare const FREESECT_MARK_OR_NOSTREAM: number[];
export declare const FREESECT_MARK_OR_NOSTREAM_INT: number;
export declare const DISECT_MARK: number[];
export declare const DISECT_MARK_INT: number;
export declare const FATSECT_MARK: number[];
export declare const FATSECT_MARK_INT: number;
export declare const ENDOFCHAIN_MARK: number[];
export declare const ENDOFCHAIN_MARK_INT: number;
export declare const MAX_POSSIBLE_POSITION: number[];
export declare const DIFF_BETWEEN_EPOCHS_1970_1601 = 11644473599996;
/**
 * @internal
 * @param target
 * @param filler
 */
export declare function fill(target: number[], filler: number[]): void;
export declare function isFreeSectOrNoStream(value: number[] | number): boolean;
export declare function isEndOfChain(value: number[] | number): boolean;
export declare function equal(buf1: number[], buf2: number[]): boolean;
export declare function initializedWidth(size: number, value: number | number[]): number[];
export declare function toUTF16String(bytes: number[]): string;
export declare function toUTF16Bytes(str: string): number[];
export declare function addTrailingZeros(original: number[], maximumLength: number): number[];
export declare function toUTF16WithNoTrailingZeros(bytes: number[]): string;
export declare function removeTrailingZeros(bytes: number[]): number[];
