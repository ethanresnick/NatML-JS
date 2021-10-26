/*
*   NatML
*   Copyright (c) 2021 Yusuf Olokoba.
*/

export abstract class MLModelData {
    
    /**
     * 
     * @param tag 
     * @param accessKey 
     * @returns 
     */
    public static async fromHub (tag: string, accessKey: string): Promise<MLModelData> {
        return null as unknown as MLModelData;
    }
}