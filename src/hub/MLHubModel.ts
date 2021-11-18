/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLModel } from "../MLModel"
import { MLFeature } from "../MLFeature"
import { MLDataType } from "../MLTypes"
import { MLHubFeature } from "./MLHubFeature"
import { NatMLHub } from "./NatMLHub"
import { MLArrayFeature, MLAudioFeature, MLImageFeature, MLTextFeature } from "../features"

/**
 * Server-side ML model capable of making predictions on features.
 */
export class MLHubModel extends MLModel { // INCOMPLETE

    //#region --Client API--
    /**
     * Make a server-side prediction on one or more input features.
     * @param inputs Input features.
     * @returns Output features.
     */
    public async predict (...features: MLHubFeature[]): Promise<MLFeature[]> {
        const prediction = await NatMLHub.requestPrediction({
            session: this.session,
            inputs: features,
            waitUntilCompleted: true
        });
        if (prediction.error)
            throw new Error(prediction.error);
        const results = prediction.results!.map(MLHubModel.deserialize);
        return results;
    }
    //#endregion

    
    //#region --Operations--
    
    constructor (session: string) {
        super(session);
    }

    private static deserialize (input: MLHubFeature): MLFeature {
        switch (input.type) {
            case MLDataType.Float:  return this.deserializeArray(input);
            case MLDataType.Double: return this.deserializeArray(input);
            case MLDataType.SByte:  return this.deserializeArray(input);
            case MLDataType.Short:  return this.deserializeArray(input);
            case MLDataType.Int:    return this.deserializeArray(input);
            case MLDataType.Long:   return this.deserializeArray(input);
            case MLDataType.Byte:   return this.deserializeArray(input);
            case MLDataType.UShort: return this.deserializeArray(input);
            case MLDataType.UInt:   return this.deserializeArray(input);
            case MLDataType.ULong:  return this.deserializeArray(input);
            case MLDataType.Image:  return this.deserializeImage(input);
            case MLDataType.Audio:  return this.deserializeAudio(input);
            case MLDataType.String: return this.deserializeText(input);
            default:                throw new Error(`Cannot deserialize invalid feature type: ${input.type}`);
        }
    }

    private static deserializeArray (input: MLHubFeature): MLArrayFeature { // INCOMPLETE
        throw new Error();
    }

    private static deserializeImage (input: MLHubFeature): MLImageFeature {
        const encodedImage = Buffer.from(input.data, "base64");
        return new MLImageFeature(encodedImage);
    }

    private static deserializeAudio (input: MLHubFeature): MLAudioFeature {
        throw new Error(`Deserializing audio features is not yet supported`);
    }

    private static deserializeText (input: MLHubFeature): MLTextFeature {
        return new MLTextFeature(input.data);
    }
    //#endregion
}