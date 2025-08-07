import React, { useState, useContext } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { FaCalendarAlt, FaRupeeSign, FaClipboard } from "react-icons/fa";
import { MdCategory, MdAutorenew } from "react-icons/md";
import { AuthContext } from "./AuthContext";
import { addExpense } from "./FirebaseUtils";
import { toast } from "react-toastify";
import Sidebar from "./UserSideBar";
import { BulkDataFromExcel } from "./BulkData";
import { DownloadTemplate } from "./DownloadTemplate";
export default function AddNew({ onAdd }) {
  const { user, loading } = useContext(AuthContext);

  const [form, setForm] = useState({
    category: "",
    date: "",
    remarks: "",
    amount: "",
    recurring: false,
  });

  const categories = [
    "Milk & Newspaper",
    "Fruits & Vegetables",
    "Rent",
    "Food",
    "Groceries",
    "Loan , Repayments & Interest",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    console.log("Expenses ", form);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please Log in again !");
    try {
      const formattedData = { ...form, amount: parseFloat(form.amount) };

      await addExpense(user.uid, formattedData);
      toast.success("Expense added !");
      setForm({
        category: "",
        date: "",
        remarks: "",
        amount: "",
        recurring: false,
      });
      if (onAdd) onAdd();
    } catch (error) {
      toast.error("Failed to add Expense" + error.message);
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="row gx-0">
        {/* Sidebar */}
        <div className="col-md-3 ">
          <Sidebar />
        </div>

        {/* Add Expense Form */}
        <div className="col-md-9 p-4">
          <h4 className="mb-3">Add New Expense</h4>
          <form
            onSubmit={handleSubmit}
            className="p-4 border rounded bg-light shadow"
          >
            {/* Category Dropdown */}
            <div className="mb-3">
              <label className="form-label">
                <MdCategory className="me-2" />
                Category
              </label>
              <select
                className="form-select"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaCalendarAlt className="me-2" />
                Expense Date
              </label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaClipboard className="me-2" />
                Remarks
              </label>
              <textarea
                className="form-control"
                name="remarks"
                rows="2"
                value={form.remarks}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaRupeeSign className="me-2" />
                Amount (₹)
              </label>
              <input
                type="number"
                className="form-control"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>

            {/* Recurring Toggle */}
            <div className="form-check form-switch mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="recurringToggle"
                name="recurring"
                checked={form.recurring}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="recurringToggle">
                <MdAutorenew className="me-2" />
                Recurring Expense
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              Add Expense
            </button>
          </form>
          <hr />
          <BulkDataFromExcel />
          <DownloadTemplate />
        </div>
      </div>
    </div>
  );
}
