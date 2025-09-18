
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisData, ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const metricSchema = {
    type: Type.OBJECT,
    properties: {
        value: { type: Type.STRING, description: "The calculated value or concise summary for the metric (e.g., '$10B', 'High', '3-6 months')." },
        rationale: { type: Type.STRING, description: "A brief, data-driven rationale explaining how the value was determined." }
    },
    required: ["value", "rationale"]
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        marketAnalytics: {
            type: Type.OBJECT,
            properties: {
                totalAddressableMarket: metricSchema,
                serviceableAvailableMarket: metricSchema,
                serviceableObtainableMarket: metricSchema,
                marketGrowthRate: metricSchema,
                marketTrendsAndTiming: metricSchema,
                competitorLandscape: metricSchema,
            },
            required: ["totalAddressableMarket", "serviceableAvailableMarket", "serviceableObtainableMarket", "marketGrowthRate", "marketTrendsAndTiming", "competitorLandscape"]
        },
        customerDemandAnalytics: {
            type: Type.OBJECT,
            properties: {
                customerAcquisitionCost: metricSchema,
                willingnessToPay: metricSchema,
            },
            required: ["customerAcquisitionCost", "willingnessToPay"]
        },
        productSolutionAnalytics: {
            type: Type.OBJECT,
            properties: {
                valuePropositionClarity: metricSchema,
                differentiationIndex: metricSchema,
                minimumViableProduct: metricSchema,
                technicalFeasibility: metricSchema,
                ipAndMoats: metricSchema,
            },
            required: ["valuePropositionClarity", "differentiationIndex", "minimumViableProduct", "technicalFeasibility", "ipAndMoats"]
        },
        businessModelAnalytics: {
            type: Type.OBJECT,
            properties: {
                revenueModel: metricSchema,
                scalabilityPotential: metricSchema,
                salesCycleLength: metricSchema,
            },
            required: ["revenueModel", "scalabilityPotential", "salesCycleLength"]
        },
        financialAnalytics: {
            type: Type.OBJECT,
            properties: {
                burnRateAndRunway: metricSchema,
                breakEvenAnalysis: metricSchema,
            },
            required: ["burnRateAndRunway", "breakEvenAnalysis"]
        },
        overallAssessment: {
            type: Type.OBJECT,
            properties: {
                chanceOfSuccess: { type: Type.INTEGER, description: "A percentage value from 0 to 100 representing the chance of success." },
                summary: { type: Type.STRING, description: "A concise summary of the idea's overall potential and key risks." }
            },
            required: ["chanceOfSuccess", "summary"]
        }
    },
    required: ["marketAnalytics", "customerDemandAnalytics", "productSolutionAnalytics", "businessModelAnalytics", "financialAnalytics", "overallAssessment"]
};


export const analyzeIdea = async (idea: string): Promise<AnalysisData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following business idea and provide a detailed analysis based on the provided JSON schema. Be realistic and critical in your assessment. Idea: "${idea}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisData;
    } catch (error) {
        console.error("Error analyzing idea with Gemini API:", error);
        throw new Error("Failed to get analysis from AI. The model may have returned an invalid format.");
    }
};

export const continueChat = async (history: ChatMessage[]): Promise<string> => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are an expert business analyst and startup consultant. The user has provided an initial idea and received a dashboard analysis. Your role now is to help them refine this idea. Be concise, insightful, and ask clarifying questions. The user's initial idea analysis is implicitly part of this conversation's context.",
        },
    });

    // The Gemini service doesn't have a direct history parameter in `create`. 
    // We send messages sequentially. For simplicity here, we'll just send the last user message.
    // A more robust implementation might replay the history.
    // FIX: Replace `findLast` with a compatible alternative for older JS environments.
    const lastUserMessage = [...history].reverse().find(m => m.role === 'user');

    if (!lastUserMessage) {
        return "I'm sorry, I couldn't find your last message.";
    }

    try {
        const response = await chat.sendMessage({ message: lastUserMessage.text });
        return response.text;
    } catch (error) {
        console.error("Error in chat continuation:", error);
        throw new Error("Failed to get a response from the AI.");
    }
};