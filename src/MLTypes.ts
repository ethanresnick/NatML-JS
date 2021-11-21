/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

/**
 * Image aspect mode for scaling image features for prediction.
 */
export enum AspectMode {
    /**
     * Image will be scaled to fit the required size.
     * This scale mode DOES NOT preserve the aspect ratio of the image.
     */
    ScaleToFit = "SCALE_TO_FIT",
    /**
     * Image will be aspect-filled to the required size.
     */
    AspectFill = "ASPECT_FILL",
    /**
     * Image will be aspect-fit (letterboxed) to the required size.
     */
    AspectFit = "ASPECT_FIT"
}

/**
 * Feature data type.
 */
 export enum MLDataType {
    /**
     * Single precision floating point number.
     */
    Float = "FLOAT32",
    /**
     * Double precision floating point number.
     */
    Double = "FLOAT64",
    /**
     * Signed 8-bit integer.
     */
    SByte = "INT8",
    /**
     * Signed 16-bit integer.
     */
    Short = "INT16",
    /**
     * Signed 32-bit integer.
     */
    Int = "INT32",
    /**
     * Signed 64-bit integer.
     */
    Long = "INT64",
    /**
     * Unsigned 8-bit integer.
     */
    Byte = "UINT8",
    /**
     * Unsigned 16-bit integer.
     */
    UShort = "UINT16",
    /**
     * Unsigned 32-bit integer.
     */
    UInt = "UINT32",
    /**
     * Unsigned 64-bit integer.
     */
    ULong = "UINT64",
    /**
     * Encoded image.
     */
    Image = "IMAGE",
    /**
     * Encoded audio.
     */
    Audio = "AUDIO",
    /**
     * Plain text.
     */
    String = "STRING"
}

/**
 * Feature normalization constants.
 */
export interface Normalization {
    /**
     * Per-channel normalization means.
     */
    mean: number[];
    /**
     * Per-channel normalization standard deviations.
     */
    std: number[];
}

/**
 * Audio format description for models that work on audio data.
 */
export interface AudioFormat {
    /**
     * Sample rate.
     */
    sampleRate: number;
    /**
     * Channel count.
     */
    channelCount: number;
}