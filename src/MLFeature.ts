/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLFeatureType } from "./MLFeatureType";

/**
 * ML feature.
 */
export abstract class MLFeature {
  //#region --Client API--
  /**
   * Feature type.
   */
  public readonly type: MLFeatureType;
  //#endregion

  //#region --Operations--

  protected constructor(type: MLFeatureType) {
    this.type = type;
  }
  //#endregion
}
