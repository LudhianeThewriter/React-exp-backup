import React, { useEffect, useState, useContext, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase"; // your config file
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import SideBar from "./UserSideBar";
import { listenToExpenses, addExpense, deleteExpense } from "./FirebaseUtils";
import { toast } from "react-toastify";

import { ClipLoader } from "react-spinners";
import { useExpenses } from "./ExpenseContext";

const Dashboard = () => {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const { user, loading, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const { expenses } = useExpenses();
  console.log("Expenses in Dashboard : ", expenses);
  // Calculate Total Expenses for Current Month
  const currentMonth = new Date().toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });
  const totalExpense = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (!expenses || expenses.length == 0) return 0;
    return expenses
      .filter((exp) => exp.date.slice(0, 7) == currentMonth)
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  });

  // Initialize AOS + Set Date
  useEffect(() => {
    AOS.init({ duration: 1000 });
    const today = new Date();
    const formatted = today.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  //Redirect unauthenticate user
  useEffect(() => {
    if (!loading && !user) {
      navigate("/user");
    }
  }, [loading, user, navigate]);

  //Fetch firestore data once user is confirmed

  // Listen to Firestore expense updates

  // Delete Expenses
  const handleDelete = async (id) => {
    try {
      await deleteExpense(user.uid, id);

      toast.success("Deleted !");
    } catch (err) {
      toast.error("Failed to delete expense !");
    }
  };
  const analysisOptions = [
    {
      title: "Category-wise Analysis",
      description:
        "Analyze spending across different categories over a selected date range.",
      icon: "📂",
    },
    {
      title: "Month-wise Analysis",
      description: "Compare monthly spending trends and patterns.",
      icon: "📅",
    },
    {
      title: "Single Expense Analysis",
      description:
        "Dive deep into specific expense behavior within a date range.",
      icon: "🔍",
    },
    {
      title: "Compare with Budget",
      description:
        "View how your expenses align with set budgets per category.",
      icon: "📊",
    },
    {
      title: "Top 5 Expenses",
      description: "Quickly view your highest spending items.",
      icon: "🔥",
    },
    {
      title: "Recurring Expenses",
      description:
        "Identify and manage repeated expenses (subscriptions, rent, etc).",
      icon: "🔁",
    },
    {
      title: "Needs vs Wants",
      description:
        "Break down spending into essential and non-essential categories.",
      icon: "⚖️",
    },
    {
      title: "Previous vs Current Comparison",
      description: "Compare expenses over two different timeframes.",
      icon: "↔️",
    },
  ];

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div
      className="container-fluid px-0"
      style={{ minHeight: "100vh", overflow: "hidden" }}
    >
      <div className="row g-0" style={{ minHeight: "100vh" }}>
        {/* Sidebar/Profile */}
        <div className="col-md-3">
          <SideBar />
        </div>
        {/* Main Content */}
        <div className="col-md-9 p-4" style={{ overflowY: "auto" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Expense Dashboard</h3>
            <small className="text-muted">{currentDate}</small>
          </div>

          {/* Total Expense & Add Button */}
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h5>
              Total Expense (for {currentMonth && currentMonth}): ₹{" "}
              {totalExpense.toLocaleString("en-IN")}{" "}
            </h5>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/addExp")}
            >
              + Add Expense
            </button>
          </div>

          {/* Modern Analysis Cards */}
          <h4 className="mb-4">Smart Analysis Tools</h4>
          <div className="row g-4">
            {analysisOptions.map((option, index) => (
              <div
                className="col-md-6 col-lg-4"
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className="card p-3 shadow-sm border-0 h-100"
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="d-flex align-items-center mb-2"
                    onClick={() =>
                      navigate("/analysis", {
                        state: { type: option.title, expData: expenses },
                      })
                    }
                  >
                    <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                      {option.icon}
                    </span>
                    <h5 className="mb-0">{option.title}</h5>
                  </div>
                  <p className="text-muted small">{option.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Insight */}
          <h4 className="mt-5">Your Expenses (last 10 Days)</h4>

          <div className="card mt-3 shadow-sm" data-aos="fade-up">
            <div className="card-body p-0">
              {expenses.length === 0 ? (
                <p className="text-muted text-center p-4">
                  No expenses recorded yet.
                </p>
              ) : (
                <ul className="list-group list-group-flush">
                  {expenses.slice(-10).map((expense, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between  align-items-center expense-item"
                      style={{ cursor: "pointer" }}
                      data-bs-toggle="modal"
                      data-bs-target="#expenseModal"
                      onClick={() => setSelectedExpense(expense)}
                    >
                      <div>
                        <h6 className="mb-1 fw-semibold">{expense.category}</h6>
                        <small className="text-muted">
                          ₹{expense.amount} on {expense.date}
                        </small>
                        {expense.remarks && (
                          <div className="text-muted">
                            <small>{expense.remarks}</small>
                          </div>
                        )}
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(expense.id);
                        }}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <a href="https://wa.me/send?phone=917625945643" target="_blank">
        <img
          src="https://img.icons8.com/color/48/000000/whatsapp.png"
          alt="WhatsApp"
        />
        Chat with us
      </a>

      {/* Expense Details Modal */}
      <div
        className="modal fade"
        id="expenseModal"
        tabIndex="-1"
        aria-labelledby="expenseModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="expenseModalLabel">
                Expense Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedExpense ? (
                <>
                  <p>
                    <strong>Category:</strong> {selectedExpense.category}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{selectedExpense.amount}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedExpense.date}
                  </p>
                  {selectedExpense.remarks && (
                    <p>
                      <strong>Remarks:</strong> {selectedExpense.remarks}
                    </p>
                  )}
                </>
              ) : (
                <p>No expense selected.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/*-------- */}
    </div>
  );
};

export default Dashboard;
