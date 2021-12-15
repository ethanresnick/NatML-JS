/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLDataType } from "../MLTypes";
import { MLFeatureType } from "../MLFeatureType";

/**
 * ML array feature type.
 */
export class MLArrayType extends MLFeatureType {
  /**
   * Array shape.
   */
  public readonly shape: number[] | undefined;

  /**
   * Array dimensions.
   */
  public get dims() {
    return this.shape?.length ?? 0;
  }

  /**
   * Array element count.
   */
  public get elementCount() {
    return this.shape?.reduce((a, b) => a * b, 1) ?? 0;
  }

  /**
   * Create an array feature type.
   * @param type Array element data type.
   * @param shape Array feature shape.
   */
  public constructor(type: MLDataType, shape?: number[]) {
    super(undefined, type);
    this.shape = shape;
  }
}
