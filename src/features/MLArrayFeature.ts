/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLFeature } from "../MLFeature";
import { MLDataType } from "../MLTypes";
import { IMLHubFeature, MLHubFeature } from "../hub";
import { MLArrayType } from "../types";
import { match } from "../utils/fpHelpers";
import { encode } from "uint8-to-b64";

export type FeatureDataArray =
  | Float32Array
  | Float64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | BigInt64Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | BigUint64Array;

/**
 * ML array feature.
 */
export class MLArrayFeature<T extends FeatureDataArray>
  extends MLFeature
  implements IMLHubFeature
{
  public readonly type: MLArrayType;

  /**
   * Feature data.
   */
  public readonly data: T;

  /**
   * Feature shape.
   */
  public get shape() {
    return this.type.shape;
  }

  /**
   * Feature element count.
   */
  public get elementCount() {
    return this.type.elementCount;
  }

  /**
   * Create an array feature.
   * @param data Feature data.
   * @param shape Feature shape.
   */
  public constructor(data: T, shape?: number[]);

  /**
   * Create an array feature.
   * @param data Feature data.
   * @param type Feature type.
   */
  public constructor(data: T, type: MLArrayType);

  public constructor(data: T, typeOrShape?: number[] | MLArrayType) {
    const type =
      typeOrShape instanceof MLArrayType
        ? typeOrShape
        : new MLArrayType(getMlDataType(data), typeOrShape);

    super(type);
    this.type = type;
    this.data = data;
  }

  public serialize(): MLHubFeature {
    // Most hardware uses little endian
    // Check
    const shape = this.shape;
    if (!shape)
      throw new Error(
        `Array feature cannot be used for Hub prediction because it has no shape`
      );

    const b64Data = encode(new Uint8Array(this.data.buffer));

    return {
      data: `data:application/octet-stream;base64,${b64Data}`,
      type: this.type.type,
      shape,
    };
  }
}

/**
 * Takes a FeatureDataArray and returns a corresponding MLDataType.
 * Falls back to assuming the MLDataType is a float.
 */
const getMlDataType = match<FeatureDataArray, MLDataType, true>(
  [Float32Array, () => MLDataType.Float],
  [Float64Array, () => MLDataType.Double],
  [Int8Array, () => MLDataType.SByte],
  [Int16Array, () => MLDataType.Short],
  [Int32Array, () => MLDataType.Int],
  [BigInt64Array, () => MLDataType.Long],
  [Uint8Array, () => MLDataType.Byte],
  [Uint16Array, () => MLDataType.UShort],
  [Uint32Array, () => MLDataType.UInt],
  [BigUint64Array, () => MLDataType.ULong],
  [match.any, () => MLDataType.Float]
);
