import React, { useMemo } from 'react';

const SeatMap = ({ operations, currentStep, analysisResult }) => {
  // Collect all unique seats from operations
  const seats = useMemo(() => {
    const seatSet = new Set();
    operations.forEach(op => {
      if (op.dataItem) seatSet.add(op.dataItem);
    });
    // Add default seats if none found
    if (seatSet.size === 0) {
      ['S1', 'S2', 'S3', 'S4', 'S5'].forEach(s => seatSet.add(s));
    }
    return Array.from(seatSet).sort();
  }, [operations]);

  // Compute status for each seat up to the currentStep
  const seatStatus = useMemo(() => {
    const status = {};
    seats.forEach(s => status[s] = { state: 'available', users: [] });

    for (let i = 0; i < currentStep; i++) {
      const op = operations[i];
      if (!op || !op.dataItem) continue;

      const seatId = op.dataItem;
      const user = op.transaction;

      if (op.type === 'R') {
        // If not booked or conflicted, mark as pending (someone is looking at it)
        if (status[seatId].state !== 'booked' && status[seatId].state !== 'conflict') {
          status[seatId].state = 'pending';
          if (!status[seatId].users.includes(user)) {
             status[seatId].users.push(user);
          }
        }
      } else if (op.type === 'W') {
        // Book it
        if (status[seatId].state === 'booked') {
           // Double booking conflict!
           status[seatId].state = 'conflict';
           if (!status[seatId].users.includes(user)) {
             status[seatId].users.push(user);
           }
        } else {
           status[seatId].state = 'booked';
           status[seatId].users = [user]; // Booked by this user
        }
      }
    }
    
    // Check for conflicts from analysisResult just in case we are at the end
    // (This ensures cycle conflicts are also visibly highlighted if we reached the end of the timeline)
    if (currentStep === operations.length && analysisResult && !analysisResult.isSerializable) {
       // if we want to show global conflicts, maybe red border around the whole map.
    }

    return status;
  }, [operations, currentStep, seats, analysisResult]);

  return (
    <div className="glass-panel" style={{ marginBottom: '20px' }}>
      <div className="flex-between" style={{ marginBottom: '15px' }}>
         <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Seat Map (Real-Time)</h2>
         <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
               <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-success)' }} /> Available
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
               <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-warning)' }} /> Pending
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
               <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)' }} /> Booked
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
               <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-danger)' }} /> Conflict
            </span>
         </div>
      </div>

      <div className="seat-grid">
        {seats.map(seatId => {
          const { state, users } = seatStatus[seatId];
          return (
            <div key={seatId} className={`seat ${state}`} title={users.length > 0 ? `Users: ${users.join(', ')}` : 'Empty'}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>{seatId}</span>
                {users.length > 0 && (
                   <span style={{ fontSize: '0.65rem', fontWeight: 'normal', marginTop: '2px', opacity: 0.8 }}>
                     {users.join(',')}
                   </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeatMap;
