import React from "react";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import SideBar from "./UserSideBar";

const PricingPlans = () => {
  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="bg-light border-end">
        <SideBar />
      </div>

      {/* Main content */}
      <div className="container my-5">
        <h2 className="text-center mb-5 fw-bold">Choose Your Plan</h2>
        <div className="row g-4">
          {/* Free Plan */}
          <div className="col-md-4">
            <div className="card pricing-card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-center">Free Plan</h5>
                <h6 className="card-subtitle mb-3 text-muted text-center">
                  ₹0 / year
                </h6>
                <ul className="list-unstyled flex-grow-1">
                  <li>
                    <FaCheckCircle className="text-success" /> Storage: up to
                    2GB
                  </li>
                  <li>
                    <FaCheckCircle className="text-success" /> File Storage: up
                    to 4GB
                  </li>
                  <li>
                    <FaTimesCircle className="text-danger" /> Email Alerts
                  </li>
                  <li>
                    <FaTimesCircle className="text-danger" /> Excel Report
                  </li>
                  <li>
                    <FaTimesCircle className="text-danger" /> Monthly Report
                  </li>
                  <li>
                    <FaTimesCircle className="text-danger" /> Limited Analysis
                    Tools
                  </li>
                </ul>
                <button className="btn btn-outline-primary mt-3 w-100">
                  Choose Free Plan
                </button>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="col-md-4">
            <div className="card pricing-card h-100 shadow-sm border-primary">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-center text-primary">
                  Premium Plan
                </h5>
                <h6 className="card-subtitle mb-3 text-muted text-center">
                  ₹2500 / year
                </h6>
                <ul className="list-unstyled flex-grow-1">
                  <li>
                    <FaCheckCircle className="text-success" /> Storage: up to
                    4GB
                  </li>
                  <li>
                    <FaCheckCircle className="text-success" /> File Storage: up
                    to 8GB
                  </li>
                  <li>
                    <FaCheckCircle className="text-success" /> Email Alerts
                  </li>
                  <li>
                    <FaCheckCircle className="text-success" /> Monthly Reports
                  </li>
                  <li>
                    <FaCheckCircle className="text-success" /> Excel Report
                  </li>
                  <li>
                    <FaTimesCircle className="text-danger" /> Branch-wise
                    Analysis
                  </li>
                </ul>
                <button className="btn btn-primary mt-3 w-100">
                  Choose Premium Plan
                </button>
              </div>
            </div>
          </div>

          {/* Business Plan */}
          <div className="col-md-4">
            <div className="card pricing-card h-100 shadow-sm border-success">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-center text-success">
                  Business Plan
                </h5>
                <h6 className="card-subtitle mb-3 text-muted text-center">
                  ₹4500 / year
                </h6>
                <ul className="list-unstyled flex-grow-1">
                  <li>
                    <FaCheckCircle className="text-success" /> Unlimited Storage
                  </li>
                  <li>
                    <FaCheckCircle className="text-success" /> Unlimited File
                    Storage
                  </li>
                  <li>
                    <FaCheckCircle className="text-success" /> Email Alerts
                  </li>
                  <li>
                    <FaCheckCircle className="text-success" /> Branch-wise
                    Expense Monitoring
                  </li>
                  <li>
                    <FaCheckCircle className="text-success" /> Sub-user
                    Authentication
                  </li>
                  <li>
                    <FaCheckCircle className="text-success" /> Excel Support
                  </li>
                </ul>
                <button className="btn btn-success mt-3 w-100">
                  Choose Business Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
