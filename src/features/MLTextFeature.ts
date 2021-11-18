/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/
import { MLDataType } from "../MLTypes"
import { MLFeature } from "../MLFeature"
import { IMLHubFeature } from "../hub/IMLHubFeature"
import { MLTextType } from "../types/MLTextType"

/**
 * ML text feature.
 * This feature will mainly be used with natural language processing models.
 */
export class MLTextFeature extends MLFeature implements IMLHubFeature {

    //#region --Client API--
    /**
     * Feature text.
     */
    public readonly text: string;

    /**
     * Create the text feature.
     * @param text Text.
     */
    public constructor (text: string) {
        super(new MLTextType(text.length));
        this.text = text;
    }
    //#endregion


    //#region --Operations--

    public serialize () {
        return { data: this.text, type: MLDataType.String };
    }
    //#endregion
}