import { AnalysisResult, ChatMessage } from "../types";

// Analyze symptoms using backend API
export const analyzeSymptoms = async (
  age: number,
  gender: string,
  symptoms: string[],
  duration: string,
  consultationHistory: string = ""
): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/triage/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        age,
        gender,
        symptoms,
        duration,
      }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Analysis error:', error);
    // Fallback response
    return {
      riskLevel: "Medium Risk" as any,
      explanation: "Unable to process analysis. Please try again or consult a healthcare professional.",
      recommendation: {
        specialization: "General Physician",
        reason: "Unable to complete automated assessment.",
      },
      disclaimer: "This is AI assistance only. Please consult a doctor for proper medical advice.",
      consultationSummary: "Analysis failed. Please try again."
    };
  }
};

// Start triage chat using backend API
export const startTriageChat = (
  age: number,
  gender: string,
  symptoms: string[],
  duration: string
) => {
  // Return a chat handler that makes API calls
  return {
    sendMessage: async (message: string, chatHistory?: ChatMessage[]) => {
      try {
        // Format chat history for Groq API
        const formattedHistory = chatHistory?.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        })) || [];

        const response = await fetch('/api/triage/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            message,
            age,
            gender,
            symptoms,
            duration,
            chatHistory: formattedHistory.length > 0 ? JSON.stringify(formattedHistory) : null,
          }),
        });

        const result = await response.json();
        
        // Handle quota exceeded error
        if (!response.ok) {
          console.error('Chat API error:', result);
          if (result.error === "quota_exceeded" || response.status === 429) {
            return { text: result.response || "I'm sorry, but our daily chat limit has been reached. Please try again after 24 hours. Thank you for your patience!" };
          }
          throw new Error(`Chat failed: ${response.statusText}`);
        }

        return { text: result.response };
      } catch (error) {
        console.error('Chat error:', error);
        return { text: "I'm sorry, I'm having trouble connecting right now. Please try again or consult a healthcare professional." };
      }
    },
  };
};