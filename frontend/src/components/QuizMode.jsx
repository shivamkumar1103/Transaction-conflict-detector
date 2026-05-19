import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import ScheduleTimeline from './ScheduleTimeline';

const QuizMode = ({ operations, analysisResult, onExit }) => {
  const [step, setStep] = useState(0); // 0: conflicts question, 1: serializability question, 2: results
  const [selectedConflicts, setSelectedConflicts] = useState({ RW: false, WR: false, WW: false });
  const [selectedSerializable, setSelectedSerializable] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  if (!analysisResult) {
    return (
      <div className="glass-panel flex-center" style={{ height: '100%', flexDirection: 'column', gap: '20px' }}>
        <HelpCircle size={48} color="var(--accent-primary)" />
        <h2>Quiz Mode requires an analyzed schedule.</h2>
        <button className="btn" onClick={onExit}>Back to Visualizer</button>
      </div>
    );
  }

  const { conflicts, isSerializable } = analysisResult;
  const actualConflicts = {
    RW: conflicts.some(c => c.type === 'RW'),
    WR: conflicts.some(c => c.type === 'WR'),
    WW: conflicts.some(c => c.type === 'WW'),
  };

  const handleConflictSubmit = () => {
    let correct = true;
    if (selectedConflicts.RW !== actualConflicts.RW) correct = false;
    if (selectedConflicts.WR !== actualConflicts.WR) correct = false;
    if (selectedConflicts.WW !== actualConflicts.WW) correct = false;

    if (correct) {
      setScore(s => s + 1);
      setFeedback({ type: 'success', text: 'Correct! You successfully identified the conflict types.' });
    } else {
      setFeedback({ type: 'error', text: 'Incorrect. Please check the actual conflicts.' });
    }
    setTimeout(() => {
      setFeedback(null);
      setStep(1);
    }, 2500);
  };

  const handleSerializabilitySubmit = (choice) => {
    setSelectedSerializable(choice);
    const correct = choice === isSerializable;
    if (correct) {
      setScore(s => s + 1);
      setFeedback({ type: 'success', text: 'Correct! Great job.' });
    } else {
      setFeedback({ type: 'error', text: 'Incorrect. Remember to check for cycles in the precedence graph.' });
    }
    setTimeout(() => {
      setFeedback(null);
      setStep(2);
    }, 2500);
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Quiz Mode</h2>
        <button className="btn btn-outline" onClick={onExit}>Exit Quiz</button>
      </div>
      
      <ScheduleTimeline operations={operations} />

      <div style={{ marginTop: '30px', background: 'var(--panel-bg)', padding: '20px', borderRadius: '8px' }}>
        {feedback && (
          <div style={{
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: feedback.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)'
          }}>
            {feedback.type === 'success' ? <CheckCircle /> : <XCircle />}
            <span style={{ fontWeight: 600 }}>{feedback.text}</span>
          </div>
        )}

        {step === 0 && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Question 1: What types of conflicts are present in this schedule?</h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedConflicts.RW} onChange={e => setSelectedConflicts({...selectedConflicts, RW: e.target.checked})} />
                Read-Write (RW)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedConflicts.WR} onChange={e => setSelectedConflicts({...selectedConflicts, WR: e.target.checked})} />
                Write-Read (WR)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedConflicts.WW} onChange={e => setSelectedConflicts({...selectedConflicts, WW: e.target.checked})} />
                Write-Write (WW)
              </label>
            </div>
            <button className="btn" onClick={handleConflictSubmit} disabled={feedback !== null}>
              Submit <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Question 2: Is this schedule Conflict Serializable?</h3>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button className={`btn ${selectedSerializable === true ? '' : 'btn-outline'}`} onClick={() => handleSerializabilitySubmit(true)} disabled={feedback !== null}>
                Yes, it is Serializable
              </button>
              <button className={`btn ${selectedSerializable === false ? '' : 'btn-outline'}`} onClick={() => handleSerializabilitySubmit(false)} disabled={feedback !== null}>
                No, it is Non-Serializable
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-center" style={{ flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent-primary)' }}>Quiz Complete!</h2>
            <div style={{ fontSize: '1.2rem' }}>Your Score: <strong>{score} / 2</strong></div>
            <button className="btn" onClick={onExit}>Back to Visualizer</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
