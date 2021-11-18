/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLDataType } from "../MLTypes"
import { MLArrayType } from "./MLArrayType"

/**
 * ML image feature type.
 */
export class MLImageType extends MLArrayType {

    /**
     * Image width.
     */
    public get width () {
        return this.shape[this.interleaved ? 2 : 3];
    }

    /**
     * Image height.
     */
    public get height () {
        return this.shape[this.interleaved ? 1 : 2];
    }

    /**
     * Image channels.
     */
    public get channels () {
        return this.shape[this.interleaved ? 3 : 1];
    }

    /**
     * Create an image feature type.
     * @param type Image data type.
     * @param shape Image feature shape.
     */
    public constructor (type: MLDataType, shape: number[]) {
        super(type, shape);
        this.interleaved = shape[1] > shape[3];
    }

    private readonly interleaved: boolean;
}