import { useState } from 'react';
import { Play, Shuffle, Trash2 } from 'lucide-react';

const TransactionInput = ({ operations, dispatch, onAnalyze, isLoading }) => {
  const handleGenerateRandom = () => {
    dispatch({ type: 'CLEAR_SCHEDULE' });
    
    // Generate a random schedule of seat bookings
    const users = ['U1', 'U2', 'U3', 'U4'];
    const seats = ['S1', 'S2', 'S3', 'S4', 'S5'];
    
    const newOps = [];
    const numOps = Math.floor(Math.random() * 8) + 5; // 5 to 12 ops
    
    for (let i = 0; i < numOps; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const seat = seats[Math.floor(Math.random() * seats.length)];
      
      // 70% chance to Check (Read), 30% chance to Book (Write)
      // Or if it's the first time they interact with a seat, usually Read first.
      const isBook = Math.random() > 0.6;
      
      newOps.push({
        id: Math.random().toString(36).substring(7),
        transaction: user,
        type: isBook ? 'W' : 'R',
        dataItem: seat
      });
    }

    newOps.forEach(op => {
      dispatch({ type: 'ADD_OPERATION', payload: op });
    });
  };

  return (
    <div className="glass-panel">
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Simulation Generator</h2>
        <button className="btn btn-outline" onClick={handleGenerateRandom}>
          <Shuffle size={16} /> Random Load
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {operations.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No operations simulated yet. Click Random Load.</span>}
        {operations.map((op, idx) => (
          <div key={op.id} style={{
            background: 'var(--bg-color)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{idx + 1}.</span>
            <span>
              {op.type === 'R' ? 'Check ' : 'Book '} 
              <strong style={{ color: op.type === 'W' ? 'var(--accent-success)' : 'var(--text-main)' }}>{op.dataItem}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '4px' }}>by {op.transaction}</span>
            </span>
            <button 
              onClick={() => dispatch({ type: 'REMOVE_OPERATION', payload: op.id })}
              style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', display: 'flex', marginLeft: '4px' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex-between" style={{ gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
        <button 
          className="btn btn-outline" 
          onClick={() => dispatch({ type: 'CLEAR_SCHEDULE' })}
          disabled={operations.length === 0}
        >
          Clear All
        </button>
        <button 
          className="btn btn-success" 
          onClick={onAnalyze}
          disabled={operations.length === 0 || isLoading}
          style={{ flex: 1 }}
        >
          {isLoading ? 'Analyzing Conflict Graph...' : <><Play size={18} /> Run Analysis Engine</>}
        </button>
      </div>
    </div>
  );
};

export default TransactionInput;
