import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/signin.css';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Add animation sequence with delays
  useEffect(() => {
    const inputContainers = document.querySelectorAll('.input-field-container');
    inputContainers.forEach((container, index) => {
      container.style.animationDelay = `${0.2 * (index + 1)}s`;
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="signin-container">
      <div className="signin-content">
        <div className="welcome-section">
          <h2 className="welcome-title">
            Welcome to <span className="skillhub">Skill<span  className="hub">Hub</span></span>
          </h2>
        </div>
        
        <div className="form-container">
          <div className="image-form-wrapper">
            <img
              className="login-image"
              src="./images/image.png"
              alt="Login Illustration"
            />
            
            <form className="signin-form" onSubmit={handleSubmit}>
              <div className="input-field-container">
                <label className="input-label">
                
                  Email<sup className="required-asterisk">*</sup> <br></br> <br></br>
                  <input
                  className="form-inputn"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
                </label>
                
              </div>
              
              <div className="input-field-container">
                <label className="input-label">
                  Password<sup className="required-asterisk">*</sup> <br>
                  </br> <br></br>
                  <input
                  className="form-inputn"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
                </label>
               
              </div>
              
              <div className="form-actions">
                <button className="login-button" type="submit">
                  Log In
                </button>
                <button className="google-signin-button" type="button">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.2 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.182a4.386 4.386 0 01-1.909 2.835v2.409h3.09c1.808-1.636 2.837-4.045 2.837-7.067z" fill="#4285F4"/>
                    <path d="M10 19.455c2.586 0 4.75-.841 6.36-2.273l-3.09-2.331a6.214 6.214 0 01-3.27.914c-2.432 0-4.533-1.613-5.33-3.97H1.545v2.4A9.545 9.545 0 0010 19.456z" fill="#34A853"/>
                    <path d="M4.682 11.796a5.611 5.611 0 010-3.593V5.893H1.545a9.382 9.382 0 000 8.213l3.137-2.31z" fill="#FBBC05"/>
                    <path d="M10 5.773c1.321 0 2.512.445 3.451 1.339l2.75-2.682C14.463 2.818 12.309 2 10 2 6.386 2 3.276 4.041 1.545 7.103l3.137 2.4C5.466 7.386 7.568 5.773 10 5.773z" fill="#EA4335"/>
                  </svg>
                  Sign In with Google
                </button>
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>
              
              <div className="new-user-prompt">
                New to <span className="skillhub">Skill<span  className="hub">Hub</span></span>? <Link to="/getstarted" className="signup-link">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}