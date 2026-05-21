import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const ConflictList = ({ analysisResult, onClose }) => {
  if (!analysisResult) return null;

  const { conflicts, isSerializable } = analysisResult;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Analysis Results</h2>
          <button className="btn-outline" style={{ border: 'none', padding: '5px', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} color="var(--text-muted)" />
          </button>
        </div>
        
        <div style={{ padding: '20px', overflowY: 'auto' }}>

      <div style={{
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: isSerializable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        border: `1px solid ${isSerializable ? 'var(--accent-success)' : 'var(--accent-danger)'}`
      }}>
        {isSerializable ? (
          <CheckCircle color="var(--accent-success)" size={24} />
        ) : (
          <AlertCircle color="var(--accent-danger)" size={24} />
        )}
        <div>
          <h3 style={{ 
            color: isSerializable ? 'var(--accent-success)' : 'var(--accent-danger)',
            fontSize: '1.1rem',
            marginBottom: '4px'
          }}>
            {isSerializable ? 'Conflict Serializable' : 'Not Conflict Serializable'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isSerializable ? 'No cycles detected in the precedence graph.' : 'A cycle was detected in the precedence graph!'}
          </p>
        </div>
      </div>

      <h3 style={{ marginBottom: '10px', fontSize: '1rem', fontWeight: 600 }}>Detected Conflicts ({conflicts.length})</h3>
      
      {conflicts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No conflicts found in the schedule.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {conflicts.map((c, idx) => {
            let badgeClass = '';
            if (c.type === 'RW') badgeClass = 'badge-primary';
            else if (c.type === 'WR') badgeClass = 'badge-warning';
            else if (c.type === 'WW') badgeClass = 'badge-danger';

            return (
              <div key={idx} style={{
                background: 'var(--panel-bg)',
                padding: '10px 15px',
                borderRadius: '8px',
                borderLeft: `4px solid ${
                  c.type === 'RW' ? 'var(--accent-primary)' : 
                  c.type === 'WR' ? 'var(--accent-warning)' : 'var(--accent-danger)'
                }`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontWeight: 600, marginRight: '10px' }}>
                    {c.from.type}{c.from.transaction.replace('T', '')}({c.from.dataItem}) 
                    <span style={{ margin: '0 5px', color: 'var(--text-muted)' }}>→</span> 
                    {c.to.type}{c.to.transaction.replace('T', '')}({c.to.dataItem})
                  </span>
                </div>
                <span className={`badge ${badgeClass}`}>{c.type}</span>
              </div>
            );
          })}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default ConflictList;
