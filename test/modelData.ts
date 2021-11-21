/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { suite, test } from "@testdeck/mocha"
import { expect } from "chai"
import { MLModelData } from "../src"

@suite("Model Data Test")
class ModelDataTest {

    @test
    async "Should fetch MobileNet v2 model data" () {
        const tag = "@natsuite/mobilenet-v2";
        const modelData = await MLModelData.fromHub(tag, process.env.HUB_ACCESS_KEY);
        expect(modelData.tag).to.equal(tag);
    }

    @test
    async "Should have imagenet classification labels" () {
        const modelData = await MLModelData.fromHub("@natsuite/mobilenet-v2", process.env.HUB_ACCESS_KEY);
        expect(modelData.labels).to.have.lengthOf(1000);
    }

    @test
    async "Should have imagenet normalization" () {
        const modelData = await MLModelData.fromHub("@natsuite/mobilenet-v2", process.env.HUB_ACCESS_KEY);
        expect(modelData.normalization.mean).to.eql([0.485, 0.456, 0.406]);
        expect(modelData.normalization.std).to.eql([0.229, 0.224, 0.225]);
    }
}