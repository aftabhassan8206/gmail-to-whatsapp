
import { GoogleGenAI, Type } from "@google/genai";
import { VisualSummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateVisualSummary = async (html: string, subject: string): Promise<VisualSummary> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this email (Subject: ${subject}) and extract a clean, professional visual summary for a "screenshot" card. 
    Email HTML: ${html.substring(0, 10000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING, description: "A punchy headline for the card" },
          senderName: { type: Type.STRING, description: "The likely sender or company name" },
          summary: { type: Type.STRING, description: "A 2-sentence summary of the main message" },
          bulletPoints: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Up to 3 key takeaways"
          },
          themeColor: { type: Type.STRING, description: "A hex color code that fits the brand of the email" },
          callToAction: { type: Type.STRING, description: "The main action required" }
        },
        required: ["headline", "senderName", "summary", "bulletPoints", "themeColor"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate visual summary");
  }

  return JSON.parse(response.text.trim());
};
