/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLFeatureType } from "./MLFeatureType";

/**
 * ML model.
 */
export abstract class MLModel {
  //#region --Client API--
  /**
   * Model input feature types.
   */
  public get inputs(): MLFeatureType[] {
    return this.inputTypes;
  }

  /**
   * Model output feature types.
   */
  public get outputs(): MLFeatureType[] {
    return this.outputTypes;
  }

  /**
   * Model metadata dictionary.
   */
  public get metadata(): { [key: string]: string } {
    return this.metadataDict;
  }

  /**
   * Dispose the model and release resources.
   */
  public dispose(): void {}
  //#endregion

  //#region --Operations--
  protected readonly session: string;
  protected inputTypes: MLFeatureType[] = [];
  protected outputTypes: MLFeatureType[] = [];
  protected metadataDict: { [key: string]: string } = {};

  protected constructor(session: string) {
    this.session = session;
  }
  //#endregion
}
