/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import { suite, test } from "@testdeck/mocha"
import { expect } from "chai"
import { MLModelData } from "../src"

@suite("Model Data Test")
class ModelDataTest {

    readonly ACCESS_KEY = "Hello";

    public static before () {

    }

    @test
    async "Should fetch MobileNet v2 model data" () {
        const tag = "@natsuite/mobilenet-v2";
        const modelData = await MLModelData.fromHub(tag, this.ACCESS_KEY);
        expect(modelData.tag).to.equal(tag);
    }

    @test
    async "Should have imagenet classification labels" () { // INCOMPLETE
        const modelData = await MLModelData.fromHub("@natsuite/mobilenet-v2", this.ACCESS_KEY);
        expect(modelData.labels).length.to.equal(80);
    }

    @test
    async "Should have imagenet normalization" () { // INCOMPLETE
        const modelData = await MLModelData.fromHub("@natsuite/mobilenet-v2", this.ACCESS_KEY);
        
    }
}