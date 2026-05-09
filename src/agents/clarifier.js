const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const SYSTEM_PROMPT = "You are an expert AWS Solutions Architect. Ask ONE targeted question at a time about genuine ambiguities. Provide 2-4 short answer options. After max 3 questions OR if no clarification needed output exactly CLARIFICATION_COMPLETE then the updated architecture JSON. Question format (valid JSON only): {\"question\": \"Your question?\", \"context\": \"Why this matters\", \"options\": [\"Option A\", \"Option B\"]}. When done: CLARIFICATION_COMPLETE then {\"title\": \"...\", \"services\": [...], \"connections\": [...], \"regions\": [...]}";

export async function getNextQuestion(conversationHistory, architecture, apiKey) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT + "\n\nCurrent architecture:\n" + JSON.stringify(architecture, null, 2) },
    ...conversationHistory,
    { role: "user", content: conversationHistory.length === 0 ? "Please ask your first clarifying question, or output CLARIFICATION_COMPLETE if no clarification is needed." : "Please ask your next question or output CLARIFICATION_COMPLETE if you have enough information." }
  ];
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
    body: JSON.stringify({ model: MODEL, temperature: 0.2, max_tokens: 1000, messages })
  });
  if (!response.ok) { const err = await response.json(); throw new Error(err?.error?.message || "Clarification failed"); }
  const data = await response.json();
  const raw = data.choices[0].message.content.trim();
  if (raw.includes("CLARIFICATION_COMPLETE")) {
    const jsonPart = raw.split("CLARIFICATION_COMPLETE")[1].trim();
    return { done: true, architecture: JSON.parse(jsonPart.replace(/```json|```/g, "").trim()) };
  }
  const questionData = JSON.parse(raw.replace(/```json|```/g, "").trim());
  return { done: false, question: questionData.question, context: questionData.context, options: questionData.options || [] };
}

