/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLDataType } from "../MLTypes";

/**
 *
 */
export interface MLHubFeature {
  // DOC
  /**
   * Feature type.
   */
  type: MLDataType;
  /**
   * Feature data.
   * This is either base64-encoded feature data or a URL to such data.
   */
  data: string;
  /**
   * Feature shape.
   * This should only be populated for array features.
   */
  shape?: number[];
}
