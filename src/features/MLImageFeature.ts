/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */
import { MLFeature } from "../MLFeature";
import { MLDataType } from "../MLTypes";
import { IMLHubFeature, isHubFeature, MLHubFeature } from "../hub";
import { MLImageType } from "../types";

// TODO: We'll inject a platform-specific version of this object into
// MLImageFeature eventually, so that it works on node and the browser.
const deps = {
  getImageData(source: ImageDataSource): Promise<Uint8Array> {
    throw new Error("Not implemented.");
  },
  encodeRawImage(
    attributes: PixelBufferAttributes,
    data: Uint8Array
  ): Promise<{ data: Uint8Array; type: SupportedImageMediaType }> {
    throw new Error("Not implemented.");
  },
};

/**
 * Pixel buffer attributes for raw pixel buffers.
 */
export interface PixelBufferAttributes {
  width: number;
  height: number;
  channels: number;
}

export type SupportedImageMediaType = "image/png" | "image/jpeg";

export type BrowserImageDataSource =
  | HTMLCanvasElement
  | ImageData /* a raw RGBA px buffer + the image's width and height */
  | HTMLImageElement
  | SVGImageElement
  | File;

// Image data is always a Uint8Array. ImageDataSource represents any
// possible source of image data, including relevant browser objects holding
// image data, or a string, which is interpreted as a file system path.
export type ImageDataSource = BrowserImageDataSource | string;

/**
 * ML image feature.
 *
 * This feature will perform any necessary conversions and pre-processing to a
 * model's desired input feature type. Pixel buffers used to create image
 * features MUST have an RGBA8888 pixel layout.
 */
export class MLImageFeature extends MLFeature implements IMLHubFeature {
  public readonly type: MLImageType;

  /**
   * Backing image.
   * Marked as public to work around a TS limitation representing class types
   * in declaration export files, but should be treated as private.
   * @private
   */
  private readonly image: Promise<Uint8Array>;

  /**
   * Metadata about the image's size, to interpet the image buffer,
   * if the image is a raw buffer.
   *
   * Marked as public to work around a TS limitation representing class types
   * in declaration export files, but should be treated as private.
   * @private
   */
  private readonly attributes?: PixelBufferAttributes;

  /**
   * @param input An encoded image buffer.
   */
  public constructor(input: Uint8Array);

  /**
   * @param input A raw RGBA8888 pixel buffer
   * @param attributes Metadata about the image's shape, to interpret the buffer.
   */
  public constructor(input: Uint8Array, attributes: PixelBufferAttributes);

  /**
   * @param input A browser object containing the image data.
   * @remarks Browser only.
   */
  public constructor(input: BrowserImageDataSource);

  /**
   * @param input The path to an image file.
   * @remarks Node only.
   */
  public constructor(input: string);

  /**
   * @param input Existing hub feature from which to create this feature.
   */
  public constructor(input: MLHubFeature);

  /**
   * @param input A buffer of image data, or some source from which we can
   *   get such a buffer.
   * @param attributes Metadata to interpret the image data,
   *   if it's a raw pixel buffer.
   */
  public constructor(
    input: Uint8Array | ImageDataSource | MLHubFeature,
    attributes?: PixelBufferAttributes
  ) {
    const [image, type, computedAttributes] = isHubFeature(input)
      ? MLImageFeature.initializationValues(input)
      : [
          input instanceof Uint8Array
            ? Promise.resolve(input)
            : deps.getImageData(input),
          attributes
            ? new MLImageType(MLDataType.Byte, [
                1,
                attributes.height,
                attributes.width,
                attributes.channels,
              ])
            : new MLImageType(MLDataType.Image),
          attributes,
        ];

    super(type);
    this.type = type;
    this.attributes = computedAttributes;
    this.image = image;
  }

  public async serialize(): Promise<MLHubFeature> {
    // enocde the image data to a compressed format if we have a raw buffer.
    // if we were already given an encoded image, we don't know its media type,
    // so we just pass `application/octet-stream` to Hub; it'll figure it out.
    const { data, type } = await this.image.then((data) =>
      this.attributes
        ? deps.encodeRawImage(this.attributes, data)
        : { data, type: "application/octet-stream" }
    );

    return {
      data: new Blob([data], { type }),
      type: MLDataType.Image,
    };
  }

  private static initializationValues(feature: MLHubFeature) {
    const data = new Response(feature.data)
      .arrayBuffer()
      .then((it) => new Uint8Array(it));

    const type = feature.shape
      ? new MLImageType(MLDataType.Byte, feature.shape)
      : new MLImageType(MLDataType.Image);

    const attributes = feature.shape
      ? { width: type.width!, height: type.height!, channels: type.channels! }
      : undefined;

    return [data, type, attributes] as const;
  }
}
