import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import "animate.css";
//-----Animations-------------------------------------
import BudgetAnimate from "./Animation/BudgetAnimate";
import Coins from "./Animation/Coins";
import IncreasedMoney from "./Animation/IncreaseSaving";
import CategoryAnimate from "./Animation/CategoryAnimate";
import Save from "./Animation/SavingMoney";
//----------------------------------------------------
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  PieController,
  BarController,
  ArcElement,
  BarElement,
} from "chart.js";
import { motion } from "framer-motion";

//import themeSwitch from "./animations/theme-switch.json";

import ExpTrend from "./ExpenseTrend";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  PieController,
  BarController,
  ArcElement,
  BarElement
);

export default function App() {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  const [feedback, setFeedback] = useState([
    {
      name: "Ravi Sharma",
      location: "Delhi, India",
      feedback:
        "Expencer helped me track and control my food expenses. Amazing tool!",
      rating: 5,
    },
    {
      name: "Ananya Roy",
      location: "Kolkata, India",
      feedback:
        "The insights are incredible. I save 20% more since I started using this app.",
      rating: 4,
    },
    {
      name: "John Dsouza",
      location: "Mumbai, India",
      feedback: "The app UI is very clean and user-friendly.",
      rating: 4,
    },
    {
      name: "Fatima Sheikh",
      location: "Hyderabad, India",
      feedback: "I love how the budget warnings keep me on track.",
      rating: 5,
    },
    {
      name: "Aarav Patel",
      location: "Ahmedabad, India",
      feedback: "My favorite finance tracker. Simple and powerful.",
      rating: 5,
    },
  ]);
  useEffect(() => {
    const dropdown = document.querySelector(".dropdown-menu");

    const handleShow = () => {
      if (dropdown) {
        dropdown.classList.remove("animate__fadeOut");
        dropdown.classList.add("animate__animated", "animate__fadeIn");
      }
    };

    const handleHide = () => {
      if (dropdown) {
        dropdown.classList.remove("animate__fadeIn");
        dropdown.classList.add("animate__fadeOut");
      }
    };

    const dropdownElement = document.querySelector(".dropdown");

    dropdownElement?.addEventListener("show.bs.dropdown", handleShow);
    dropdownElement?.addEventListener("hide.bs.dropdown", handleHide);

    return () => {
      dropdownElement?.removeEventListener("show.bs.dropdown", handleShow);
      dropdownElement?.removeEventListener("hide.bs.dropdown", handleHide);
    };
  }, []);

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < count ? "#ffc107" : "#e4e5e9" }}>
        ★
      </span>
    ));
  };

  return (
    <div
      className={`min-vh-100  ${
        isDark ? "bg-dark text-white" : "bg-light text-dark"
      } `}
    >
      <nav
        className={`navbar navbar-expand-lg sticky-top ${
          isDark ? "navbar-dark" : "navbar-light"
        }`}
        style={{
          backgroundColor: isDark
            ? "rgba(33, 37, 41, 0.85)"
            : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(6px)",
          zIndex: 999,
        }}
      >
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold" href="#">
            <svg width="150" height="60" viewBox="00 10 300 100">
              <text
                x="0"
                y="65"
                fill="#0d6efd"
                fontFamily="Poppins, sans-serif"
                fontSize="30"
              >
                Expencer
              </text>
            </svg>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-3 align-items-center">
              {/* Features Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle fw-semibold"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Features
                </a>
                <ul
                  className="dropdown-menu shadow rounded-3 border-0 animate__animated animate__fadeIn"
                  style={{ minWidth: "4000px" }}
                >
                  {[
                    { label: "📊 Category-wise Analysis", link: "#category" },
                    { label: "📅 Date-wise Analysis", link: "#date" },
                    { label: "🎯 Budget Target", link: "#target" },
                    { label: "📈 Budget Progress", link: "#progress" },
                    { label: "📄 Monthly Full Report", link: "#report" },
                  ].map(({ label, link }, idx) => (
                    <li key={idx}>
                      <a
                        className="dropdown-item fw-semibold px-3 py-2 rounded text-dark"
                        href={link}
                        style={{
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={
                          (e) =>
                            (e.target.style.backgroundColor =
                              "rgba(13, 110, 253, 0.1)") // Bootstrap primary tint
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "")
                        }
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Pricing */}
              <li className="nav-item">
                <a className="nav-link fw-semibold" href="#pricing">
                  Pricing
                </a>
              </li>

              {/* Login & Signup Buttons */}
              <li className="nav-item">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/user")}
                >
                  Log In
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/user")}
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Navbar */}

        {/* Dummy animation: Users using the app */}

        {/* Hero Section */}
        <motion.div
          className="text-center mb-5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
        >
          <h1 className="display-4 fw-bold mt-4 text-center">
            <Typewriter
              words={[
                "Manage Money Smartly",
                "Save More. Spend Wise.",
                "Track Every Rupee.",
              ]}
              loop={0} // 0 = infinite
              cursor
              cursorStyle="|"
              typeSpeed={120}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </h1>

          <p className="lead">
            Join thousands saving more every month with Expencer.
          </p>
          <div className="text-center my-4">
            <button className="try-now-button px-4 py-2 rounded fw-bold border-0 fs-5">
              TRY IT NOW FOR FREE !
            </button>
          </div>
        </motion.div>

        {/* Section 1: Spending Trend */}
        <section className="mb-5">
          <h2 className="text-center mb-3">Spending Trend</h2>
          <p className="text-center text-muted">
            Visualize how your expenses evolve monthly.
          </p>
          <motion.div
            className={`card border-0 shadow p-4 ${
              isDark ? "bg-secondary text-white" : "bg-white"
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ExpTrend style={{ width: "100%" }} />
          </motion.div>
        </section>

        {/* Section 2: Insight & Analysis */}
        <section className="my-5 text-center">
          <Save />
          <p className="lead">Be Relaxed and Focus on Analysis</p>
        </section>

        {/* Section 3-5: Category, Savings, Budget */}
        <section className="mb-5">
          <h2 className="text-center mb-4">In-Depth Insights</h2>
          <div className="row g-4">
            {/* Category-wise */}
            <motion.div
              className="col-md-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className={`card p-3 h-100 ${
                  isDark ? "bg-secondary text-white" : "bg-white"
                }`}
              >
                <h5 className="text-center">Category-wise Spending</h5>
                <CategoryAnimate />
              </div>
            </motion.div>

            {/* Savings */}
            <motion.div
              className="col-md-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className={`card p-3 h-100 ${
                  isDark ? "bg-secondary text-white" : "bg-white"
                }`}
              >
                <h5 className="text-center">Savings Over Time</h5>
                <IncreasedMoney />
              </div>
            </motion.div>

            {/* Budget */}
            <motion.div
              className="col-md-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div
                className={`card p-3 h-100 ${
                  isDark ? "bg-secondary text-white" : "bg-white"
                }`}
              >
                <h5 className="text-center">Budget vs Expense</h5>
                <BudgetAnimate />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Coins animation */}
        <div className="text-center my-5">
          <Coins />
          <p className="text-muted">Your savings are growing every second!</p>
        </div>

        {/* Section 6: Dummy Reviews */}
        <section className="my-5">
          <h2 className="text-center mb-4">What People Say</h2>
          <div
            id="reviewCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="3000"
          >
            <div className="carousel-inner">
              {feedback.map((review, idx) => (
                <div
                  key={idx}
                  className={`carousel-item ${idx === 0 ? "active" : ""}`}
                >
                  <div className="d-flex justify-content-center">
                    <div
                      className={`card shadow-lg p-4 ${
                        isDark ? "bg-secondary text-white" : "bg-white"
                      }`}
                      style={{ maxWidth: "600px", width: "90%" }}
                    >
                      <h5>{review.name}</h5>
                      <p className="text-muted">{review.location}</p>
                      <div className="mb-2">{renderStars(review.rating)}</div>
                      <p>"{review.feedback}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#reviewCarousel"
              data-bs-slide="prev"
            >
              <span className="fs-1 text-dark" aria-hidden="true">
                ←
              </span>
              <span className="visually-hidden">Previous</span>
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#reviewCarousel"
              data-bs-slide="next"
            >
              <span className="fs-1 text-dark" aria-hidden="true">
                →
              </span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-5 pt-4 border-top">
          <small className="text-muted">
            &copy; 2025 Expencer. All rights reserved.
          </small>
        </footer>
      </div>
    </div>
  );
}
