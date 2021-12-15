/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import sharp = require("sharp");
import { Sharp } from "sharp";
import { MLFeature } from "../MLFeature";
import { MLDataType } from "../MLTypes";
import { IMLHubFeature, MLHubFeature } from "../hub";
import { MLImageType } from "../types";

/**
 * Pixel buffer attributes for raw pixel buffers.
 */
export interface PixelBufferAttributes {
  width: number;
  height: number;
  channels: 4;
}

/**
 * ML image feature.
 * This feature will perform any necessary conversions and pre-processing to a model's desired input feature type.
 * Pixel buffers used to create image features MUST have an RGBA8888 pixel layout.
 */
export class MLImageFeature extends MLFeature implements IMLHubFeature {
  //#region --Client API--
  /**
   * Backing image.
   */
  public readonly image: Sharp;

  /**
   * Create an image feature.
   * @param input Encoded image buffer or image path or RGBA8888 pixel buffer.
   * @param attributes Pixel buffer attributes.
   */
  public constructor(
    input: Buffer | string | Uint8Array,
    attributes?: PixelBufferAttributes
  ) {
    let type: MLImageType;
    if (attributes)
      type = new MLImageType(MLDataType.Byte, [
        1,
        attributes.height,
        attributes.width,
        attributes.channels,
      ]);
    else type = new MLImageType(MLDataType.Image, null as any);
    super(type);
    this.image = sharp(input, attributes ? { raw: attributes } : undefined);
  }
  //#endregion

  //#region --Operations--

  public async serialize(): Promise<MLHubFeature> {
    const encodedBuffer = await this.image.jpeg().toBuffer();
    const data = encodedBuffer.toString("base64");
    return { data, type: MLDataType.Image };
  }
  //#endregion
}
