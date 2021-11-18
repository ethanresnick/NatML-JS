/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { Sharp, default as sharp } from "sharp"
import { MLImageType } from "../types/MLImageType"
import { MLFeature } from "../MLFeature"
import { MLDataType } from "../MLTypes"
import { IMLHubFeature } from "../hub/IMLHubFeature"

/**
 * 
 */
export interface ImageFeatureOptions {
    width: number;
    height: number;
    channels: 1 | 2 | 3 | 4;
}

/**
 * 
 */
export class MLImageFeature extends MLFeature implements IMLHubFeature { // INCOMPLETE

    /**
     * 
     */
    public readonly image: Sharp;

    /**
     * Create an image feature.
     * @param input 
     */
    public constructor (input: Buffer | string);

    /**
     * Create an image feature.
     * @param input 
     * @param options 
     */
    public constructor (input: Uint8Array | Buffer | string, options?: ImageFeatureOptions) {
        let type: MLImageType;
        if (options)
            type = new MLImageType(MLDataType.Byte, [1, options.height, options.width, options.channels]);
        else
            type = new MLImageType(MLDataType.Image, null as any);
        super(type);
        this.image = sharp(input, options ? { raw: options } : undefined);
    }

    public async serialize () { // DEPLOY
        const encodedBuffer = await this.image.jpeg().toBuffer();
        const data = encodedBuffer.toString("base64");
        return { data, type: MLDataType.Image };
    }
}