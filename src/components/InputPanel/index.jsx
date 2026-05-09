import React, { useState } from "react";
import { parseSOW } from "../../agents/sowParser";

const EXAMPLES = {
  ecommerce: "We need a scalable e-commerce platform on AWS. The system should have a React frontend hosted on S3 and served via CloudFront CDN. An API Gateway will route requests to multiple Lambda functions handling products, orders, and users. We need a PostgreSQL RDS database in a private subnet. Users authenticate with Cognito. We need SQS queues for order processing and SNS for notifications. Everything should be in a VPC.",
  microservices: "We need a microservices architecture. API Gateway sits at the edge. Behind it are 3 services: User Service, Product Service, and Order Service, each running on ECS Fargate. Each service has its own RDS PostgreSQL database. Services communicate via SQS. There is a Redis ElastiCache for session storage. ALB distributes traffic to ECS tasks. Cognito handles authentication.",
};

export default function InputPanel({ sowText, setSowText, setStep, setArchitecture, setChatHistory, setIsLoading, isLoading }) {
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!sowText.trim()) { setError("Please enter your project description."); return; }
    setError("");
    setIsLoading(true);
    try {
      const apiKey = process.env.REACT_APP_GROQ_API_KEY;
      const parsed = await parseSOW(sowText, apiKey);
      setArchitecture(parsed);
      setChatHistory([{ role: "assistant", content: "I have analyzed your project. " + (parsed.ambiguities?.length > 0 ? "I have a few clarifying questions before generating the diagram." : "Generating your diagram now!"), options: [] }]);
      setStep("chat");
    } catch (err) {
      setError("Analysis failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Describe your AWS infrastructure</h2>
        <p style={{ fontSize: 14, color: "#64748b" }}>Paste your SOW, project description, or customer transcript.</p>
      </div>
      <textarea rows={10} placeholder="e.g. We need a scalable web application on AWS with CloudFront, API Gateway, Lambda, RDS PostgreSQL, S3, and Cognito..." value={sowText} onChange={e => setSowText(e.target.value)} style={{ marginBottom: 12 }} />
      {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 12 }}>{error}</div>}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Or try an example:</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => setSowText(EXAMPLES.ecommerce)}>E-commerce platform</button>
          <button className="btn-secondary" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => setSowText(EXAMPLES.microservices)}>Microservices app</button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary" onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze & Continue ?"}
        </button>
      </div>
    </div>
  );
}
