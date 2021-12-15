/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLHubFeature } from "./MLHubFeature";

/**
 * ML feature which can create prediction-ready NatML Hub features.
 */
export interface IMLHubFeature {
  /**
   * Serialize the Hub feature for prediction with NatML Hub.
   * @returns Prediction-ready NatML Hub feature.
   */
  serialize(): MLHubFeature | Promise<MLHubFeature>;
}
