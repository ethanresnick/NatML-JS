/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLDataType } from "./MLTypes";

/**
 * ML feature type.
 */
export abstract class MLFeatureType {
  //#region --Client API--
  /**
   * Feature name.
   */
  public readonly name: string | undefined;

  /**
   * Feature data type.
   */
  public readonly type: MLDataType;
  //#endregion

  //#region --Operations--

  protected constructor(name: string | undefined, type: MLDataType) {
    this.name = name;
    this.type = type;
  }
  //#endregion
}
