/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

import axios from "axios"
import { MLHubFeature } from "./MLHubFeature"
import { PredictorType, PredictionStatus } from "./NMLHubTypes"
import { AspectMode, AudioFormat, Normalization } from "../MLTypes"

export interface Device {
    model: string;
    os: string;
    gfx: string;
}

export interface CreateSessionInput {
    tag: string;
    device: Device;
}

export interface Session {
    id: string;
    predictor: Predictor;
    graph?: string;
    flags?: number;
}

export interface Predictor {
    tag: string;
    type: PredictorType;
    aspectMode?: AspectMode;
    labels?: string[];
    normalization?: Normalization;
    audioFormat?: AudioFormat;
}

export interface RequestPredictionInput {
    session: string;
    inputs: MLHubFeature[];
    waitUntilCompleted?: boolean;
}

export interface Prediction {
    id: string;
    status: PredictionStatus;
    results?: MLHubFeature[];
    error?: string;
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

    /**
     * 
     */
    public static readonly URL = "https://api.natml.ai/graph";

    /**
     * 
     * @param input 
     * @param accessKey 
     * @returns 
     */
    public static async createSession (input: CreateSessionInput, accessKey: string): Promise<Session> { // DEPLOY
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
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${accessKey}` };
        const response = await axios.post(this.URL, data, { headers });
        if (response.data.errors)
            throw new Error(JSON.stringify(response.data.errors));
        else
            return response.data.data.createSession;
    }

    /**
     * 
     * @param input 
     * @returns 
     */
    public static async requestPrediction (input: RequestPredictionInput): Promise<Prediction> { // DEPLOY
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
        const response = await axios.post(this.URL, data, { headers });
        if (response.data.errors)
            throw new Error(JSON.stringify(response.data.errors));
        else
            return response.data.data.requestPrediction;
    }

    /**
     * 
     * @param input 
     */
    public static async reportPrediction (input: ReportPredictionInput) { // DEPLOY
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
}