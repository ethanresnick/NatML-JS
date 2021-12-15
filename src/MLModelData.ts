/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLModel } from "./MLModel";
import { AspectMode, AudioFormat, Normalization } from "./MLTypes";
import { NatMLHub, MLHubModel, Framework, Session, PredictorType } from "./hub";

/**
 * Self-contained archive with ML model and supplemental data needed to make predictions.
 */
export class MLModelData {
  //#region --Client API--
  /**
   * NatML Hub predictor tag.
   */
  public get tag(): string {
    return this.session.predictor.tag;
  }

  /**
   * Predictor classification labels.
   * This is `undefined` if the predictor does not have use classification labels.
   */
  public get labels(): string[] | undefined {
    return this.session.predictor.labels;
  }

  /**
   * Expected feature normalization for predictions with this model.
   * This is `undefined` if the predictor does not use normalization.
   */
  public get normalization(): Normalization | undefined {
    return this.session.predictor.normalization;
  }

  /**
   * Expected image aspect mode for predictions with this model.
   * This is `undefined` for predictors that do not work with images.
   */
  public get aspectMode(): AspectMode | undefined {
    return this.session.predictor.aspectMode;
  }

  /**
   * Expected audio format for predictions with this model.
   * This is `undefined` for predictors that do not work with audio.
   */
  public get audioFormat(): AudioFormat | undefined {
    return this.session.predictor.audioFormat;
  }

  /**
   * Deserialize the model data to create an ML model that can be used for prediction.
   * You MUST dispose the model once you are done with it.
   * @returns ML model.
   */
  public deserialize(): MLModel {
    switch (this.session.predictor.type) {
      case PredictorType.Edge:
        throw new Error(`NatML does not support Edge predictors in NodeJS`);
      case PredictorType.Hub:
        return new MLHubModel(this.session.id);
      default:
        throw new Error(`Invalid predictor type`);
    }
  }

  /**
   * Fetch ML model data from NatML Hub.
   * @param tag Predictor tag.
   * @param accessKey Hub access key.
   * @returns ML model data.
   */
  public static async fromHub(
    tag: string,
    accessKey?: string
  ): Promise<MLModelData> {
    const session = await NatMLHub.createSession(
      {
        tag,
        device: {
          os: process.platform,
          framework: Framework.Node,
        },
      },
      accessKey ?? ""
    );
    return new MLModelData(session);
  }
  //#endregion

  //#region --Operations--
  private readonly session: Session;

  private constructor(session: Session) {
    this.session = session;
  }
  //#endregion
}
