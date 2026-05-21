import React, { useEffect } from 'react';
import { Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

const ScheduleTimeline = ({ operations, currentStep, setCurrentStep }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < operations.length) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000);
    } else if (currentStep >= operations.length) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, operations.length, setCurrentStep]);

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex-between" style={{ marginBottom: '15px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Simulation Timeline</h2>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-outline" 
            style={{ padding: '6px 10px' }}
            onClick={() => setCurrentStep(0)}
            disabled={currentStep === 0}
            title="Rewind"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            className="btn btn-outline" 
            style={{ padding: '6px 10px' }}
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            <StepBack size={16} />
          </button>
          <button 
            className="btn btn-primary" 
            style={{ padding: '6px 16px', minWidth: '80px' }}
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep === operations.length && !isPlaying}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            className="btn btn-outline" 
            style={{ padding: '6px 10px' }}
            onClick={() => setCurrentStep(prev => Math.min(operations.length, prev + 1))}
            disabled={currentStep === operations.length}
          >
            <StepForward size={16} />
          </button>
        </div>
      </div>
      
      {operations.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>Generate random load to see the timeline.</p>
      ) : (
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          overflowX: 'auto', 
          padding: '10px 0',
          position: 'relative',
          scrollBehavior: 'smooth'
        }}>
          {operations.map((op, idx) => {
            const isPast = idx < currentStep;
            const isCurrent = idx === currentStep - 1;
            
            return (
              <div key={op.id} style={{ display: 'flex', alignItems: 'center', opacity: isPast ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                <div style={{
                  background: isCurrent ? 'var(--accent-primary)' : 'var(--panel-bg)',
                  color: isCurrent ? '#fff' : 'var(--text-main)',
                  border: `2px solid ${isPast ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  borderRadius: '10px',
                  minWidth: '80px',
                  padding: '10px',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow: isCurrent ? 'var(--shadow-glow)' : '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '4px' }}>T={idx + 1}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {op.type === 'R' ? 'Chk' : 'Book'}
                    ({op.dataItem})
                  </div>
                  <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>{op.transaction}</div>
                </div>
                {idx < operations.length - 1 && (
                  <div style={{ 
                    width: '30px', 
                    height: '2px', 
                    background: idx < currentStep - 1 ? 'var(--accent-primary)' : 'var(--border-color)', 
                    zIndex: 1,
                    transition: 'background 0.3s'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScheduleTimeline;
