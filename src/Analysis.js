import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "./UserSideBar";
import { AuthContext } from "./AuthContext";
import { AnalysisForms } from "./AnalysisForm";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useExpenses } from "./ExpenseContext";

export function AnalysisBot() {
  const navigate = useNavigate();
  const { user, loading, userInfo } = useContext(AuthContext);
  const location = useLocation();
  const analysisType = location.state?.type;
  const { expenses } = useExpenses();
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/user");
    }
  }, [user, loading, navigate]);

  const analysisOptions = [
    {
      title: "Category-wise Analysis",
      description: "Analyze spending across different categories.",
      icon: "📂",
    },
    {
      title: "Month-wise Analysis",
      description: "Compare monthly spending trends.",
      icon: "📅",
    },
    {
      title: "Single Expense Analysis",
      description: "Focus on specific expenses within a date range.",
      icon: "🔍",
    },
    {
      title: "Compare with Budget",
      description: "Track how expenses align with your budget.",
      icon: "📊",
    },
    {
      title: "Top 5 Expenses",
      description: "Your highest spending items at a glance.",
      icon: "🔥",
    },
    {
      title: "Recurring Expenses",
      description: "Manage subscriptions, rent, and more.",
      icon: "🔁",
    },
    {
      title: "Needs vs Wants",
      description: "Understand essentials vs non-essentials.",
      icon: "⚖️",
    },
    {
      title: "Previous vs Current Comparison",
      description: "Compare expenses over two time periods.",
      icon: "↔️",
    },
  ];

  return (
    <div
      className="container-fluid px-0"
      style={{ minHeight: "100vh", overflow: "hidden" }}
    >
      <div className="row g-0" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <div className="col-md-3">
          <SideBar userDetail={userInfo} />
        </div>

        {/* Main Content */}
        <div className="col-md-9 p-4" style={{ overflowY: "auto" }}>
          <h3 className="mb-4">Analysis Center </h3>
          <h2 className="mb-4">{analysisType || "Choose an Option"}</h2>
          {!analysisType && (
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
                    onClick={() =>
                      navigate(`/analysis`, { state: { type: option.title } })
                    } // route to specific analysis
                  >
                    <div className="d-flex align-items-center mb-2">
                      <span
                        style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
                      >
                        {option.icon}
                      </span>
                      <h5 className="mb-0">{option.title}</h5>
                    </div>
                    <p className="text-muted small">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {analysisType && (
            <div className="row g-4">
              <AnalysisForms type={analysisType} expData={expenses} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
