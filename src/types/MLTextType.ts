/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLFeatureType } from "../MLFeatureType";
import { MLDataType } from "../MLTypes";

/**
 * ML text feature type.
 */
export class MLTextType extends MLFeatureType {
  /**
   * Text length.
   */
  public readonly length: number;

  /**
   * Create a text feature type.
   * @param length Text length.
   */
  public constructor(length: number) {
    super(undefined, MLDataType.String);
    this.length = length;
  }
}
