import React, { useState, useEffect } from "react";
import { buildDrawioXML } from "../../agents/diagramBuilder";

export default function DiagramCanvas({ architecture }) {
  const [xml, setXml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (architecture && !generated) { generateDiagram(); }
  }, [architecture]);

  const generateDiagram = async () => {
    setLoading(true);
    setError("");
    try {
      const apiKey = process.env.REACT_APP_GROQ_API_KEY;
      const result = await buildDrawioXML(architecture, apiKey);
      setXml(result);
      setGenerated(true);
    } catch (err) {
      setError("Failed to generate diagram: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // const openInDrawio = () => {
  //   if (!xml) return;
  //   const encoded = encodeURIComponent(xml);
  //   window.open("https://app.diagrams.net/?src=about#" + encoded, "_blank");
  // };

  const openInDrawio = () => {
    if (!xml) return;
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aws-architecture.drawio";
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => {
      window.open("https://app.diagrams.net/", "_blank");
    }, 1000);
  };

  const downloadXML = () => {
    if (!xml) return;
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aws-architecture.drawio";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyXML = () => {
    navigator.clipboard.writeText(xml);
    alert("XML copied to clipboard! You can paste it at diagrams.net");
  };

  if (!architecture) return (
    <div className="card" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#94a3b8" }}>No architecture data yet.</p>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
      {loading && (
        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 16 }}>
          <div style={{ width: 48, height: 48, border: "3px solid #e2e8f0", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#64748b", fontSize: 14 }}>Generating your professional draw.io diagram...</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
          <p style={{ color: "#dc2626", fontSize: 14 }}>{error}</p>
          <button className="btn-primary" style={{ marginTop: 12 }} onClick={generateDiagram}>Retry</button>
        </div>
      )}

      {xml && !loading && (
        <>
          <div className="card" style={{ background: "linear-gradient(135deg, #667eea20, #764ba220)", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Diagram ready � {architecture.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b" }}>
                  Your professional AWS architecture diagram has been generated with official draw.io AWS icons.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={copyXML}>Copy XML</button>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={downloadXML}>Download .drawio</button>
                <button className="btn-primary" style={{ fontSize: 13, padding: "10px 20px" }} onClick={openInDrawio}>
                  Open in draw.io ?
                </button>
              </div>
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>Services identified</h3>
              <button className="btn-secondary" style={{ fontSize: 12, padding: "4px 12px" }} onClick={generateDiagram}>Regenerate</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {(architecture.services || []).map((svc, i) => {
                const colors = {
                  compute: "#ED7100", storage: "#3F8624", database: "#C7131F",
                  network: "#8C4FFF", security: "#DD344C", messaging: "#E7157B",
                  analytics: "#8C4FFF", migration: "#3F8624", monitoring: "#E7157B",
                  ai: "#01A88D", general: "#232F3E"
                };
                const color = colors[svc.type] || "#232F3E";
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: color + "15", border: "1px solid " + color + "40", borderRadius: 6, padding: "4px 10px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#1a1a2e" }}>{svc.name}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Generated draw.io XML</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{xml.length} characters</span>
              </div>
              <pre style={{ fontSize: 11, color: "#475569", overflow: "auto", maxHeight: 200, margin: 0, lineHeight: 1.5 }}>
                {xml.substring(0, 500)}...
              </pre>
            </div>

            <div style={{ marginTop: 16, padding: 16, background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe" }}>
              <p style={{ fontSize: 13, color: "#1d4ed8", fontWeight: 500, marginBottom: 4 }}>How to use your diagram:</p>
              <ol style={{ fontSize: 13, color: "#3730a3", paddingLeft: 16, lineHeight: 2 }}>
                <li>Click <strong>Open in draw.io</strong> to view and edit the full diagram</li>
                <li>Or click <strong>Download .drawio</strong> and open at <a href="https://app.diagrams.net" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>diagrams.net</a></li>
                <li>Export as PNG, SVG or PDF from draw.io</li>
                <li>Share with your team or add to your SOW document</li>
              </ol>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
