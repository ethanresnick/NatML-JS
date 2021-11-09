/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLDataType } from "./MLTypes"

/**
 * ML feature type.
 */
export abstract class MLFeatureType {

    //#region --Client API--
    /**
     * Feature name.
     */
    public readonly name: string;

    /**
     * Feature data type.
     * This will typically be a numeric type.
     */
    public readonly type: MLDataType;
    //#endregion


    //#region --Operations--

    protected constructor (name: string, type: MLDataType) {
        this.name = name;
        this.type = type;
    }
    //#endregion
}