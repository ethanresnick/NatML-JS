/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLFeature } from "./MLFeature"

/**
 * Lightweight primitive for making predictions asynchronously.
 * Async predictors can be used to make server-side ML predictions that require heavier processing.
 */
export interface IMLAsyncPredictor<TOutput> {

    /**
     * Make a prediction on one or more input features.
     * @param inputs Input features.
     * @returns Prediction output.
     */
    predict (...inputs: MLFeature[]): Promise<TOutput>;
}