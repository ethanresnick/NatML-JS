/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLModel } from ".";
import { AspectMode, AudioFormat, Normalization } from "./MLTypes"

/**
 * Self-contained archive with ML model and supplemental data needed to make predictions.
 */
export class MLModelData {
    
    //#region --Client API--
    /**
     * NatML Hub predictor tag.
     */
    public get tag (): string { // INCOMPLETE
        return "";
    }

    /**
     * NatML Hub access key.
     */
    public get accessKey (): string { // INCOMPLETE
        return "";
    }

    /**
     * Predictor classification labels.
     * This is `null` if the predictor does not have use classification labels.
     */
    public get labels (): string[] | null { // INCOMPLETE
        return null;
    }

    /**
     * Expected feature normalization for predictions with this model.
     * This is `null` if the predictor does not use normalization.
     */
    public get normalization (): Normalization | null { // INCOMPLETE
        return null;
    }

    /**
     * Expected image aspect mode for predictions with this model.
     * This is `null` for predictors that do not work with images.
     */
    public get aspectMode (): AspectMode | null { // INCOMPLETE
        return null;
    }

    /**
     * Expected audio format for predictions with this model.
     * This is `null` for predictors that do not work with audio.
     */
    public get audioFormat (): AudioFormat | null { // INCOMPLETE
        return null;
    }

    /**
     * Deserialize the model data to create an ML model that can be used for prediction.
     * You MUST dispose the model once you are done with it.
     * @returns ML model.
     */
    public deserialize (): MLModel { // INCOMPLETE
        return undefined as unknown as MLModel;
    }

    /**
     * Fetch ML model data from NatML Hub.
     * @param tag Predictor tag.
     * @param accessKey Hub access key.
     * @returns ML model data.
     */
    public static async fromHub (tag: string, accessKey?: string): Promise<MLModelData> { // INCOMPLETE
        return null as unknown as MLModelData;
    }
    //#endregion


    //#region --Operations--
    private readonly session: string;

    private constructor (session: string) {
        this.session = session;
    }
    //#endregion
}