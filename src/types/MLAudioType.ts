/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLDataType } from "../MLTypes";
import { MLArrayType } from "./MLArrayType";

/**
 * ML audio feature type.
 * Audio types always represent floating-point linear PCM data.
 */
export class MLAudioType extends MLArrayType {
  /**
   * Audio sample rate.
   */
  public readonly sampleRate: number;

  /**
   * Audio channel count.
   */
  public get channelCount() {
    return this.shape?.[2] ?? 0;
  }

  /**
   * Create an audio feature type.
   * @param sampleRate Sample rate.
   * @param channelCount Channel count.
   * @param sampleCount Total sample count.
   */
  public constructor(
    sampleRate: number,
    channelCount: number,
    sampleCount: number
  ) {
    super(MLDataType.Float, [1, sampleCount / channelCount, channelCount]);
    this.sampleRate = sampleRate;
  }
}
