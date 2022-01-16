/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */
import { MLDataType } from "../MLTypes";
import { MLFeature } from "../MLFeature";
import { IMLHubFeature, isHubFeature, MLHubFeature } from "../hub";
import { MLTextType } from "../types";

/**
 * ML text feature.
 * This feature will mainly be used with natural language processing models.
 */
export class MLTextFeature extends MLFeature implements IMLHubFeature {
  /**
   * Feature text.
   */
  public readonly text: Promise<string>;

  /**
   * Create the text feature.
   * @param text The text.
   */
  public constructor(text: string);
  /**
   * Create the text feature.
   * @param hubFeature A serialized hub text feature whose text will be used.
   */
  public constructor(hubFeature: MLHubFeature);
  public constructor(textOrFeature: string | MLHubFeature) {
    const [text, len] = isHubFeature(textOrFeature)
      ? MLTextFeature.initializationValues(textOrFeature)
      : [Promise.resolve(textOrFeature), numCodePoints(textOrFeature)];

    super(new MLTextType(len));
    this.text = text;
  }

  public async serialize(): Promise<MLHubFeature> {
    return {
      // put text in a blob. The browser will automatically convert it to UTF-8!
      data: await this.text.then((text) => new Blob([text])),
      type: MLDataType.String,
      shape: [1, (this.type as MLTextType).length],
    };
  }

  private static initializationValues(feature: MLHubFeature) {
    if (feature.type !== MLDataType.String)
      throw new Error("MLTextFeature: Invalid data type");

    return [new Response(feature.data).text(), feature.shape![1]] as const;
  }
}

function numCodePoints(str: string) {
  return [...str].reduce((acc, _) => acc + 1, 0);
}
