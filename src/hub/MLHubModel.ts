/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLModel } from "../MLModel"
import { MLFeature } from "../MLFeature"
import { MLDataType } from "../MLTypes"
import { MLHubFeature } from "./MLHubFeature"
import { NatMLHub } from "./NatMLHub"
import { MLArrayFeature, MLAudioFeature, MLImageFeature, MLTextFeature, UnmanagedArray } from "../features"

/**
 * Server-side ML model capable of making predictions on features.
 */
export class MLHubModel extends MLModel {

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
            case MLDataType.Float:  return MLHubModel.deserializeArray(input);
            case MLDataType.Double: return MLHubModel.deserializeArray(input);
            case MLDataType.SByte:  return MLHubModel.deserializeArray(input);
            case MLDataType.Short:  return MLHubModel.deserializeArray(input);
            case MLDataType.Int:    return MLHubModel.deserializeArray(input);
            case MLDataType.Long:   return MLHubModel.deserializeArray(input);
            case MLDataType.Byte:   return MLHubModel.deserializeArray(input);
            case MLDataType.UShort: return MLHubModel.deserializeArray(input);
            case MLDataType.UInt:   return MLHubModel.deserializeArray(input);
            case MLDataType.ULong:  return MLHubModel.deserializeArray(input);
            case MLDataType.Image:  return MLHubModel.deserializeImage(input);
            case MLDataType.Audio:  return MLHubModel.deserializeAudio(input);
            case MLDataType.String: return MLHubModel.deserializeText(input);
            default:                throw new Error(`Cannot deserialize invalid feature type: ${input.type}`);
        }
    }

    private static deserializeArray<T extends UnmanagedArray> (input: MLHubFeature): MLArrayFeature<T> { // This feels awfully sloppy
        const rawData = Buffer.from(input.data, "base64");
        const shape = input.shape!.length === 0 ? [1] : input.shape!;
        const buffer = rawData.buffer;
        const offset = rawData.byteOffset;
        const length = rawData.byteLength;
        let typedArray: T;
        switch (input.type) {
            case MLDataType.Float:  typedArray = new Float32Array(buffer, offset, length / Float32Array.BYTES_PER_ELEMENT) as any; break;
            case MLDataType.Double: typedArray = new Float64Array(buffer, offset, length / Float64Array.BYTES_PER_ELEMENT) as any; break;
            case MLDataType.SByte:  typedArray = new Int8Array(buffer, offset, length / Int8Array.BYTES_PER_ELEMENT) as any; break;
            case MLDataType.Short:  typedArray = new Int16Array(buffer, offset, length / Int16Array.BYTES_PER_ELEMENT) as any; break;
            case MLDataType.Int:    typedArray = new Int32Array(buffer, offset, length / Int32Array.BYTES_PER_ELEMENT) as any; break;
            case MLDataType.Long:   typedArray = new BigInt64Array(buffer, offset, length / BigInt64Array.BYTES_PER_ELEMENT) as any; break;
            case MLDataType.Byte:   typedArray = new Uint8Array(buffer, offset, length / Uint8Array.BYTES_PER_ELEMENT) as any; break;
            case MLDataType.UShort: typedArray = new Uint16Array(buffer, offset, length / Uint16Array.BYTES_PER_ELEMENT) as any; break;
            case MLDataType.UInt:   typedArray = new Uint32Array(buffer, offset, length / Uint32Array.BYTES_PER_ELEMENT) as any; break;
            case MLDataType.ULong:  typedArray = new BigUint64Array(buffer, offset, length / BigUint64Array.BYTES_PER_ELEMENT) as any; break;
            default:                throw new Error();
        }
        return new MLArrayFeature(typedArray, shape);
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