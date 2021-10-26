/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { MLFeature } from "../MLFeature"

export class MLHubModel { // INCOMPLETE

    //#region --Client API--
    
    constructor (session: string) {

    }

    public async predict (...features: MLFeature[]): Promise<MLFeature[]> {
        return null as unknown as MLFeature[];
    }
    //#endregion
}