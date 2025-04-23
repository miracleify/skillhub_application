import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ConsumerBTN() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("consumer");
  
  // Add state for form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
 // Add error state
  const [error, setError] = useState("");


  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    navigate('/consumerpage');
  };
  
  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    navigate('/consumerbtn');
  };

  const changepage = () => {
     // Only navigate if both fields are filled
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    navigate("/consumerNextpage", { state: { formData } }); // Pass formData to the next page
  };
  
  // Add onChange handler for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
    const handleSubmit = (e) => {
    e.preventDefault();
    // Only submit if both fields are filled
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    console.log("Form submitted:", formData);
    changepage();
  };
  
  const [progressSteps] = useState([
    { id: 0, text: "Basic Details", longText: "Basic Details", completed: true },
    { id: 1, text: "Profile Information", longText: "Profile Information", completed: false },
  ]);
  
  return (
    <div className="consumer-signup-container">
      <div className="title-section">
        <br/>  <br/>  <br/> 
        <h2>Create Account</h2>
        <h3>Already have an account? <a href="#">sign in</a></h3>
        
        <div className="button">
          <button
            className={`consumer-btn ${selectedOption === 'consumer' ? 'active' : ''}`}
            onClick={() => handleOptionChange1('consumer')}
          >
            Consumer
          </button>
          <button
            id="ski-btn"
            className={`skill-btn ${selectedOption === 'skilled' ? 'active' : ''}`}
            onClick={() => handleOptionChange2('skilled')}
          >
            Skilled Person
          </button>
        </div>
        
        <div className="progressbar">
          <ul>
            {progressSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <li>
                  <div className="progress-step">
                    <div className={`step-circle ${step.completed ? 'active' : ''}`}>
                      {step.text}
                    </div>
                  </div>
                </li>
                {index < progressSteps.length - 1 && (
                  <div className={`connector-line ${step.completed ? 'active' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </ul>
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
     {/* Show error if fields are empty */}
              {error && (
                <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
                  {error}
                </div>
              )}

              <button className="next-btn" onClick={changepage} type="submit">
                Next Step
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsumerBTN;