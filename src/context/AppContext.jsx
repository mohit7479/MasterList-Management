import React, { createContext, useContext, useReducer } from "react";

// Define action types for consistency
const actionTypes = {
  ADD_ITEM: "ADD_ITEM",
  ADD_BOM: "ADD_BOM",
  ADD_PROCESS: "ADD_PROCESS",
  ADD_PROCESS_STEP: "ADD_PROCESS_STEP",
  SET_USER: "SET_USER",
  RESET_STATE: "RESET_STATE",
  ADD_LOG: "ADD_LOG", // New action for adding logs
};

// Initial state
const initialState = {
  items: [],
  boms: [],
  processes: [],
  processSteps: [],
  user: null,
  logs: [], // Logs to track audit events
};

// Context
const AppContext = createContext(undefined);

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
        logs: [
          ...state.logs,
          {
            timestamp: new Date().toLocaleString(),
            user: state.user ? state.user.name : "Guest",
            action: "Created",
            details: `Added new item: ${action.payload.name}`,
          },
        ],
      };
    case actionTypes.ADD_BOM:
      return {
        ...state,
        boms: [...state.boms, action.payload],
        logs: [
          ...state.logs,
          {
            timestamp: new Date().toLocaleString(),
            user: state.user ? state.user.name : "Guest",
            action: "Created",
            details: `Added new BOM: ${action.payload.name}`,
          },
        ],
      };
    case actionTypes.ADD_PROCESS:
      return {
        ...state,
        processes: [...state.processes, action.payload],
        logs: [
          ...state.logs,
          {
            timestamp: new Date().toLocaleString(),
            user: state.user ? state.user.name : "Guest",
            action: "Created",
            details: `Added new process: ${action.payload.name}`,
          },
        ],
      };
    case actionTypes.ADD_PROCESS_STEP:
      return {
        ...state,
        processSteps: [...state.processSteps, action.payload],
        logs: [
          ...state.logs,
          {
            timestamp: new Date().toLocaleString(),
            user: state.user ? state.user.name : "Guest",
            action: "Created",
            details: `Added new process step: ${action.payload.name}`,
          },
        ],
      };
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    case actionTypes.RESET_STATE:
      return initialState; // Reset to the initial state
    case actionTypes.ADD_LOG:
      return {
        ...state,
        logs: [...state.logs, action.payload],
      };
    default:
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
  }
};

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Debugging utility: log actions
  const loggingDispatch = (action) => {
    console.log("Dispatching action:", action);
    dispatch(action);
  };

  return (
    <AppContext.Provider value={{ state, dispatch: loggingDispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Utility for Action Types Export (Optional)
export const ACTION_TYPES = actionTypes;
