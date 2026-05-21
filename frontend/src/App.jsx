import React, { useReducer, useState, useEffect } from "react";
import axios from "axios";
import { PlaneTakeoff, BrainCircuit } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { scheduleReducer, initialState } from "./store/scheduleReducer";
import ConflictList from "./components/ConflictList";
import Dashboard from "./pages/Dashboard";
import PrecedenceGraphPage from "./pages/PrecedenceGraphPage";
import QuizModePage from "./pages/QuizModePage";

const API_URL = "http://localhost:5000/api/schedules";

function App() {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  // Simulation playback state
  const [currentStep, setCurrentStep] = useState(0);

  // Reset timeline when operations change
  useEffect(() => {
    setCurrentStep(state.operations.length);
  }, [state.operations]);

  const handleAnalyze = async () => {
    if (state.operations.length === 0) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        operations: state.operations,
      });
      if (response.data.success) {
        dispatch({ type: "SET_ANALYSIS_RESULT", payload: response.data.data });
        // Auto-rewind to start the simulation from the beginning
        setCurrentStep(0);
        if (!response.data.data.isSerializable) {
          toast.error("Schedule is Not Conflict Serializable!", {
            icon: "⚠️",
            duration: 5000,
            style: {
              borderRadius: "8px",
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid var(--accent-danger)",
            },
          });
        }
      }
    } catch (error) {
      console.error("Error analyzing schedule:", error);
      alert("Failed to analyze schedule. Ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div>
        <Toaster position="top-right" />
        <header className="header">
          <h1>
            <PlaneTakeoff size={28} /> ReserveFlow Simulator
          </h1>
          <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/graph" className="btn btn-outline" style={{ textDecoration: "none" }}>
              View Precedence
            </Link>
            <Link
              to="/quiz"
              className="btn btn-outline"
              style={{
                textDecoration: "none",
                pointerEvents: state.operations.length === 0 ? "none" : "auto",
                opacity: state.operations.length === 0 ? 0.5 : 1,
              }}
            >
              <BrainCircuit size={16} style={{ marginRight: 8 }} /> Simulation Quiz
            </Link>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                state={state}
                dispatch={dispatch}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                onViewAnalysis={() => setIsConflictModalOpen(true)}
              />
            }
          />

          <Route
            path="/graph"
            element={
              <PrecedenceGraphPage analysisResult={state.analysisResult} />
            }
          />

          <Route
            path="/quiz"
            element={
              <QuizModePage
                operations={state.operations}
                analysisResult={state.analysisResult}
                onExit={() => dispatch({ type: "TOGGLE_MODE" })}
              />
            }
          />
        </Routes>

        {isConflictModalOpen && state.analysisResult && (
          <ConflictList
            analysisResult={state.analysisResult}
            onClose={() => setIsConflictModalOpen(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
