/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

/**
 * ML feature type.
 */
export abstract class MLFeatureType {

    //#region --Client API--
    /**
     * Feature name.
     */
    public readonly name: string;

    /**
     * Feature data type.
     * This will typically be a numeric type.
     */
    public readonly type: MLDataType;
    //#endregion


    //#region --Operations--

    protected constructor (name: string, type: MLDataType) {
        this.name = name;
        this.type = type;
    }
    //#endregion
}

export enum MLDataType {
    Float = "FLOAT32",
    Double = "FLOAT64",
    SByte = "INT8",
    Short = "INT16",
    Int = "INT32",
    Long = "INT64",
    Byte = "UINT8",
    UShort = "UINT16",
    UInt = "UINT32",
    ULong = "UINT64"
}