import React from "react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ConsumerBTN() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("consumer");
  
  // Add state for form inputs
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: ""
  });
  
  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    navigate('/consumerpage');
  };
  
  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    navigate('/consumerbtn');
  };
  const changepage = ()=>{
    navigate("/nextstep")
  }
  
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
    console.log("Form submitted:", formData);
    
  };
  
  const [progressSteps] = useState([
    { id: 0, text: "Basic Details", longText: "Basic Details", completed: true },
    { id: 1, text: "Profile Information", longText: "Profile Information", completed: false },
  
  ]);
  
  return (
    <>
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
        
        <div className="form-container">
         
            <img className="login-pic" src="./images/image.png" alt="Login" />
        
          <form className="newform" onSubmit={handleSubmit}> 
            <br/>
          <div className="input-labels">
          <label>
    
    <h3 style={{marginLeft:"-340px"}}className="label-text">Email<sup style={{color:"red",fontSize:"10px"}}>*</sup> </h3>
    <input className="bar"
      type="text"
      name="name"
      value={formData.name}
      onChange={handleInputChange}
      placeholder="enter your name"
      required
    />
  </label>
  <br/>
  <label>
    <h3 style={{marginLeft:"-310px"}}className="label-text">Password<sup style={{color:"red",fontSize:"10px"}}>*</sup> </h3>
    <input className="bar"
      type="password"
      name="password"
      value={formData.password}
      onChange={handleInputChange}
      placeholder="enter your password"
      required
    />
  </label> <br/>
  
  <label>
    <h3  style={{marginLeft:"-250px"}}className="label-text">Confirm password <sup style={{color:"red",fontSize:"10px"}}>*</sup> </h3>
    <input className="bar"
      type="password"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleInputChange}
      placeholder="confirm your password"
      required
    />
  </label>
          </div>
            <br/><br/>
            
            <button  onClick={changepage} className="next-btn" type="submit">Next Step</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ConsumerBTN;