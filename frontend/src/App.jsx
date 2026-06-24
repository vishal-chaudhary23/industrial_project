import { useState } from "react";
import axios from "axios";
import "./App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleChat = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        query,
      });

      setResponse(res.data);
    } catch (err) {
      console.error(err);
      alert("Chat request failed");
    }

    setLoading(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/upload`, formData);

      alert("Document uploaded successfully");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Industrial AI</h2>

        <div className="card">
          <h3>Upload Document</h3>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={handleUpload}>
            Upload
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="header">
          <h1>
            Industrial Knowledge Intelligence Platform
          </h1>

          <p>
            GraphRAG + Neo4j + Agentic AI
          </p>
        </div>

        <div className="chat-card">
          <textarea
            placeholder="Ask about equipment, maintenance, RCA, compliance..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button onClick={handleChat}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>

        {response && (
          <>
            <div className="metrics">
              <div className="metric-card">
                <h4>Retrieval Confidence</h4>
                <p>
                  {response.retrieval_confidence}%
                </p>
              </div>

              {response.risk_score && (
                <div className="metric-card danger">
                  <h4>Risk</h4>

                  <p>
                    {response.risk_level}
                  </p>

                  <span>
                    {response.risk_score}/100
                  </span>
                </div>
              )}
            </div>

            <div className="card">
              <h3>Agents Used</h3>

              <div className="badges">
                {response.agents_used?.map((agent) => (
                  <span
                    key={agent}
                    className="badge"
                  >
                    {agent}
                  </span>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Answer</h3>

             <div className="answer">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {response.answer}
              </ReactMarkdown>
            </div>
            </div>

            <div className="card">
              <h3>Sources</h3>

              {response.sources?.map((source, idx) => (
                <div key={idx}>
                  📄 {source.document}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}