const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-70b-8192';

const SYSTEM_PROMPT = `You are an expert AWS Solutions Architect conducting a brief requirements clarification.

You have already parsed a project SOW. Ask ONE targeted question at a time about genuine ambiguities.
Provide 2-4 short answer options when possible.

After max 3 questions OR if no more clarification needed, output exactly:
CLARIFICATION_COMPLETE
Then immediately output the updated architecture JSON.

Question format (valid JSON only, no markdown):
{
  "question": "Your specific question?",
  "context": "One sentence why this matters",
  "options": ["Option A", "Option B", "Option C"]
}

When done:
CLARIFICATION_COMPLETE
{
  "title": "...",
  "services": [...],
  "connections": [...],
  "regions": [...]
}

Rules:
- Only ask about genuine architectural decisions
- Never ask about things already stated
- Keep options under 8 words each
- Respond ONLY with JSON or CLARIFICATION_COMPLETE followed by JSON`;

export async function getNextQuestion(conversationHistory, architecture, apiKey) {
  const messages = [
    {
      role: 'system',
      content: `${SYSTEM_PROMPT}\n\nCurrent architecture:\n${JSON.stringify(architecture, null, 2)}`,
    },
    ...conversationHistory,
    {
      role: 'user',
      content: conversationHistory.length === 0
        ? 'Please ask your first clarifying question, or output CLARIFICATION_COMPLETE if no clarification is needed.'
        : 'Please ask your next clarifying question, or output CLARIFICATION_COMPLETE if you have enough information.',
    },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      max_tokens: 1000,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Clarification failed');
  }

  const data = await response.json();
  const raw = data.choices[0].message.content.trim();

  if (raw.includes('CLARIFICATION_COMPLETE')) {
    const jsonPart = raw.split('CLARIFICATION_COMPLETE')[1].trim();
    const cleaned = jsonPart.replace(/```json|```/g, '').trim();
    return {
      done: true,
      architecture: JSON.parse(cleaned),
    };
  }

  const cleaned = raw.replace(/```json|```/g, '').trim();
  const questionData = JSON.parse(cleaned);
  return {
    done: false,
    question: questionData.question,
    context: questionData.context,
    options: questionData.options || [],
  };
}
