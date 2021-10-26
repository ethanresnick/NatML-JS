/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLFeature } from "./MLFeature"

/**
 * Lightweight primitive for making predictions with a model.
 * Predictors transform raw model outputs to types that are easily usable by applications.
 */
export interface IMLPredictor<TOutput> {

    /**
     * Make a prediction on one or more input features.
     * @param inputs Input features.
     * @returns Prediction output.
     */
    predict (...inputs: MLFeature[]): TOutput;
}