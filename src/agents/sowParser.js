const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const SYSTEM_PROMPT = "You are an expert AWS Solutions Architect. Read the project description and extract all AWS services and their relationships. Respond ONLY with valid JSON no markdown no explanation: {\"title\": \"Short architecture title\", \"services\": [{\"id\": \"unique_id\", \"name\": \"Service Name\", \"type\": \"network|compute|storage|database|security|messaging|monitoring|ai\", \"awsKey\": \"e.g. lambda, s3, rds\"}], \"connections\": [{\"from\": \"id\", \"to\": \"id\", \"label\": \"action\"}], \"regions\": [{\"id\": \"id\", \"label\": \"VPC or group name\", \"contains\": [\"service_ids\"]}], \"ambiguities\": [\"specific question about something unclear\"]}";

export async function parseSOW(sowText, apiKey) {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
    body: JSON.stringify({
      model: MODEL, temperature: 0.1, max_tokens: 2000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "Analyze this project description:\n\n" + sowText }
      ]
    })
  });
  if (!response.ok) { const err = await response.json(); throw new Error(err?.error?.message || "SOW parsing failed"); }
  const data = await response.json();
  const raw = data.choices[0].message.content.trim();
  try { return JSON.parse(raw); }
  catch { return JSON.parse(raw.replace(/```json|```/g, "").trim()); }
}

