/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLDataType } from "../MLTypes";

/**
 *
 */
export interface MLHubFeature {
  /**
   * Feature type.
   */
  type: MLDataType;
  /**
   * The feature's data.
   */
  data: Blob | ReadableStream;
  /**
   * Feature shape.
   */
  shape?: number[];
}

export function isHubFeature(it: unknown): it is MLHubFeature {
  return typeof it === "object" && it !== null && "type" in it && "data" in it;
}
