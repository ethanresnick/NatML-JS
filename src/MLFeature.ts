/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLFeatureType } from "./MLFeatureType";

/**
 * ML feature.
 */
export abstract class MLFeature {
  /**
   * Feature type.
   */
  public readonly type: MLFeatureType;

  protected constructor(type: MLFeatureType) {
    this.type = type;
  }
}
