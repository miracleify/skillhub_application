import React from "react";
import "../styles/consumerbtn.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ConsumerBTN() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("consumer");

  // Add state for form inputs
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    navigate("/consumerpages");
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    navigate("/consumerbtn");
  };
  const changepage = () => {
    navigate("/nextstep");
  };

  // Add onChange handler for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const [progressSteps] = useState([
    {
      id: 0,
      text: "Basic Details",
      longText: "Basic Details",
      completed: true,
    },
    {
      id: 1,
      text: "Profile Information",
      longText: "Profile Information",
      completed: false,
    },
    { id: 2, text: "Verification", longText: "Verification", completed: false },
  ]);

  return (
    <>
      {/* Titling */}
      <div className="title-section">
        <h2>Create Account</h2>
        <h3>
          Already have an account? <a href="#">sign in</a>
        </h3>
      </div>

      {/* Form Container */}
      <div className="form-and-switch-buttons-container">
        {/* Switch buttons */}
        <div className="switch-buttons-container">
          <div className="switch-buttons">
            <div className="button">
              {/* Consumer button */}
              <button
                className={`consumer-btn ${
                  selectedOption === "consumer" ? "active" : ""
                }`}
                onClick={() => handleOptionChange1("consumer")}
              >
                Consumer
              </button>

              {/* skilled person button */}
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
        </div>

        {/* Progression indicators workout*/}
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

        {/* Mobile Steps */}
        <div className="step-container">
          <div className="step active">1</div>
          <div className="line"></div>
          <div className="step">2</div>
          <div className="line"></div>
          <div className="step">3</div>
        </div>

        <div className="container">
          {/* image form container */}
          <div className="image-form-container">
            <img
              className="login-pic"
              src="./images/image.png"
              alt="Login Image"
            />

            {/* New Form */}
            <form className="new-form" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="input-field-container">
                <label className="label-text">
                  Email<sup className="mandatory-asterik">*</sup>{" "}
                </label>

                <input
                  className="input-field"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter a valid email address"
                  required
                />
              </div>

              {/* Password */}
              <div className="input-field-container">
                <label className="label-text">
                  Password
                  <sup className="mandatory-asterik">*</sup>
                </label>

                <input
                  className="input-field"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Password confirmation */}
              <div className="input-field-container">
                <label className="label-text">
                  Confirm password <sup className="mandatory-asterik">*</sup>
                </label>

                <input
                  className="input-field"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              <button onClick={changepage} className="next-btn" type="submit">
                Next Step
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConsumerBTN;
