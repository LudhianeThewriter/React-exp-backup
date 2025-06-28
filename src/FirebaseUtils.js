import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";

//-- For Expenses

export const getExpensesRef = (userId) =>
  collection(db, "users", userId, "expenses");

export const listenToExpenses = (userId, callback) => {
  const q = query(getExpensesRef(userId), orderBy("date"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Real Time ", data);
    callback(data);
  });
};

export const addExpense = async (userId, expense) => {
  const docRef = await addDoc(getExpensesRef(userId), expense);
  return docRef.id;
};

export const deleteExpense = async (userId, expenseId) => {
  await deleteDoc(doc(db, "users", userId, "expenses", expenseId));
};

//----- For Budget

export const getBudgetRef = (userId) =>
  collection(db, "users", userId, "budget");

export const listenToBudget = (userId, callback) => {
  const q = query(getBudgetRef(userId));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Real Budget = ", data);
    callback(data);
  });
};

export const addBudget = async (userId, budget) => {
  const docRef = await addDoc(getBudgetRef(userId), budget);
  return docRef.id;
};

export const deleteBudget = async (userId, budgetId) => {
  await deleteDoc(doc(db, "users", userId, "budget", budgetId));
};
