import React from 'react';

const ScheduleTimeline = ({ operations }) => {
  return (
    <div className="glass-panel" style={{ marginBottom: '20px' }}>
      <h2 style={{ marginBottom: '15px', fontSize: '1.2rem', fontWeight: 600 }}>Execution Timeline</h2>
      
      {operations.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>Timeline is empty.</p>
      ) : (
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          overflowX: 'auto', 
          padding: '10px 0',
          position: 'relative'
        }}>
          {operations.map((op, idx) => (
            <div key={op.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                background: 'var(--panel-bg)',
                border: '2px solid var(--accent-primary)',
                borderRadius: '8px',
                minWidth: '80px',
                padding: '10px',
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Time {idx + 1}</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {op.type === 'C' || op.type === 'A' ? 
                    `${op.type}(${op.transaction.replace('T', '')})` : 
                    `${op.type}${op.transaction.replace('T', '')}(${op.dataItem})`}
                </div>
              </div>
              {idx < operations.length - 1 && (
                <div style={{ width: '30px', height: '2px', background: 'var(--border-color)', zIndex: 1 }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleTimeline;
