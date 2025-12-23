import express from 'express';
import Groq from 'groq-sdk';
import { History } from '../models/History.js';

const router = express.Router();

/* =========================
   Groq Lazy Initialization
========================= */

let groq = null;

function getGroqClient() {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    console.log(
      'GROQ_API_KEY loaded:',
      apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET'
    );

    if (!apiKey) {
      console.error('⚠️ GROQ_API_KEY is not set');
      return null;
    }

    groq = new Groq({ apiKey });
  }
  return groq;
}

/* ✅ SUPPORTED MODEL */
const GROQ_MODEL = 'llama-3.1-8b-instant';
/* =========================
   Save Analysis Result
========================= */

router.post('/save', async (req, res) => {
  try {
    const {
      userId,
      name,
      age,
      gender,
      symptoms,
      duration,
      result,
      chatTranscript
    } = req.body;

    const history = new History({
      userId,
      name,
      age,
      gender,
      symptoms,
      duration,
      result,
      chatTranscript
    });

    await history.save();
    res.json({ message: 'Analysis saved', id: history._id });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

/* =========================
   Get User History
========================= */

router.get('/history/:userId', async (req, res) => {
  try {
    const history = await History
      .find({ userId: req.params.userId })
      .sort({ timestamp: -1 });

    res.json(history);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

/* =========================
   Analyze Symptoms
========================= */

router.post('/analyze', async (req, res) => {
  try {
    const { age, gender, symptoms, duration } = req.body;

    if (!age || !gender || !symptoms || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = getGroqClient();
    if (!client) {
      return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
    }

    const symptomsStr = Array.isArray(symptoms)
      ? symptoms.join(', ')
      : symptoms;

    const prompt = `
You are a medical triage AI assistant.

Patient Details:
- Age: ${age}
- Gender: ${gender}
- Symptoms: ${symptomsStr}
- Duration: ${duration}

Respond ONLY with valid JSON:
{
  "riskLevel": "Low Risk | Medium Risk | High Risk",
  "explanation": "Max 2 sentences",
  "recommendation": {
    "specialization": "Doctor type",
    "reason": "Brief reason"
  },
  "consultationSummary": "1–2 line summary",
  "disclaimer": "This is AI-generated advice only."
}
`;

    const response = await client.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 500,
      messages: [
        { role: 'system', content: 'You are a medical triage assistant.' },
        { role: 'user', content: prompt }
      ]
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error('Empty AI response');

    res.json(JSON.parse(text.trim()));

  } catch (e) {
    console.error('Analyze Error:', e);

    if (e.status === 429) {
      return res.status(429).json({
        error: 'rate_limit',
        message: 'Rate limit exceeded. Try again later.'
      });
    }

    res.status(500).json({
      error: 'Analysis failed',
      riskLevel: 'Medium Risk',
      explanation: 'Unable to complete analysis.',
      recommendation: {
        specialization: 'General Physician',
        reason: 'Further evaluation required'
      },
      consultationSummary: 'Analysis incomplete',
      disclaimer: 'This is AI-generated advice only.'
    });
  }
});

/* =========================
   Chat Endpoint
========================= */

router.post('/chat', async (req, res) => {
  console.log('Chat endpoint called');

  try {
    const { message, age, gender, symptoms, duration, chatHistory } = req.body;

    const client = getGroqClient();
    if (!client) {
      return res.status(500).json({
        response: 'Chat service not configured.'
      });
    }

    const symptomsStr = Array.isArray(symptoms)
      ? symptoms.join(', ')
      : symptoms;

    const systemPrompt = `
You are a professional medical triage assistant.

Patient Information:
- Age: ${age}
- Gender: ${gender}
- Symptoms: ${symptomsStr}
- Duration: ${duration}

CORE BEHAVIOR (VERY IMPORTANT):
- Ask ONLY ONE follow-up question per message
- Never ask multiple questions in a single response
- Wait for the user's reply before asking the next question
- Follow a logical medical order (duration → severity → fever → associated symptoms)
- Do NOT provide a diagnosis
- Do NOT ask unnecessary questions
- Respond only to the symptom mentioned by the user

Tone & Style:
- Professional, calm, and respectful
- Natural conversational tone (not robotic, not academic)
- No child-like or emotional language
- No slang or casual phrases

Conversation Flow:
1. Acknowledge the symptom briefly
2. Ask ONE relevant follow-up question
3. After sufficient information is gathered, give general suggestions
4. Mention when to consult a healthcare professional

Formatting Rules:
- Do NOT use numbered lists
- Do NOT use headings
- Use bullet points (●) ONLY for suggestions, not for questions
- Keep responses short and clear

Safety Rules:
- If the user sends vulgar, sexual, or unrelated content, politely refuse and redirect to medical topics only.

You must strictly follow this behavior at all times.
`;

    const messages = [{ role: 'system', content: systemPrompt }];

    if (chatHistory) {
      try {
        const history = JSON.parse(chatHistory);
        for (const msg of history) {
          messages.push({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.content || ''
          });
        }
      } catch {}
    }

    messages.push({ role: 'user', content: message });

    const response = await client.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 300,
      messages
    });

    res.json({
      response:
        response.choices[0]?.message?.content ||
        "I'm here to help. Can you tell me more?"
    });

  } catch (e) {
    console.error('Chat Error:', e);

    if (e.status === 429) {
      return res.status(429).json({
        response: 'Chat limit reached. Try again later.'
      });
    }

    res.status(500).json({
      response: 'Chat service unavailable.'
    });
  }
});

export default router;
