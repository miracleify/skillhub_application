import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { uploadImageToImgbb } from "../utils/imageUpload";
import "../styles/consumerNextpage.css";

function ConsumerNextPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("skilled");

  const prevFormData = location.state?.formData || {};
  const [formData, setFormData] = useState({
    ...prevFormData,
    role: "consumer",
    full_name: "",
    address: "",
    bio: "",
    photoURL: "",
    videoURL: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

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
      completed: true,
    },
  ]);

  function changeStep() {
    navigate("/laststep");
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let key = id;
    if (id === "fullname") key = "full_name";
    if (id === "technical-skills") key = "consumer";

    setFormData({ ...formData, [key]: value });
  };

  const handleTextAreaChange = (e) => {
    setFormData({ ...formData, bio: e.target.value });
  };

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    navigate("/getstarted");
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    navigate("/consumerbtn");
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const photoURL = await uploadImageToImgbb(file);
      setFormData((prev) => ({
        ...prev,
        photoURL,
      }));
    } catch (err) {
      setError("Image upload failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Final form data:", formData); // Log the form data here
    setError("");
    try {
      const response = await axios.post(
        "https://skillhub-api-y3gi.onrender.com/api/auth/signup",
        { ...formData, role: "consumer" },
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
    navigate("/signin");
  };

  return (
    <div className="consumer-profile-info-container">
      {/* <h2>Create Account</h2>
      <h3>
        Already have an account? <a href="/signin">sign in</a>
      </h3> */}

      {/* switch button */}
      <div className="consumer-profile-info-switch-button-container">
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

      {/* Progress bar
       */}
      <div className="progressbar">
        <ul>
          {progressSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <li>
                <div className="progress-step">
                  <div
                    className={`step-circle ${step.completed ? "active" : ""}`}
                  >
                    {step.text}
                  </div>
                </div>
              </li>
              {index < progressSteps.length - 1 && (
                <div
                  className={`connector-line ${step.completed ? "active" : ""}`}
                />
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateAccount} className="consumer-profile-info-form-container">
        <div className="consumer-profile-page-profile-pic-upload">
          <div className="dashed-border profile-image-icon-file-button-container">
            <img
              className="profile-image-icon"
              src={formData.photoURL || "/images/camera.png"}
              alt="Profile Image Upload"
            />
          </div>

          <input
            className="profile-image-upload-button"
            type="file"
            id="profile-photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />

          <div className="key-image-upload-guidlines">
            <p>Drag & drop or choose file to upload an image of yourself.</p>
            <p>
              <strong>
                (PLEASE ENSURE IMAGE IS CLEAR AND SHOWS YOUR FACE)
              </strong>
            </p>
          </div>
        </div>

        <div className="consumer-profile-info-form-container">
          <div className="form-row">
            {/* Full name */}
            <div className="consumer-profile-info-form-group">
              <label htmlFor="fullname">
                Full Name <sup className="mandatory-asterik">*</sup>
              </label>
              <input
                className="full_name consumer-profile-info-input-field"
                type="text"
                id="fullname"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>

            {/* Address */}
            <div className="consumer-profile-info-form-group">
              <label htmlFor="address">
                Address{" "}
                <span>
                  (only visible to you)
                  <sup className="mandatory-asterik">*</sup>
                </span>
              </label>
              <input
                className="consumer-profile-info-input-field"
                type="text"
                id="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="consumer-profile-info-form-group">
            <label htmlFor="bio">
              Bio<sup className="mandatory-asterik">*</sup>
              
            </label>
            <textarea
              className="consumer-profile-info-textarea"
              id="bio"
              required
              maxLength={200}
              value={formData.bio}
              onChange={handleTextAreaChange}
              placeholder="Write a short bio about yourself"
            />
          </div>

          {/* Create account button */}
          <button
            id="create-btn"
            className="consumer-profile-info-submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>

        {/* Error Boundary */}
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
      </form>

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
    </div>
  );
}

export default ConsumerNextPage;
