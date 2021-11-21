/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import axios from "axios"
import { nanoid } from "nanoid"
import { MLHubFeature } from "./MLHubFeature"
import { Session, Prediction, Device, UploadType } from "./NatMLHubTypes"

export interface CreateSessionInput {
    tag: string;
    device: Device;
}

export interface RequestPredictionInput {
    session: string;
    inputs: MLHubFeature[];
    waitUntilCompleted?: boolean;
}

export interface ReportPredictionInput {
    session: string;
    latency: number;
    date: Date;
}

/**
 * 
 */
export abstract class NatMLHub { // Prevent instantiation with `abstract` since no `static` classes in TS

    //#region --Client API--
    /**
     * NatML Hub API URL.
     */
    public static get URL () {
        switch (process.env.HUB_ENV?.toLowerCase()) {
            case "development": return "http://localhost:8000/graph";
            case "staging":     return "https://staging.api.natml.ai/graph";
            default:            return "https://api.natml.ai/graph";
        }
    }

    /**
     * Create a prediction session.
     * @param input Session input.
     * @param accessKey Hub access key.
     * @returns Prediction session.
     */
    public static async createSession (input: CreateSessionInput, accessKey: string): Promise<Session> {
        const query = `
        mutation ($input: CreateSessionInput!) {
            createSession (input: $input) {
                id
                predictor {
                    tag
                    type
                    labels
                    normalization { mean std }
                    aspectMode
                    audioFormat { sampleRate channelCount }
                }
                graph
                flags
            }
        }`;
        const variables = { input };
        const data = { query, variables };
        const auth: any = accessKey ? { "Authorization": `Bearer ${accessKey}` } : {};
        const headers = { "Content-Type": "application/json", ...auth };
        const response = await axios.post(this.URL, data, { headers });
        if (response.data.errors)
            throw new Error(JSON.stringify(response.data.errors));
        else
            return response.data.data.createSession;
    }

    /**
     * Request a Hub prediction.
     * @param input Prediction request.
     * @returns Hub prediction.
     */
    public static async requestPrediction (input: RequestPredictionInput): Promise<Prediction> {
        const query = `
        mutation ($input: RequestPredictionInput!) {
            requestPrediction (input: $input) {
                id
                status
                results { data type shape }
                error
            }
        }`;
        const variables = { input };
        const data = { query, variables };
        const headers = { "Content-Type": "application/json" };
        const response = await axios.post(this.URL, data, { headers, timeout: 100_000 });
        if (response.data.errors)
            throw new Error(JSON.stringify(response.data.errors));
        else
            return response.data.data.requestPrediction;
    }

    /**
     * Report an Edge prediction.
     * @param input Prediction report.
     */
    public static async reportPrediction (input: ReportPredictionInput) {
        const query = `
        mutation ($input: ReportPredictionInput!) {
            reportPrediction (input: $input) {
                id
            }
        }`;
        const variables = { input };
        const data = { query, variables };
        const headers = { "Content-Type": "application/json" };
        await axios.post(this.URL, data, { headers });
    }

    /**
     * Request an upload URL.
     * @param type Upload type.
     * @param name File name.
     * @returns Pre-signed upload URL.
     */
    public static async uploadURL (type: UploadType = UploadType.Feature, name?: string): Promise<string> {
        const query = `
        query ($input: UploadURLInput!) {
            uploadURL (input: $input)
        }
        `;
        const input = { type, name: name ?? nanoid() };
        const variables = { input };
        const data = { query, variables };
        const headers = { "Content-Type": "application/json" };
        const response = await axios.post(this.URL, data, { headers });
        if (response.data.errors)
            throw new Error(JSON.stringify(response.data.errors));
        else
            return response.data.data.uploadURL;
    }
    //#endregion


    //#region --Operations--

    private constructor () { } // Prevent inheritance
    //#endregion
}