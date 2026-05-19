export const initialState = {
  operations: [], // { id: string, type: 'R'|'W'|'C'|'A', transaction: 'T1', dataItem: 'X' }
  analysisResult: null, // from backend: { isSerializable, conflicts, nodes, edges, cyclePath }
  isQuizMode: false,
};

export function scheduleReducer(state, action) {
  switch (action.type) {
    case 'ADD_OPERATION':
      return {
        ...state,
        operations: [...state.operations, action.payload],
        analysisResult: null, // reset analysis when schedule changes
      };
    case 'REMOVE_OPERATION':
      return {
        ...state,
        operations: state.operations.filter(op => op.id !== action.payload),
        analysisResult: null,
      };
    case 'CLEAR_SCHEDULE':
      return {
        ...state,
        operations: [],
        analysisResult: null,
      };
    case 'SET_ANALYSIS_RESULT':
      return {
        ...state,
        analysisResult: action.payload,
      };
    case 'TOGGLE_MODE':
      return {
        ...state,
        isQuizMode: !state.isQuizMode,
      };
    case 'LOAD_SCHEDULE':
      return {
        ...state,
        operations: action.payload,
        analysisResult: null,
      };
    default:
      return state;
  }
}
