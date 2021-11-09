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
 * 
 */
export enum MLDataType { // DOC
    Float   = "FLOAT32",
    Double  = "FLOAT64",
    SByte   = "INT8",
    Short   = "INT16",
    Int     = "INT32",
    Long    = "INT64",
    Byte    = "UINT8",
    UShort  = "UINT16",
    UInt    = "UINT32",
    ULong   = "UINT64",
    Image   = "IMAGE",
    Audio   = "AUDIO",
    String  = "STRING",
}

/**
 * 
 */
export interface Normalization { // DOC
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
 * 
 */
export interface AudioFormat { // DOC
    /**
     * Sample rate.
     */
    sampleRate: number;
    /**
     * Channel count.
     */
    channelCount: number;
}