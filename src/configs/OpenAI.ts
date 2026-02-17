import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
    if (!openaiClient) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.log(`OpenAI ${apiKey}`)
            throw new Error("OPENAI_API_KEY is not configured");
        }
        console.log(`OpenAI ${apiKey}`)
        openaiClient = new OpenAI({ apiKey });
    }

    return openaiClient;
}
