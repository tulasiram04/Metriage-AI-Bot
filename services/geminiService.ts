import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

// Safely retrieve API Key, handling environments where process might be undefined
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

const API_KEY = getApiKey();

const ai = new GoogleGenAI({ apiKey: API_KEY });

const triageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: {
      type: Type.STRING,
      enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH],
      description: "The assessed risk level based on symptoms.",
    },
    explanation: {
      type: Type.STRING,
      description: "A concise, professional medical explanation of why this risk level was assigned. Max 2 sentences.",
    },
    recommendation: {
      type: Type.OBJECT,
      properties: {
        specialization: {
          type: Type.STRING,
          description: "The type of doctor specialist recommended (e.g., General Physician, Cardiologist, ENT).",
        },
        reason: {
          type: Type.STRING,
          description: "Brief reason for referring to this specialist.",
        },
      },
      required: ["specialization", "reason"],
    },
    consultationSummary: {
      type: Type.STRING,
      description: "A max 2-line summary of the chat discussion.",
    },
    disclaimer: {
      type: Type.STRING,
      description: "A standard medical disclaimer stating this is AI advice and not a diagnosis.",
    },
  },
  required: ["riskLevel", "explanation", "recommendation", "disclaimer", "consultationSummary"],
};

export const startTriageChat = (
  age: number,
  gender: string,
  symptoms: string[],
  duration: string
): Chat => {
  if (!API_KEY) {
    // Return a dummy chat object if no API key is present (for demo/fallback)
    // In a real scenario, this would likely throw or handle gracefully
    return {
      sendMessage: async () => ({ text: "System is in offline mode. Please configure API Key." })
    } as unknown as Chat;
  }

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are a medical triage assistant.
      
      Patient Context:
      - Age: ${age}
      - Gender: ${gender}
      - Symptoms: ${symptoms.join(', ')}
      - Duration: ${duration}

      Your goal: Assess severity quickly. Ask MINIMAL questions (only 1 or 2 most critical ones) to clarify if needed, otherwise proceed to advice.

      STRICT FORMATTING RULES (FOLLOW THESE OR FAIL):
      1. **BE EXTREMELY CONCISE**: Responses must be very short.
      2. **USE "•" ONLY FOR LISTS**: Use the "•" character for bullet points ONLY when listing items. Do not use them for normal sentences.
      3. **HIGHLIGHT DANGER**: If double asterisks ** are used, the text will be bolded. Use this for critical warnings or key terms.
      4. **NO DIAGNOSIS**: Never say "You have X". Say "It could be X".
      5. **LIMIT QUESTIONS**: Do not overwhelm the user. Ask only if absolutely necessary.
      6. **FILTER**: If the user asks vulgar or inappropriate questions, reply EXACTLY: "I cannot reply to this kind of messages."

      Example Interaction:
      User: "I have a headache."
      You: 
      "I see. To check severity:
      • **How severe** is the pain (1-10)?
      • Any **vision changes** or nausea?"
      `
    }
  });
};

export const analyzeSymptoms = async (
  age: number,
  gender: string,
  symptoms: string[],
  duration: string,
  consultationHistory: string = ""
): Promise<AnalysisResult> => {
  if (!API_KEY) {
    console.warn("No API Key found. Returning mock data for demonstration.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          riskLevel: RiskLevel.MEDIUM,
          explanation: "Symptoms suggest a possible viral infection or inflammatory response. Requires clinical correlation.",
          recommendation: {
            specialization: "General Physician",
            reason: "To rule out bacterial infection and check vitals.",
          },
          disclaimer: "This system does not provide medical diagnosis. Please consult a doctor.",
          consultationSummary: "Patient reported fever and headache for 2 days. AI advised hydration and rest, and recommended seeing a GP."
        });
      }, 1500);
    });
  }

  try {
    const prompt = `
      Act as an AI Medical Triage Assistant. Analyze the following patient data:
      Age: ${age}
      Gender: ${gender}
      Symptoms: ${symptoms.join(", ")}
      Duration: ${duration}

      ${consultationHistory ? `Additional context from patient chat:\n${consultationHistory}` : ''}

      Task:
      1. Assess the risk level (Low, Medium, High).
      2. Provide a brief explanation.
      3. Recommend a doctor specialization.
      4. Generate a 'consultationSummary': Summarize the chat in MAX 2 lines.
      5. Include a mandatory disclaimer.

      Strictly adhere to the JSON schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: triageSchema,
        systemInstruction: "You are a professional medical decision support system. Your tone should be academic, objective, and safe. Never provide a definitive diagnosis, only risk assessment and guidance.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const result = JSON.parse(text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback for demo stability
    return {
      riskLevel: RiskLevel.LOW,
      explanation: "Unable to process detailed analysis at this moment due to connectivity. Defaulting to safe mode.",
      recommendation: {
        specialization: "General Physician",
        reason: "Routine checkup recommended due to system unavailability.",
      },
      disclaimer: "System Offline. Consult a doctor.",
      consultationSummary: "System offline. No chat history available."
    };
  }
};