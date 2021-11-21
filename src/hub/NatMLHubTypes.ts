/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLHubFeature } from "./MLHubFeature"
import { AspectMode, AudioFormat, Normalization } from "../MLTypes"

/**
 * Predictor type.
 */
export enum PredictorType {
    /**
     * Edge predictor.
     * Predictions are made on-device with model graphs delivered from Hub.
     */
    Edge = "EDGE",
    /**
     * Hub Predictor.
     * Predictions are made server-side.
     */
    Hub = "HUB"
}

/**
 * Prediction status.
 */
export enum PredictionStatus {
    /**
     * Waiting to execute.
     */
    Waiting = "WAITING",
    /**
     * Prediction is being executed.
     */
    Processing = "PROCESSING",
    /**
     * Prediction completed or errored.
     */
    Completed = "COMPLETED"
}

/**
 * Upload URL type.
 */
export enum UploadType {
    /**
     * Predictor model graph.
     */
    Model = "MODEL",
    /**
     * Predictor media.
     */
    Media = "MEDIA",
    /**
     * Feature data for Hub prediction.
     */
    Feature = "FEATURE"
}

export interface Device {
    os: string;
    model?: string;
    gfx?: string;
}

export interface Session {
    id: string;
    predictor: Predictor;
    graph?: string;
    flags?: number;
}

export interface Predictor {
    tag: string;
    type: PredictorType;
    aspectMode?: AspectMode;
    labels?: string[];
    normalization?: Normalization;
    audioFormat?: AudioFormat;
}

export interface Prediction {
    id: string;
    status: PredictionStatus;
    results?: MLHubFeature[];
    error?: string;
}