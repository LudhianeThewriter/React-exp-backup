import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./DashBoard";
import LandingPage from "./Home";
import UserReg from "./UserReg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { AuthProvider } from "./AuthContext";
import { BudgetProvider } from "./BudgetContext";
import { ExpenseProvider } from "./ExpenseContext";
import { AnalysisBot } from "./Analysis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Budget from "./Budget";
import MonthlyReport from "./MonthlyReport";

//import AddExpenseForm from "./AddNewExpense";
import AddNew from "./AddNewExpense";
import AdminDashboardPage from "./Adminpanel";
export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <BudgetProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/user" element={<UserReg />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/analysis" element={<AnalysisBot />} />

              <Route path="/addExp" element={<AddNew />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/report" element={<MonthlyReport />} />

              <Route path="/adminpanel" element={<AdminDashboardPage />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
          </BrowserRouter>
        </BudgetProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}
