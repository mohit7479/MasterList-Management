import React, { createContext, useContext, useReducer } from "react";

const initialState = {
  items: [],
  boms: [],
  processes: [],
  processSteps: [],
  user: null,
};

const AppContext = createContext(undefined);

const appReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    case "ADD_BOM":
      return { ...state, boms: [...state.boms, action.payload] };
    case "ADD_PROCESS":
      return { ...state, processes: [...state.processes, action.payload] };
    case "ADD_PROCESS_STEP":
      return {
        ...state,
        processSteps: [...state.processSteps, action.payload],
      };
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
