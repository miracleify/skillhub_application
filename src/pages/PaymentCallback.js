import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/getstarted.css"; // Use the modal and styling from getstarted

function PaymentCallback() {
  const navigate = useNavigate();

  const lastHire = JSON.parse(localStorage.getItem("result")) || {};

  // Extract details from URL query params
  const params = new URLSearchParams(window.location.search);
  const reference = params.get("reference") || "N/A";
  const customer = lastHire.customerName || "Customer";
  const service = lastHire.jobDescription || "Service";
  const artisan = lastHire.artisanName || "Artisan";
  const artisanId = lastHire.artisanId;

  const handleGoHome = () => {
    navigate(`/profile/${artisanId}`);
  };

  return (
    <div className="get-started">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Payment Complete</h2>
          <hr className="modal-divider" />
          <div className="modal-details">
            <div className="detail-row">
              <strong>Reference:</strong>
              <span>{reference}</span>
            </div>
            <div className="detail-row">
              <strong>Customer:</strong>
              <span>{customer}</span>
            </div>
            <div className="detail-row">
              <strong>Service:</strong>
              <span>{service}</span>
            </div>
            <div className="detail-row">
              <strong>Artisan:</strong>
              <span>{artisan}</span>
            </div>
          </div>
          <hr className="modal-divider" />
          <h3 style={{ color: "#28a745", marginBottom: "20px" }}>
            Thank you! Your payment was processed.
          </h3>
          <button className="continue-btn" onClick={handleGoHome}>
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCallback;

