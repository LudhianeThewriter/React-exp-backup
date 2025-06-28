import React, { useState, useEffect, useContext } from "react";
import SideBar from "./UserSideBar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { addBudget, listenToBudget, deleteBudget } from "./FirebaseUtils";
import { useBudgetData } from "./BudgetContext";
import { useExpenses } from "./ExpenseContext";
import { filterBudgetData } from "./MonthUtility";
const categories = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Taxes",
  "Charity / Donations",
  "Dining Out",
  "Travel & Vacation",
  "Events",
  "Household Supplies",
  "Maid / Domestic Help",
  "Repairs & Maintenance",
  "Kids' Expenses",
  "Pet Expenses",
  "Conveyance Expense",
  "Renewal & Recharges",
  "Others",
];

export default function BudgetDashboard() {
  const { user, loading, userInfo } = useContext(AuthContext);
  const { expenses } = useExpenses();
  const [fmonth, setFmonth] = useState(new Date().toISOString().slice(0, 7));
  const { budgetData } = useBudgetData();
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [budgetFormData, setBudgetFormData] = useState({
    category: categories[0],
    month: "",
    budget: "",
  });
  console.log("Expenses ", expenses);
  const navigate = useNavigate();

  useEffect(() => {
    let result = filterBudgetData(fmonth, budgetData, expenses);
    setFilterData(result);
  }, [fmonth, budgetData, expenses]);

  // Redirect to user page if not login

  useEffect(() => {
    if (!loading && !user) {
      navigate("/user");
    }
  }, [user, loading, navigate]);
  // Filtered data according to filterMode

  // Group by expense head for the summary sliders on top (only current month)
  function formatDate(date) {
    return new Date(date).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
  }
  // Handle budget form submit
  async function handleBudgetSubmit(e) {
    e.preventDefault();
    setFormError("");
    const { category, month, budget } = budgetFormData;

    // Validate Budget amount
    if (!budget || budget <= 0) {
      setFormError("Please enter a valid budget amount");
      return;
    }

    // Validate future month
    const selectedDate = month;
    const todayDate = new Date().toISOString().slice(0, 7);

    console.log("Selected : ", selectedDate);
    console.log("Today : ", todayDate);

    if (selectedDate < todayDate) {
      setFormError("You can set budget only for future months, not for past");
      return;
    }

    const duplicate = budgetData.find(
      (entry) => entry.category == category && entry.month == month
    );

    if (duplicate) {
      setFormError(
        "You can set budget for a particular expense head only once per month."
      );
      return;
    }
    // Db Operation
    console.log("Budget Data before : ", budgetData);
    try {
      await addBudget(user.uid, budgetFormData);
      toast.success(`Budget added for ${category} for ${month}`);
      setBudgetFormData({
        category: categories[0],
        month: "",
        budget: "",
      });
      console.log("Budget Data after : ", budgetData);
    } catch (error) {
      //console.log("Not add budget ", error);
      toast.error("Fail to add Budget ");
    }
  }

  // Calculate slider color based on actual / budget ratio
  function getSliderColor(actual, budget) {
    if (!budget) return "#ccc"; // no budget grey
    const ratio = (actual / budget) * 100;
    if (ratio <= 75) return "#28a745"; // green
    if (ratio <= 95) return "#ffc107"; // yellow
    return "#dc3545"; // red
  }

  //Delete Budget

  const handleBudgetDelete = async (index) => {
    try {
      const { id } = filterData[index];
      await deleteBudget(user.uid, id);
      toast.success("Budget Deleted");
    } catch (error) {
      toast.error("Fail to delete budget !");
    }
  };

  return (
    <div className="container-fluid p-0 ">
      <div className="row g-0" style={{ minHeight: "100vh", padding: 0 }}>
        <div className="col-md-3 ">
          <SideBar />
        </div>
        <div className="col-md-9 py-4">
          <h2 className="mb-4">📊 Budget Dashboard</h2>

          {/* Expense heads sliders summary for current month */}
          <div className="mb-4">
            <h5>Budget Usage -{formatDate(fmonth)}</h5>
            <div className="d-flex flex-wrap gap-3">
              {filterData.map(({ category, budget, id, month, actual }) => (
                <div
                  key={id}
                  className="p-3 border rounded"
                  style={{
                    width: "220px",
                    boxShadow: "0 2px 6px rgb(0 0 0 / 0.1)",
                  }}
                >
                  <h6>
                    {category} for {formatDate(month)}
                  </h6>
                  <p className="mb-1">
                    Budget: ₹
                    {budget ?? <span className="text-danger">Not set</span>}
                  </p>
                  <p className="mb-2">Actual: ₹ {actual}</p>
                  <input
                    type="range"
                    min={0}
                    max={budget ?? 100}
                    value={budget ? Math.min(actual ?? 0, budget) : 0}
                    readOnly
                    style={{
                      width: "100%",
                      accentColor: getSliderColor(actual, budget),
                      cursor: "default",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Filter options */}
          <div className="d-flex align-items-center mb-3 gap-3 flex-wrap">
            <input
              type="month"
              name="fmonth"
              value={fmonth}
              className="form-control"
              onChange={(e) => setFmonth(e.target.value)}
              onChange={(e) => setFmonth(e.target.value)}
            />
          </div>
          {fmonth}
          {/* Expenses Table */}
          <div
            className="table-responsive mb-3"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Expense Head</th>
                  <th>Month</th>
                  <th>Budget (₹)</th>
                  <th>Actual (₹)</th>
                  <th>Option</th>
                </tr>
              </thead>
              <tbody>
                {filterData.map((budgetEntry, index) => (
                  <tr>
                    <td>{budgetEntry.category}</td>
                    <td>{formatDate(budgetEntry.month)}</td>

                    <td>
                      ₹
                      {budgetEntry.budget ?? (
                        <span className="text-danger">Not set</span>
                      )}
                    </td>
                    <td>
                      ₹
                      {budgetEntry.actual ?? (
                        <span className="text-danger">Not set</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBudgetDelete(index);
                        }}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Toggle Set Budget form */}
          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              setFormError("");
              setShowBudgetForm((v) => !v);
            }}
          >
            {showBudgetForm ? "Close Set Budget Form" : "Set Budget"}
          </button>

          {showBudgetForm && (
            <form
              onSubmit={handleBudgetSubmit}
              className="border p-3 rounded shadow-sm"
              style={{ maxWidth: "500px" }}
            >
              {formError && (
                <div className="alert alert-danger">{formError}</div>
              )}

              <div className="mb-3">
                <label className="form-label">Expense Head</label>
                <select
                  className="form-select"
                  name="category"
                  value={budgetFormData.category}
                  onChange={(e) =>
                    setBudgetFormData({
                      ...budgetFormData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Month / Year</label>
                <input
                  type="month"
                  name="month"
                  value={budgetFormData.month}
                  onChange={(e) =>
                    setBudgetFormData({
                      ...budgetFormData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Budget Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="budget"
                  value={budgetFormData.budget}
                  onChange={(e) =>
                    setBudgetFormData({
                      ...budgetFormData,
                      [e.target.name]: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <button type="submit" className="btn btn-success">
                Add Budget
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
