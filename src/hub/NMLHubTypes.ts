/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

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