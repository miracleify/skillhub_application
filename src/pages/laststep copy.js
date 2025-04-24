import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/laststep.css";

function Laststep() {
  const Navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("skilled");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressSteps] = useState([
    {
      id: 0,
      text: "Basic Details",
      longText: "Basic Details",
      completed: false,
    },
    {
      id: 1,
      text: "Profile Information",
      longText: "Profile Information",
      completed: false,
    },
    { id: 2, text: "Verification", longText: "Verification", completed: true },
  ]);

  // Get form data from previous step
  const prevFormData = location.state?.formData || {};
  const [formData, setFormData] = useState({
    ...prevFormData,
    bvn: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, bvn: e.target.value });
  };

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    Navigate("/getstarted");
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    Navigate("/consumerbtn");
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://skillhub-api-y3gi.onrender.com/api/auth/signup",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 || response.status === 201) {
        setShowModal(true);
      } else {
        setError(response.data.message || "Signup failed.");
      }
    } catch (err) {
      setError(
        (err.response?.data?.message || "Network error. Please try again.") +
          "\n" +
          err?.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowModal(false);
    Navigate("/signin");
  };

  return (
    <>
      <div className={`last-page ${showModal ? "blur-background" : ""}`}>
        <h2>Create Account</h2>
        <h3>
          Already have an account? <a href="#">sign in</a>
        </h3>

        {/* Switch buttons */}
        <div className="switch-buttons-container">
          <div className="button">
            <button
              className={`consumer-btn ${
                selectedOption === "consumer" ? "active" : ""
              }`}
              onClick={() => handleOptionChange1("consumer")}
            >
              Consumer
            </button>
            <button
              id="ski-btn"
              className={`skill-btn ${
                selectedOption === "skilled" ? "active" : ""
              }`}
              onClick={() => handleOptionChange2("skilled")}
            >
              Skilled Person
            </button>
          </div>
        </div>

        {/* from progression bar */}
        <div className="progressbar">
          <ul>
            {progressSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <li>
                  <div className="progress-step">
                    <div
                      className={`step-circle ${
                        step.completed ? "active" : ""
                      }`}
                    >
                      {step.text}
                    </div>
                  </div>
                </li>
                {index < progressSteps.length - 1 && (
                  <div
                    className={`connector-line ${
                      step.completed ? "active" : ""
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="image-upload-container">
          {/* Image Request */}
          <div className="image-request-container">
            <div className="profilepices">
              <div className="dashed-border">
                <img
                  src="/images/cam.png"
                  alt="video camera"
                  className="upload-image-icon"
                />
              </div>
              <div className="text">
                <span>
                  Drag & drop or click to upload an image of your choice.
                </span>
                <strong>
                  (PLEASE ENSURE IMAGE IS CLEAR AND SHOWS YOUR FACE)
                </strong>
              </div>
            </div>

            {/* Text */}
            <strong>
              Acceptable forms of ID - Passport, Drivers License, etc..
            </strong>
          </div>

          {/* Take Photo Button */}
          <div className="take-photo-request-container">
            <div className="profilepices">
              <div className="dashed-border">
                <img
                  src="/images/mobile.png"
                  alt="video camera"
                  className="take-photo-icon"
                />
              </div>
              <div className="text">
                <span>Click to take a photo of your face</span>
                <strong>ENSURE PHOTO IS TAKEN IN WELL LIT CONDITIONS</strong>
              </div>
            </div>

            {/* Why do we need this */}
            <strong>
              Why do we need this?
              <a href="" className="find-out-link">
                {" "}
                Find Out
              </a>
            </strong>
          </div>
        </div>

        {/* BVN Input */}
        <div className="bvn-form-input-container">
          <form className="bvn-form" onSubmit={handleCreateAccount}>
            {/* Label */}
            <label htmlFor="bvn">
              Bank Verification Number (BVN)
              <sup className="mandatory-asterik">*</sup>
            </label>

            {/* Input field */}
            <input
              className="input-field"
              type="number"
              id="bvn"
              placeholder="Enter your 11-digit BVN"
              required
              value={formData.bvn}
              onChange={handleInputChange}
            />
          </form>

          {/* Save info buttton container */}
          <div className="buttons-container">
            {/* save info button */}
            <button id="save-btn" className="buttons" type="button">
              Save information
            </button>

            {/* create acocunt button */}
            <button
              id="create-btn"
              className="buttons"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </div>
      </div>

      {/* Congratulations Modal/Popover */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>CONGRATULATIONS</h2>
            <h3>
              Your account has been set up and you are almost ready to start
              selling your skill! Your profile will be verified within 3 - 5
              working days.
            </h3>
            <button className="continue-btn" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* CSS for the modal and blur effect */}
      <style jsx>{`
        .blur-background {
          filter: blur(5px);
          pointer-events: none;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .modal-content h2 {
          color: #007bff;
          margin-bottom: 15px;
        }

        .modal-content h3 {
          font-weight: normal;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .continue-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .continue-btn:hover {
          background-color: rgb(35, 112, 194);
        }
      `}</style>
    </>
  );
}

export default Laststep;
