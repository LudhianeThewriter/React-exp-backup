import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import Exporter from "./ExportToCsv";
export function AnalysisForms({ type, expData }) {
  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];
  const [categoryForm, setCategoryForm] = useState({ month: "", category: "" });
  const [monthForm, setMonthForm] = useState({ startMonth: "", endMonth: "" });
  const [singleExpForm, setSingleExpForm] = useState({
    expHead: "",
    startDate: "",
    endDate: "",
  });
  const [budgetForm, setBudgetForm] = useState({ month: "" });
  const [topExpForm, setTopExpForm] = useState({ startDate: "", endDate: "" });
  const [recurringForm, setRecurringForm] = useState();

  console.log("Category Form ", categoryForm);
  console.log("monthForm  ", monthForm);
  console.log("singleExpForm", singleExpForm);
  console.log("budgetForm", budgetForm);
  console.log("Category Form ", categoryForm);
  console.log("topExpForm ", topExpForm);
  // Sample data for charts (you can replace with dynamic data later)
  const [categoryData, setCategoryData] = useState([]);

  const [monthComparison, setMonthComparison] = useState([
    { month: "April", spent: 7500 },
    { month: "May", spent: 6800 },
  ]);
  const [monthDisplayData, setMonthDisplayData] = useState([]);
  const [singleExpenseChartData, setSingleExpenseChartData] = useState([]);
  const [globalHead, setGlobalHead] = useState("");
  const [budgetData, setBudgetData] = useState([
    { type: "Budget", amount: 10000 },
    { type: "Spent", amount: 9200 },
    { type: "Remaining", amount: 800 },
  ]);

  const [topExpenses, setTopExpenses] = useState([
    { expense: "Rent", amount: 5000 },
    { expense: "Groceries", amount: 2000 },
    { expense: "Electricity", amount: 1200 },
    { expense: "Internet", amount: 800 },
    { expense: "Netflix", amount: 450 },
  ]);

  const [recurringData, setRecurringData] = useState([
    { name: "Netflix", amount: 450 },
    { name: "Gym", amount: 1000 },
    { name: "Domain Renewal", amount: 999 },
  ]);

  const needsVsWantsData = [
    { name: "Needs", value: 7000 },
    { name: "Wants", value: 3000 },
  ];

  const prevCurrentData = [
    { month: "Previous", amount: 9000 },
    { month: "Current", amount: 8200 },
  ];
  function formatMonthYear(yyyyMm) {
    const [year, month] = yyyyMm.split("-");
    const date = new Date(year, month - 1); // month is 0-based
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  }

  function formatDate(input) {
    const [year, month, day] = input.split("-");
    return `${day}-${month}-${year}`;
  }

  console.log(formatDate("2025-05-01")); // Output: "01-05-2025"

  function filterExpenseData(type) {
    if (type == "category") {
      const filter = expData.filter((expense) => {
        const expenseMonth = expense.date.slice(0, 7);
        const monthMatches =
          categoryForm.month == "" || categoryForm.month == expenseMonth;
        const categoryMatches =
          categoryForm.category == "" ||
          categoryForm.category == expense.category;

        return monthMatches && categoryMatches;
      });

      const grouped = filter.reduce((acc, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = 0;
        }

        acc[curr.category] += parseFloat(curr.amount);
        return acc;
      }, {});

      const formattedCategoryData = Object.entries(grouped).map(
        ([category, amount]) => ({
          category,
          amount,
        })
      );

      setCategoryData(formattedCategoryData);

      // setCategoryData(formattedCategoryData);
      console.log("formattedCategoryData ", formattedCategoryData);
    } else if (type == "month") {
      console.log("Bot Doing Month Wise Analysis");
      const filter = expData.filter((expense) => {
        const expenseMonth = expense.date.slice(0, 7);
        const startMatch =
          monthForm.startMonth == "" || monthForm.startMonth <= expenseMonth;
        const endMatch =
          monthForm.endMonth == "" || monthForm.endMonth >= expenseMonth;
        return startMatch && endMatch;
      });

      console.log("Month Wise Filter = ", filter);

      const monthGrouped = filter.reduce((acc, curr) => {
        const month = curr.date.slice(0, 7);
        if (!acc[month]) {
          acc[month] = 0;
        }

        acc[month] += parseFloat(curr.amount);

        return acc;
      }, {});

      console.log("Month Grouped ", monthGrouped);
      const formattedMonthChartData = Object.entries(monthGrouped).map(
        ([key, value]) => ({
          month: formatMonthYear(key),
          amount: value,
        })
      );

      console.log("Formatted MOnth Chart ", formattedMonthChartData);
      setMonthComparison(formattedMonthChartData);

      //--- Display Expense Data Month Wise
      const categoryMonthGrouped = {};

      filter.forEach((expense) => {
        const category = expense.category;
        const month = formatMonthYear(expense.date.slice(0, 7));

        if (!categoryMonthGrouped[category]) {
          categoryMonthGrouped[category] = {};
        }

        if (!categoryMonthGrouped[category][month]) {
          categoryMonthGrouped[category][month] = 0;
        }

        categoryMonthGrouped[category][month] += parseFloat(expense.amount);
      });

      console.log("categoryMonthGrouped : ", categoryMonthGrouped);

      const allMonths = [
        ...new Set(
          filter.map((expense) => formatMonthYear(expense.date.slice(0, 7)))
        ),
      ];

      const formattedMonthDisplayData = Object.entries(
        categoryMonthGrouped
      ).map(([category, months]) => {
        const filledMonths = {};

        allMonths.forEach((month) => {
          filledMonths[month] = months[month] || 0;
        });

        return { category, ...filledMonths };
      });

      const totalRow = {
        category: "Total",
      };

      allMonths.forEach((month) => {
        const found = formattedMonthChartData.find((m) => m.month == month);
        totalRow[month] = found ? found.amount : 0;
      });
      formattedMonthDisplayData.push(totalRow);
      console.log("formattedMonthDisplayData : ", formattedMonthDisplayData);
      setMonthDisplayData(formattedMonthDisplayData);
    } else if (type == "single") {
      const filter = expData.filter((expense) => {
        const matchExp =
          singleExpForm.expHead == "" ||
          singleExpForm.expHead == expense.category;
        const startDate =
          singleExpForm.startDate == "" ||
          new Date(singleExpForm.startDate) <= new Date(expense.date);
        const endDate =
          singleExpForm.endDate == "" ||
          new Date(singleExpForm.endDate) >= new Date(expense.date);

        return matchExp && startDate && endDate;
      });

      setGlobalHead(filter.category);

      console.log("Single Exp Analysis ", filter);

      const dateGrouped = filter.reduce((sum, curr) => {
        const date = curr.date;

        if (!sum[date]) {
          sum[date] = 0;
        }

        sum[date] += parseFloat(curr.amount);
        return sum;
      }, {});
      console.log("Date grouped ", dateGrouped);

      const formattedChartDisplayData = Object.entries(dateGrouped).map(
        ([date, amount]) => ({ date: formatDate(date), amount })
      );

      console.log("Formatted Single Expense", formattedChartDisplayData);
      setSingleExpenseChartData(formattedChartDisplayData);
    } else if (type == "top") {
      const filter = expData.filter((expense) => {
        const date = new Date(expense.date);
        const startDate =
          topExpForm.startDate == "" || new Date(topExpForm.startDate) <= date;
        const endDate =
          topExpForm.endDate == "" || new Date(topExpForm.endDate) >= date;
        return startDate && endDate;
      });

      console.log("Top 5 Expense ", filter);

      const expGrouped = filter.reduce((sum, curr) => {
        if (!sum[curr.category]) {
          sum[curr.category] = 0;
        }

        sum[curr.category] += parseFloat(curr.amount);

        return sum;
      }, {});

      console.log("Group Top Expense", expGrouped);

      const topExpenses = Object.entries(expGrouped)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category, amount]) => ({ category, amount }));

      setTopExpenses(topExpenses);
    }
  }

  const renderFormAndOutput = () => {
    switch (type) {
      case "Category-wise Analysis":
        return (
          <>
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Select Month</Form.Label>
                    <Form.Control
                      type="month"
                      name="month"
                      value={categoryForm.month}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Select Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={categoryForm.category}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option>--Select Expense--</option>
                      {expData ? (
                        [...new Set(expData.map((obj) => obj.category))].map(
                          (category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          )
                        )
                      ) : (
                        <option>Nothing To Show</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Button
                variant="primary"
                onClick={() => filterExpenseData("category")}
              >
                Analyze
              </Button>
            </Form>
            <hr />
            <h5>Analysis Result</h5>
            <Exporter title="Category-Wise Analysis " data={categoryData} />
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              "Nothing To Show"
            )}
          </>
        );

      case "Month-wise Analysis":
        return (
          <>
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Start Month</Form.Label>
                    <Form.Control
                      type="month"
                      name="startMonth"
                      value={monthForm.startMonth}
                      onChange={(e) =>
                        setMonthForm({
                          ...monthForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>End Month</Form.Label>
                    <Form.Control
                      type="month"
                      name="endMonth"
                      value={monthForm.endMonth}
                      onChange={(e) =>
                        setMonthForm({
                          ...monthForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                variant="primary"
                onClick={() => filterExpenseData("month")}
              >
                Compare
              </Button>
            </Form>
            <hr />
            <h5>Month-wise Comparison</h5>
            <Exporter title="Month-wise Analysis" data={monthDisplayData} />
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </>
        );

      case "Single Expense Analysis":
        return (
          <>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Expense</Form.Label>
                <Form.Select
                  name="expHead"
                  value={singleExpForm.expHead}
                  onChange={(e) =>
                    setSingleExpForm({
                      ...singleExpForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                >
                  {expData ? (
                    [...new Set(expData.map((obj) => obj.category))].map(
                      (category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      )
                    )
                  ) : (
                    <option>Nothing To Show</option>
                  )}
                </Form.Select>
              </Form.Group>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={singleExpForm.startDate}
                      onChange={(e) =>
                        setSingleExpForm({
                          ...singleExpForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={singleExpForm.endDate}
                      onChange={(e) =>
                        setSingleExpForm({
                          ...singleExpForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                variant="primary"
                onClick={() => filterExpenseData("single")}
              >
                Search
              </Button>
            </Form>
            <hr />
            <h5>Expense Timeline </h5>
            <Exporter
              title="Single Expense Analysis"
              data={singleExpenseChartData}
            />

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={singleExpenseChartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </>
        );

      case "Compare with Budget":
        return (
          <>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Choose Month</Form.Label>
                <Form.Control
                  type="month"
                  name="month"
                  value={budgetForm.month}
                  onChange={(e) =>
                    setBudgetForm({
                      ...budgetForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={() => filterExpenseData("budget")}
              >
                Compare
              </Button>
            </Form>
            <hr />
            <h5>Budget Comparison</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </>
        );

      case "Top 5 Expenses":
        return (
          <>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Choose Date Range</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={topExpForm.startDate}
                      onChange={(e) =>
                        setTopExpForm({
                          ...topExpForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={topExpForm.endDate}
                      onChange={(e) =>
                        setTopExpForm({
                          ...topExpForm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Button
                variant="primary"
                onClick={() => filterExpenseData("top")}
              >
                Show Top 5
              </Button>
            </Form>
            <hr />
            <h5>Top 5 Expenses</h5>
            <Exporter title="Top Expenses" data={topExpenses} />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topExpenses}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </>
        );

      case "Recurring Expenses":
        return (
          <>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Recurring Type</Form.Label>
                <Form.Select>
                  <option>All</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary">List Recurring</Button>
            </Form>
            <hr />
            <h5>Recurring Expenses</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recurringData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </>
        );

      case "Needs vs Wants":
        return (
          <>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Month</Form.Label>
                <Form.Control type="month" />
              </Form.Group>
              <Button variant="primary">Analyze</Button>
            </Form>
            <hr />
            <h5>Needs vs Wants</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={needsVsWantsData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {needsVsWantsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </>
        );

      case "Previous vs Current Comparison":
        return (
          <>
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Previous Month</Form.Label>
                    <Form.Control type="month" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Current Month</Form.Label>
                    <Form.Control type="month" />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary">Compare</Button>
            </Form>
            <hr />
            <h5>Previous vs Current Month</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prevCurrentData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </>
        );

      default:
        return <p>No form available for this analysis type.</p>;
    }
  };

  return (
    <div className="p-3 border rounded shadow-sm bg-white">
      <h4 className="mb-4">{type}</h4>
      {renderFormAndOutput()}
    </div>
  );
}
