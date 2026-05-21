import React from "react";
import { Link } from "react-router-dom";
import QuizMode from "../components/QuizMode";

function QuizModePage({ operations, analysisResult, onExit }) {
  return (
    <div style={{ padding: "24px 40px" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Simulation Quiz</h2>
        <Link
          to="/"
          className="btn btn-outline"
          style={{ textDecoration: "none" }}
          onClick={onExit}
        >
          Exit Training
        </Link>
      </div>
      <QuizMode
        operations={operations}
        analysisResult={analysisResult}
        onExit={onExit}
      />
    </div>
  );
}

export default QuizModePage;
