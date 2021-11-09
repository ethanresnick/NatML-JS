/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { suite, test } from "@testdeck/mocha"
import { expect } from "chai"
import { MLHubModel, MLModelData } from "../src"

@suite("Hub Model Test")
class HubModelTest {

    readonly ACCESS_KEY = "Hello";

    @test
    async "Should deserialize Hub model" () {
        const tag = "@natsuite/???"; // INCOMPLETE
        const modelData = await MLModelData.fromHub(tag, this.ACCESS_KEY);
        const model = modelData.deserialize();
        const hubModel = model as MLHubModel;
        expect(hubModel.predict).to.not.be(undefined);
    }
}