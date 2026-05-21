import React from "react";
import { Link } from "react-router-dom";
import PrecedenceGraph from "../components/PrecedenceGraph";

function PrecedenceGraphPage({ analysisResult }) {
  return (
    <div style={{ padding: "24px 40px", height: "calc(100vh - 80px)" }}>
      <div
        className="glass-panel"
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ margin: 0 }}>Precedence Graph</h2>
          <Link
            to="/"
            className="btn btn-outline"
            style={{ textDecoration: "none" }}
          >
            ← Back to Dashboard
          </Link>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <PrecedenceGraph analysisResult={analysisResult} />
        </div>
      </div>
    </div>
  );
}

export default PrecedenceGraphPage;
