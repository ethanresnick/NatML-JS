/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLFeature } from "../MLFeature"
import { MLFeatureType } from "../MLFeatureType"
import { MLDataType } from "../MLTypes"
import { IMLHubFeature, MLHubFeature } from "../hub"
import { MLArrayType } from "../types"

export type UnmanagedArray = 
    Float32Array | Float64Array |
    Int8Array | Int16Array | Int32Array | BigInt64Array |
    Uint8Array | Uint16Array | Uint32Array | BigUint64Array;

/**
 * ML array feature.
 */
export class MLArrayFeature<T extends UnmanagedArray> extends MLFeature implements IMLHubFeature {

    //#region --Client API--
    /**
     * Feature data.
     */
    public readonly data: T;

    /**
     * Feature shape.
     */
    public get shape () {
        return (this.type as MLArrayType).shape;
    }

    /**
     * Feature element count.
     */
    public get elementCount () {
        return (this.type as MLArrayType).elementCount;
    }

    /**
     * Create an array feature.
     * @param data Feature data.
     * @param shape Feature shape.
     */
    public constructor (data: T, shape?: number[]);

    /**
     * Create an array feature.
     * @param data Feature data.
     * @param type Feature type.
     */
    public constructor (data: T, type: MLFeatureType);
    //#endregion


    //#region --Operations--

    public constructor (data: T, typeOrShape: number[] | MLFeatureType | undefined) {
        let dtype = MLDataType.Float;
        let shape = typeOrShape instanceof Array ? typeOrShape : undefined;
        switch (data.constructor) {
            case Float32Array:      dtype = MLDataType.Float;   break;
            case Float64Array:      dtype = MLDataType.Double;  break;
            case Int8Array:         dtype = MLDataType.SByte;   break;
            case Int16Array:        dtype = MLDataType.Short;   break;
            case Int32Array:        dtype = MLDataType.Int;     break;
            case BigInt64Array:     dtype = MLDataType.Long;    break;
            case Uint8Array:        dtype = MLDataType.Byte;    break;
            case Uint16Array:       dtype = MLDataType.UShort;  break;
            case Uint32Array:       dtype = MLDataType.UInt;    break;
            case BigUint64Array:    dtype = MLDataType.ULong;   break;
        }
        const type = typeOrShape instanceof MLFeatureType ? typeOrShape : new MLArrayType(dtype, shape);
        super(type);
        this.data = data;
    }

    public serialize (): MLHubFeature { // Most hardware uses little endian
        // Check
        const shape = this.shape;
        if (!shape)
            throw new Error(`Array feature cannot be used for Hub prediction because it has no shape`);
        // Create
        const data = Buffer.from(this.data.buffer).toString("base64");
        const type = this.type.type;
        return { data, type, shape };
    }
    //#endregion
}