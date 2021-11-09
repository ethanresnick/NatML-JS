/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLModel } from "../MLModel"
import { MLFeature } from "../MLFeature"
import { MLHubFeature } from "./MLHubFeature"

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
        return null as unknown as MLFeature[];
    }
    //#endregion

    
    //#region --Operations--
    
    constructor (session: string) {
        super(session);
    }
    //#endregion
}