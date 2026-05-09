import React, { useState, useEffect, useRef } from "react";
import { getNextQuestion } from "../../agents/clarifier";

export default function ChatPanel({ chatHistory, setChatHistory, architecture, setArchitecture, setStep, isLoading, setIsLoading }) {
  const [input, setInput] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  useEffect(() => {
    if (chatHistory.length === 1 && architecture?.ambiguities?.length > 0) { askNextQuestion([]); }
    else if (chatHistory.length === 1) { setStep("diagram"); }
  }, []);

  const askNextQuestion = async (conversationSoFar) => {
    setIsLoading(true);
    try {
      const apiKey = process.env.REACT_APP_GROQ_API_KEY;
      const apiMessages = conversationSoFar.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
      const result = await getNextQuestion(apiMessages, architecture, apiKey);
      if (result.done) {
        setArchitecture(result.architecture);
        setChatHistory(prev => [...prev, { role: "assistant", content: "Got everything I need! Generating your architecture diagram now...", options: [] }]);
        setTimeout(() => setStep("diagram"), 1200);
      } else {
        setChatHistory(prev => [...prev, { role: "assistant", content: result.question, context: result.context, options: result.options || [] }]);
        setQuestionCount(q => q + 1);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "assistant", content: "Error: " + err.message, options: [] }]);
    } finally { setIsLoading(false); }
  };

  const handleSend = async (message) => {
    const text = message || input.trim();
    if (!text || isLoading) return;
    setInput("");
    const updatedHistory = [...chatHistory, { role: "user", content: text }];
    setChatHistory(updatedHistory);
    if (questionCount >= 3) { setTimeout(() => setStep("diagram"), 800); return; }
    await askNextQuestion(updatedHistory);
  };

  return (
    <div className="card" style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", height: 600 }}>
      <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Clarification</h2>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Answer a few questions to generate an accurate diagram</p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, paddingBottom: 8 }}>
        {chatHistory.map((msg, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", background: msg.role === "user" ? "#3b82f6" : "#f1f5f9", color: msg.role === "user" ? "white" : "#1a1a2e", borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "10px 14px", fontSize: 14, lineHeight: 1.6 }}>
              {msg.content}
            </div>
            {msg.context && <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, maxWidth: "80%" }}>{msg.context}</p>}
            {msg.options?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {msg.options.map((opt, j) => (
                  <button key={j} className="btn-secondary" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => handleSend(opt)} disabled={isLoading}>{opt}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && <div style={{ background: "#f1f5f9", borderRadius: "12px 12px 12px 2px", padding: "10px 14px", fontSize: 14, color: "#64748b", width: "fit-content" }}>Thinking...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, display: "flex", gap: 8 }}>
        <input type="text" placeholder="Type your answer..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} disabled={isLoading} />
        <button className="btn-primary" onClick={() => handleSend()} disabled={isLoading || !input.trim()} style={{ whiteSpace: "nowrap" }}>Send</button>
      </div>
    </div>
  );
}
