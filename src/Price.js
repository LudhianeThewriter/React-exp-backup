import React, { useState } from "react";

const PricingPlans = () => {
  const [showPlans, setShowPlans] = useState(false);

  return (
    <div className="mt-5">
      <button
        className="btn btn-outline-info mb-3"
        onClick={() => setShowPlans((prev) => !prev)}
      >
        {showPlans ? "Hide Plans" : "View Plans"}
      </button>

      {showPlans && (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow h-100 border-info">
              <div className="card-body text-center">
                <h5 className="card-title text-info">Free Tier</h5>
                <h6 className="card-subtitle mb-2 text-muted">₹ 0 / year</h6>
                <ul className="list-group list-group-flush text-start mt-3">
                  <li className="list-group-item">✅ Limited Data Storage</li>
                  <li className="list-group-item">❌ Budget Setting</li>
                  <li className="list-group-item">❌ Excel Reports</li>
                  <li className="list-group-item">
                    ✅ Limited Analysis Options
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow h-100 border-success">
              <div className="card-body text-center">
                <h5 className="card-title text-success">Annual Premium</h5>
                <h6 className="card-subtitle mb-2 text-muted">₹ 1500 / year</h6>
                <ul className="list-group list-group-flush text-start mt-3">
                  <li className="list-group-item">✅ Unlimited Data Storage</li>
                  <li className="list-group-item">✅ Budget Setting Enabled</li>
                  <li className="list-group-item">✅ Download Excel Reports</li>
                  <li className="list-group-item">
                    ✅ Full Analysis & Insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPlans;
