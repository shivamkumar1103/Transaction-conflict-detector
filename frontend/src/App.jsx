import React, { useReducer, useState } from 'react';
import axios from 'axios';
import { Network, BrainCircuit } from 'lucide-react';
import { scheduleReducer, initialState } from './store/scheduleReducer';
import TransactionInput from './components/TransactionInput';
import ScheduleTimeline from './components/ScheduleTimeline';
import ConflictList from './components/ConflictList';
import PrecedenceGraph from './components/PrecedenceGraph';
import QuizMode from './components/QuizMode';

const API_URL = 'http://localhost:5000/api/schedules';

function App() {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (state.operations.length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        operations: state.operations
      });
      if (response.data.success) {
        dispatch({ type: 'SET_ANALYSIS_RESULT', payload: response.data.data });
      }
    } catch (error) {
      console.error('Error analyzing schedule:', error);
      alert('Failed to analyze schedule. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="header">
        <h1><Network size={28} /> TxnFlow</h1>
        <button 
          className="btn btn-outline"
          onClick={() => dispatch({ type: 'TOGGLE_MODE' })}
          disabled={state.operations.length === 0 && !state.isQuizMode}
        >
          <BrainCircuit size={18} /> 
          {state.isQuizMode ? 'Exit Quiz Mode' : 'Quiz Mode'}
        </button>
      </header>

      {state.isQuizMode ? (
        <div style={{ padding: '20px 40px' }}>
          <QuizMode 
            operations={state.operations}
            analysisResult={state.analysisResult}
            onExit={() => dispatch({ type: 'TOGGLE_MODE' })}
          />
        </div>
      ) : (
        <main className="main-layout">
          <aside className="sidebar">
            <TransactionInput 
              operations={state.operations} 
              dispatch={dispatch} 
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
            <ConflictList analysisResult={state.analysisResult} />
          </aside>
          
          <section className="content-area">
            <ScheduleTimeline operations={state.operations} />
            <PrecedenceGraph analysisResult={state.analysisResult} />
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
