declare module "long" {
    interface Long {
        to4BytesLE(): number[];
        to4BytesBE(): number[];
        to2BytesLE(): number[];
        to2BytesBE(): number[];
    }
}
export {};
