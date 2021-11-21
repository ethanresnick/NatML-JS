/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import sharp = require("sharp")
import { suite, test } from "@testdeck/mocha"
import { expect } from "chai"
import { MLArrayFeature, MLDataType, MLImageFeature, MLTextFeature } from "../src"

@suite("Hub Feature Test")
class HubFeatureTest {
    
    @test
    async "Should serialize text feature" () {
        const text = `Hello world!`;
        const feature = new MLTextFeature(text);
        const hubFeature = feature.serialize();
        expect(hubFeature).to.eql({ data: text, type: MLDataType.String });
    }

    @test
    async "Should serailize image feature" () {
        const imagePath = "test/media/cat_224.jpg"
        const feature = new MLImageFeature(imagePath);
        const metadata = await feature.image.metadata();
        const hubFeature = await feature.serialize();
        expect(hubFeature.type).to.equal(MLDataType.Image);
        const buffer = Buffer.from(hubFeature.data, "base64");
        const decodedMetadata = await sharp(buffer).metadata();
        expect([metadata.width, metadata.height]).to.eql([decodedMetadata.width, decodedMetadata.height]);
    }

    @test
    async "Should serialize array feature" () {
        const array = new Int32Array([10, 32, -394, 28, 7, 0]);
        const feature = new MLArrayFeature(array, [3, 2]);
        const hubFeature = feature.serialize();
        expect(hubFeature.shape).to.eql(feature.shape);
        expect(hubFeature.type).to.equal(feature.type.type);
    }
}