import React from "react";
import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import TransactionInput from "../components/TransactionInput";
import ScheduleTimeline from "../components/ScheduleTimeline";
import SeatMap from "../components/SeatMap";

function Dashboard({
  state,
  dispatch,
  onAnalyze,
  isLoading,
  currentStep,
  setCurrentStep,
  onViewAnalysis,
}) {
  return (
    <>
      <main className="main-layout">
        <aside className="sidebar">
          <TransactionInput
            operations={state.operations}
            dispatch={dispatch}
            onAnalyze={onAnalyze}
            isLoading={isLoading}
          />
          {state.analysisResult && (
            <div
              className="glass-panel"
              style={{ padding: "20px", textAlign: "center" }}
            >
              <h3 style={{ marginBottom: "10px", fontSize: "1.1rem" }}>
                Analysis Complete
              </h3>
              <button
                className="btn"
                style={{ width: "100%" }}
                onClick={onViewAnalysis}
              >
                View Analysis Results
              </button>
            </div>
          )}
        </aside>

        <section className="content-area">
          <div className="grid-seatmap">
            <SeatMap
              operations={state.operations}
              currentStep={currentStep}
              analysisResult={state.analysisResult}
            />
          </div>
          <div className="grid-timeline">
            <ScheduleTimeline
              operations={state.operations}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;
