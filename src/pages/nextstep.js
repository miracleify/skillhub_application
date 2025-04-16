import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/nextstep.css";

function Nextstep() {
  const Navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("skilled");
  const [formData, setFormData] = useState({
    role: "skilled",
    full_name: "",
    email: "",
    password: "",
    skill: "",
    address: "",
    service_area: "",
    bio: "",
  });

  const [progressSteps] = useState([
    { id: 0, text: "Basic Details", longText: "Basic Details", completed: false },
    { id: 1, text: "Profile Information", longText: "Profile Information", completed: true },
    { id: 2, text: "Verification", longText: "Verification", completed: false }
  ]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let key = id;
    if (id === "fullname") key = "full_name";
    if (id === "technical-skills") key = "skill";
    if (id === "service-area") key = "service_area";
    setFormData({ ...formData, [key]: value });
  };

  const handleTextAreaChange = (e) => {
    setFormData({ ...formData, bio: e.target.value });
  };

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    Navigate('/getstarted');
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    Navigate('/consumerbtn');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    Navigate("/laststep", { state: { formData } });
  };

  return (
    <>
      <br></br><br></br>
      <h2>Create Account</h2> <br />
      <h3>Already have an account? <a href="#">sign in</a></h3> <br />

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

      <div className="profilepice">
        <div className="dotted-border">
          <img src="/images/cam.png" alt="video camera" />
        </div>
        <div className="text">
          <span>Drag & drop or click to upload an image of your choice.</span>
          <span>(PLEASE ENSURE IMAGE IS CLEAR AND SHOWS YOUR FACE)</span>
        </div>
      </div>

      <div className="form-container">
        <form className="signup-form" onSubmit={handleNextStep}>
          {/* First row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullname">Full Name <sup style={{ color: "red", fontSize: "10px" }}>*</sup></label>
              <input type="text" id="fullname" required value={formData.full_name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email<sup style={{ color: "red", fontSize: "10px" }}>*</sup></label>
              <input type="email" id="email" required value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password <sup style={{ color: "red", fontSize: "10px" }}>*</sup></label>
              <input type="password" id="password" required value={formData.password} onChange={handleInputChange} />
            </div>
          </div>
          {/* Second row */}
          <div className="form-row">
            <div className="form-group">
              <label style={{ marginLeft: "-310px" }} htmlFor="technical-skills">Skill <sup style={{ color: "red", fontSize: "10px" }}>*</sup></label>
              <select id="technical-skills" required value={formData.skill} onChange={handleInputChange}>
                <option value="">Please select your skill</option>
                <option value="Artist">Artist</option>
                <option value="Builder">Builder</option>
                <option value="Decorator">Decorator</option>
                <option value="Electrician">Electrician</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ marginLeft: "-150px" }} htmlFor="address">Address <span>(only visible to you) <sup style={{ color: "red", fontSize: "10px" }}>*</sup></span></label>
              <input type="text" id="address" required value={formData.address} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="service-area">Service Area<sup style={{ color: "red", fontSize: "10px" }}>*</sup></label>
              <select id="service-area" required value={formData.service_area} onChange={handleInputChange}>
                <option value="">Select your area of coverage </option>
                <option value="1km">1km</option>
                <option value="5km">5km</option>
                <option value="10km">10km</option>
                <option value="20km">20km</option>
                <option value="Custom distance">Custom distance</option>
              </select>
            </div>
          </div>
          {/* Fourth row */}
          <div className="form-row">
            <div className="form-group bio-group">
              <label style={{ marginLeft: "-510px" }} htmlFor="bio">Bio<sup style={{ color: "red", fontSize: "10px" }}>*</sup></label>
              <textarea id="bio" required maxLength={200} value={formData.bio} onChange={handleTextAreaChange} />
            </div>
            <div className="form-group video-group">
              <label htmlFor="intro-video">Introductory Video <span>(optional)<sup style={{ color: "red", fontSize: "10px" }}>*</sup></span></label>
              <div className="video-upload">
                <div className="dotted-border-video">
                  <img src="/images/videocam.png" alt="video camera" />
                </div>
              </div>
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">Next Step</button>
          </div>
        </form>
      </div>
    </>
  );
}
export default Nextstep;