/*
 *   NatML
 *   Copyright (c) 2021 Yusuf Olokoba.
 */

import { MLModel } from "../MLModel";
import { MLHubFeature } from "./MLHubFeature";
import { NatMLHub } from "./NatMLHub";
import parseDataURL from "data-urls";

/**
 * Server-side ML model capable of making predictions on features.
 */
export class MLHubModel extends MLModel {
  constructor(session: string) {
    super(session);
  }

  /**
   * Make a server-side prediction on one or more input features.
   * @param inputs Input features.
   * @returns Output features.
   */
  public async predict(...features: MLHubFeature[]): Promise<MLHubFeature[]> {
    const prediction = await NatMLHub.requestPrediction({
      session: this.session,
      inputs: features,
      waitUntilCompleted: true,
    });
    if (prediction.error) throw new Error(prediction.error);
    const results = prediction.results!; // TODO: non-null assertion safe?

    // await the start of all downloads, and reject if any fail.
    const downloadedData = await Promise.all(
      results.map((result) =>
        new URL(result.data).protocol === "data:"
          ? Promise.resolve(new Blob([parseDataURL(result.data)!.body]))
          : fetch(result.data).then((response) => response.body!)
      )
    );

    return results.map((it, i) => ({ ...it, data: downloadedData[i] }));
  }
}
