// centralised expense state
import { createContext, useContext, useState, useEffect } from "react";
import { listenToExpenses } from "./FirebaseUtils";
import { AuthContext } from "./AuthContext";

export const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = listenToExpenses(user.uid, setExpenses);

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <ExpenseContext.Provider value={{ expenses }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
