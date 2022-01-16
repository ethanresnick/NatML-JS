/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */
import { MLFeature } from "../MLFeature";
import { MLDataType } from "../MLTypes";
import { IMLHubFeature, isHubFeature, MLHubFeature } from "../hub";
import { MLArrayType } from "../types";
import { match } from "../utils/fpHelpers";

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

type FeatureDataArrayCtor =
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | Int8ArrayConstructor
  | Int16ArrayConstructor
  | Int32ArrayConstructor
  | BigInt64ArrayConstructor
  | Uint8ArrayConstructor
  | Uint16ArrayConstructor
  | Uint32ArrayConstructor
  | BigUint64ArrayConstructor;

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
  public readonly data: Promise<T>;

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

  /**
   * Create an array feature.
   * @param hubFeature Hub feature to derive the new feature from.
   */
  public constructor(hubFeature: MLHubFeature);

  public constructor(
    dataOrHubFeature: T | MLHubFeature,
    typeOrShape?: number[] | MLArrayType
  ) {
    const [data, type] = isHubFeature(dataOrHubFeature)
      ? MLArrayFeature.initializationValues(dataOrHubFeature)
      : [
          Promise.resolve(dataOrHubFeature),
          typeOrShape instanceof MLArrayType
            ? typeOrShape
            : new MLArrayType(getMlDataType(dataOrHubFeature), typeOrShape),
        ];

    super(type);
    this.type = type;
    this.data = data as Promise<T>;
  }

  private static arrayTypes = [
    MLDataType.Float,
    MLDataType.Double,
    MLDataType.SByte,
    MLDataType.Short,
    MLDataType.Int,
    MLDataType.Long,
    MLDataType.Byte,
    MLDataType.UShort,
    MLDataType.UInt,
    MLDataType.ULong,
  ];

  private static initializationValues(feature: MLHubFeature) {
    if (this.arrayTypes.includes(feature.type))
      throw new Error("MLTextFeature: Invalid data type");

    const TypedArrayConstructor = getTypedArrayConstructor(feature.type);
    return [
      new Response(feature.data)
        .arrayBuffer()
        .then((buffer) => new TypedArrayConstructor(buffer)),
      new MLArrayType(feature.type, feature.shape),
    ] as const;
  }

  public async serialize(): Promise<MLHubFeature> {
    const shape = this.shape;
    if (!shape)
      throw new Error(
        `Array feature cannot be used for Hub prediction because it has no shape`
      );

    return {
      data: new Blob([await this.data]),
      type: this.type.type,
      shape,
    };
  }
}

/**
 * Takes a FeatureDataArray and returns a corresponding MLDataType.
 * Falls back to assuming the MLDataType is a float. Used to serialize.
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

// Inverse of the above. Used to deserialize.
const getTypedArrayConstructor = match<MLDataType, FeatureDataArrayCtor, true>(
  [MLDataType.Float, () => Float32Array],
  [MLDataType.Double, () => Float64Array],
  [MLDataType.SByte, () => Int8Array],
  [MLDataType.Short, () => Int16Array],
  [MLDataType.Int, () => Int32Array],
  [MLDataType.Long, () => BigInt64Array],
  [MLDataType.Byte, () => Uint8Array],
  [MLDataType.UShort, () => Uint16Array],
  [MLDataType.UInt, () => Uint32Array],
  [MLDataType.ULong, () => BigUint64Array],
  [match.any, () => Float32Array]
);
