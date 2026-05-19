import { useState } from 'react';
import { Plus, Trash2, Play } from 'lucide-react';

const TransactionInput = ({ operations, dispatch, onAnalyze, isLoading }) => {
  const [transaction, setTransaction] = useState('T1');
  const [opType, setOpType] = useState('R');
  const [dataItem, setDataItem] = useState('X');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!transaction) return;
    
    // For Commit and Abort, dataItem is not needed
    const finalDataItem = (opType === 'C' || opType === 'A') ? '' : dataItem;
    
    dispatch({
      type: 'ADD_OPERATION',
      payload: {
        id: Math.random().toString(36).substring(7),
        transaction: transaction.trim().toUpperCase(),
        type: opType,
        dataItem: finalDataItem.trim().toUpperCase()
      }
    });
  };

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '15px', fontSize: '1.2rem', fontWeight: 600 }}>Schedule Input</h2>
      
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '15px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Txn (e.g., T1)" 
          value={transaction}
          onChange={(e) => setTransaction(e.target.value)}
          style={{ width: '100px' }}
          required
        />
        <select value={opType} onChange={(e) => setOpType(e.target.value)}>
          <option value="R">Read</option>
          <option value="W">Write</option>
          <option value="C">Commit</option>
          <option value="A">Abort</option>
        </select>
        {(opType === 'R' || opType === 'W') && (
          <input 
            type="text" 
            placeholder="Data (e.g., X)" 
            value={dataItem}
            onChange={(e) => setDataItem(e.target.value)}
            style={{ width: '100px' }}
            required={opType === 'R' || opType === 'W'}
          />
        )}
        <button type="submit" className="btn">
          <Plus size={18} /> Add
        </button>
      </form>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {operations.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No operations added yet.</span>}
        {operations.map((op, idx) => (
          <div key={op.id} style={{
            background: 'var(--panel-bg)',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{idx + 1}.</span>
            <span>
              {op.type === 'C' || op.type === 'A' ? 
                `${op.type}(${op.transaction})` : 
                `${op.type}${op.transaction.replace('T', '')}(${op.dataItem})`}
            </span>
            <button 
              onClick={() => dispatch({ type: 'REMOVE_OPERATION', payload: op.id })}
              style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', display: 'flex' }}
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
          className="btn" 
          onClick={onAnalyze}
          disabled={operations.length === 0 || isLoading}
        >
          {isLoading ? 'Analyzing...' : <><Play size={18} /> Analyze Schedule</>}
        </button>
      </div>
    </div>
  );
};

export default TransactionInput;
