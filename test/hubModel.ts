/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { suite, test } from "@testdeck/mocha"
import { expect } from "chai"
import { MLHubModel, MLModelData, MLImageFeature, MLTextFeature, MLArrayFeature } from "../src"

@suite("Hub Model Test")
class HubModelTest {

    @test
    async "Should not deserialize Edge model" () {
        const modelData = await MLModelData.fromHub("@natsuite/mobilenet-v2", process.env.HUB_ACCESS_KEY);
        expect(() => modelData.deserialize()).to.throw(Error);
    }

    @test
    async "Should deserialize Hub model" () {
        const modelData = await MLModelData.fromHub("@natsuite/resnet18", process.env.HUB_ACCESS_KEY);
        const model = modelData.deserialize() as MLHubModel;
        expect(model).to.have.property("predict");
    }

    @test
    async "Should predict with Hub model" () {
        const modelData = await MLModelData.fromHub("@natsuite/resnet18", process.env.HUB_ACCESS_KEY);
        const model = modelData.deserialize() as MLHubModel;
        const feature = new MLImageFeature("test/media/cat_224.jpg");
        const hubFeature = await feature.serialize();
        const results = await model.predict(hubFeature);
        const label = (results[0] as MLTextFeature).text;
        const score = (results[1] as MLArrayFeature<Float32Array>).data[0];
        expect(label).to.equal("tabby");
        expect(score).to.greaterThan(10);
    }
}