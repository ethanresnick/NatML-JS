/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLFeature } from "../MLFeature"
import { MLDataType } from "../MLFeatureType"

export class MLArrayFeature extends MLFeature {

    constructor (data: number[], shape: number[], dtype: MLDataType) {
        super();
    }
}