import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/getstarted.css";

function Getstarted() {
  const navigate = useNavigate(); // Corrected variable name to start with lowercase
  const [selectedOption, setSelectedOption] = useState("consumer");
  const [formData, setFormData] = useState({
    role: "consumer",
    full_name: "",
    email: "",
    password: "",
    bio: "",
    address: "",
    photoURL: "",
    skill: "", // Added missing fields
    expertise: "",
    service_area: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    setFormData({...formData, role: option});
    navigate("/consumerpages");
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    setFormData({...formData, role: option});
    navigate("/consumerbtn");
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Map form field ids to API field names
    let key = id;
    if (id === "fullname") key = "full_name";
    
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  // Handle skill change
  const handleSkillChange = (e) => {
    setFormData({
      ...formData,
      skill: e.target.value,
    });
  };

  // Handle expertise change
  const handleExpertiseChange = (e) => {
    setFormData({
      ...formData,
      expertise: e.target.value,
    });
  };

  // Handle service area change
  const handleServiceAreaChange = (e) => {
    setFormData({
      ...formData,
      service_area: e.target.value,
    });
  };

  // Handle textarea changes
  const handleTextAreaChange = (e) => {
    setFormData({
      ...formData,
      bio: e.target.value,
    });
  };

  // Handle photo change
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      // Convert file to base64
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
        });
      const base64 = await toBase64(file);

      // Upload to imgbb
      const form = new FormData();
      form.append("key", "f2acfbbcda824f11f3a15bdd6ffd9414");
      form.append("image", base64);

      const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          photoURL: data.data.url,
        }));
      } else {
        setError("Image upload failed.");
      }
    } catch (err) {
      setError("Image upload failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Create a copy of formData to submit
    const dataToSubmit = {...formData};
    
    try {
      const response = await axios.post(
        "https://skillhub-api-y3gi.onrender.com/api/auth/signup",
        dataToSubmit,
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
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowModal(false);
    navigate("/signin");
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    navigate("/signin");
  };

  return (
    <div className="get-started">
      <div className="content-container">
        <div className="title-section">
          <div className="title-sign-in-container">
            <h2>Create Account</h2>
            <h3>
              Already have an account?{" "}
              <a href="#" className="sign-in-button" onClick={handleSignInClick}>
                Sign In
              </a>
            </h3>
          </div>
        </div>

        {/* Account Type Switch */}
        <div className="account-switch-buttons-container">
          <div className="account-switch-buttons">
            {/* Consumer button */}
            <button
              className={`consumer-btn ${
                selectedOption === "consumer" ? "active" : ""
              }`}
              onClick={() => handleOptionChange1("consumer")}
            >
              Consumer
            </button>

            {/* Skilled Person button */}
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

        {/* Profile Image Upload */}
        <div className="profile-pic-upload">
          <div className="dashed-border profile-image-icon-file-button-container">
            <img
              className="profile-image-icon"
              src={formData.photoURL || "/images/camera.png"}
              alt="Profile Image Upload"
            />
          </div>

          {/* choose image file */}
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
      </div>

      {/* Form */}
      <div className="form-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-input-fields">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullname">
                Full Name <sup className="mandatory-asterik">*</sup>
              </label>
              <input
                type="text"
                id="fullname"
                placeholder="Enter your full name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email <sup className="mandatory-asterik">*</sup>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                Password <sup className="mandatory-asterik">*</sup>
              </label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address">
                Address (only visible to you)
                <sup className="mandatory-asterik">*</sup>
              </label>
              <input
                type="text"
                id="address"
                placeholder="Enter your address"
                required
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            {/* Skills Dropdown - Only show for skilled person */}
            {selectedOption === "skilled" && (
              <>
                <div className="form-group">
                  <label htmlFor="skill">
                    Skill <sup className="mandatory-asterik">*</sup>
                  </label>
                  <select 
                    id="skill" 
                    value={formData.skill}
                    onChange={handleSkillChange}
                    required={selectedOption === "skilled"}
                  >
                    <option value="">Please select your skill</option>
                    <option value="Artist">Artist</option>
                    <option value="Builder">Builder</option>
                    <option value="Decorator">Decorator</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="expertise">
                    Area of Expertise <sup className="mandatory-asterik">*</sup>
                  </label>
                  <input
                    type="text"
                    id="expertise"
                    placeholder="Enter your area of expertise"
                    required={selectedOption === "skilled"}
                    value={formData.expertise}
                    onChange={handleExpertiseChange}
                  />
                </div>

                {/* Service Area Dropdown */}
                <div className="form-group">
                  <label htmlFor="service_area">
                    Service Area <sup className="mandatory-asterik">*</sup>
                  </label>
                  <select 
                    id="service_area"
                    value={formData.service_area}
                    onChange={handleServiceAreaChange}
                    required={selectedOption === "skilled"}
                  >
                    <option value="">Select your area of coverage</option>
                    <option value="1">1 mile</option>
                    <option value="5">5 miles</option>
                    <option value="10">10 miles</option>
                    <option value="20">20 miles</option>
                    <option value="custom-distance">Custom distance</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Bio and video fields */}
          <div className="form-row">
            <div className="form-group bio-group">
              <label htmlFor="bio">
                Bio <sup className="mandatory-asterik">*</sup>
              </label>
              <textarea
                id="bio"
                placeholder="Write a short bio about yourself"
                required
                maxLength={200}
                value={formData.bio}
                onChange={handleTextAreaChange}
              />
            </div>

            {/* Video upload field - Only for skilled persons */}
            {selectedOption === "skilled" && (
              <div className="form-group video-group">
                <label htmlFor="intro-video">
                  Introductory Video (Optional)
                </label>
                <div className="video-upload">
                  <div className="dashed-border-video">
                    <img src="/images/videocam.png" alt="video camera" />
                    <input type="file" id="intro-video" accept="video/*" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next step button */}
          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
          
          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </form>
      </div>

      {/* Congratulations Modal/Popover for consumers */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>CONGRATULATIONS</h2>
            <h3>
              Your account has been created successfully! You can now start
              exploring skilled professionals and services.
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
    </div>
  );
}

export default Getstarted;