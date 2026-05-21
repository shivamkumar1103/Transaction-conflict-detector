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
        <h2>Simulation Quiz requires an analyzed schedule.</h2>
        <button className="btn" onClick={onExit}>Back to Dashboard</button>
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
      setFeedback({ type: 'success', text: 'Spot on! You correctly identified the conflict types.' });
    } else {
      setFeedback({ type: 'error', text: 'Incorrect. Please review the timeline for conflicts.' });
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
      setFeedback({ type: 'success', text: 'Correct! Great job analyzing the schedule safety.' });
    } else {
      setFeedback({ type: 'error', text: 'Incorrect. Remember to check for cycle deadlocks in the precedence graph.' });
    }
    setTimeout(() => {
      setFeedback(null);
      setStep(2);
    }, 2500);
  };

  // Provide a static timeline step for the quiz view
  const currentStep = operations.length;

  return (
    <div className="glass-panel" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Reservation Safety Quiz</h2>
        <button className="btn btn-outline" onClick={onExit}>Exit Training</button>
      </div>
      
      <div style={{ pointerEvents: 'none', opacity: 0.9 }}>
         <ScheduleTimeline operations={operations} currentStep={currentStep} setCurrentStep={() => {}} />
      </div>

      <div style={{ marginTop: '30px', background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        {feedback && (
          <div style={{
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: feedback.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)',
            border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {feedback.type === 'success' ? <CheckCircle /> : <XCircle />}
            <span style={{ fontWeight: 600 }}>{feedback.text}</span>
          </div>
        )}

        {step === 0 && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Question 1: What types of booking conflicts occurred in this schedule?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', background: 'var(--panel-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input type="checkbox" checked={selectedConflicts.RW} onChange={e => setSelectedConflicts({...selectedConflicts, RW: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                <div>
                  <strong>Check-Book Conflict (RW)</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>User A checks a seat, User B books it before A can.</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', background: 'var(--panel-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input type="checkbox" checked={selectedConflicts.WR} onChange={e => setSelectedConflicts({...selectedConflicts, WR: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                <div>
                  <strong>Book-Check Conflict (WR)</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>User A books a seat, User B checks it (seeing a dirty/uncommitted booking).</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', background: 'var(--panel-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input type="checkbox" checked={selectedConflicts.WW} onChange={e => setSelectedConflicts({...selectedConflicts, WW: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                <div>
                  <strong>Double Booking (WW)</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>User A and User B both successfully book the exact same seat (Lost Update).</div>
                </div>
              </label>
            </div>
            <button className="btn btn-primary" onClick={handleConflictSubmit} disabled={feedback !== null}>
              Submit Answer <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Question 2: Is this reservation schedule completely safe (Serializable)?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
              A schedule is safe if it's equivalent to the users booking one after the other in isolation, with no cycles in the precedence graph.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button className={`btn ${selectedSerializable === true ? 'btn-success' : 'btn-outline'}`} onClick={() => handleSerializabilitySubmit(true)} disabled={feedback !== null}>
                Yes, it is Safe (Serializable)
              </button>
              <button className={`btn ${selectedSerializable === false ? 'btn-danger' : 'btn-outline'}`} onClick={() => handleSerializabilitySubmit(false)} disabled={feedback !== null}>
                No, it is Unsafe (Has Cycles)
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-center" style={{ flexDirection: 'column', gap: '15px', padding: '20px 0' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent-primary)', textShadow: 'var(--shadow-glow)' }}>Training Complete!</h2>
            <div style={{ fontSize: '1.2rem' }}>Your Score: <strong>{score} / 2</strong></div>
            <button className="btn" onClick={onExit} style={{ marginTop: '20px' }}>Back to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
