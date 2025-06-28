import { createContext, useContext, useEffect, useState } from "react";
import { listenToBudget } from "./FirebaseUtils";
import { AuthContext } from "./AuthContext";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [budgetData, setBudgetData] = useState([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = listenToBudget(user.uid, setBudgetData);
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <BudgetContext.Provider value={{ budgetData }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetData = () => useContext(BudgetContext);
