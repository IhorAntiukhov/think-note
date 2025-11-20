import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateIdea(
  prompt: string,
  categories: string[],
  noteContent: string,
) {
  const contents = `${prompt} Select a category for the idea from the list. Note content:\n${noteContent}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: {
        thinkingBudget: 0,
      },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summaryOrIdeaContent: {
            type: Type.STRING,
          },
          category: {
            type: Type.STRING,
            enum: categories,
          },
        },
        propertyOrdering: ["summaryOrIdeaContent", "category"],
      },
    },
  });

  return response.text;
}
