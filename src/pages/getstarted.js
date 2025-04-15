import React, { useState} from "react";
import "../styles/getstarted.css";
import {useNavigate } from "react-router-dom"

function Getstarted() {
  const Navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState("consumer");

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    Navigate('/consumerpages');  
  };
 
  
  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    Navigate('/consumerbtn');  
  };
  

  
  return (
    <div className="getstarted"> <br/>
      <div className="content-container">
        <div className="title-section">
          <h2>Create Account</h2>
          <br/>
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
        </div>
       
        <div className="profilepice" style={{width: "1200px", maxWidth: "100%"}}>
        <sup style={{color:"red",fontSize:"10px"}}>*</sup>
          <div className="dotted-border"> 
            <img src="/images/camera.png" alt="Profile pic" />
          </div>
          <div className="text">
            <span>Drag & drop or click to upload an image of your choice.</span>
            <span>(PLEASE ENSURE IMAGE IS CLEAR AND SHOWS YOUR FACE)</span>
          </div>
        </div>
      </div>
      
      <div className="form-container">
        <form className="signup-form">
          {/* First row - 3 fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullname">Full Name <sup style={{color:"red",fontSize:"10px"}}>*</sup></label>
              <input type="text" id="fullname" placeholder="Enter your full name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email<sup style={{color:"red",fontSize:"10px"}}>*</sup></label>
              <input type="email" id="email" placeholder="Enter your email address" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password<sup style={{color:"red",fontSize:"10px"}}>*</sup></label>
              <input type="password" id="password" placeholder="Create a password" required />
            </div>
          </div>
          
          {/* Second row - 3 fields */}
          <div className="form-row">
            <div className="form-group">
              <label  style={{marginLeft:"-320px"}}htmlFor="technical-skills">Skill <sup style={{color:"red",fontSize:"10px"}}>*</sup></label>
              <select id="technical-skills">
                <option value="">Please select your skill</option>
                <option value="Artist">Artist</option>
                <option value="Builder">Builder</option>
                <option value="Decorator">Decorator</option>
                <option value="Electrician">Electrician</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label style={{marginLeft:"-150px"}} htmlFor="address">Address <span>(only visible to you)<sup style={{color:"red",fontSize:"10px"}}>*</sup></span></label>
              <input type="text" id="address" placeholder="Enter your address" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="service-area">Service Area <sup style={{color:"red",fontSize:"10px"}}>*</sup></label>
              <select id="service-area">
                <option value="">Select your area of coverage</option>
                <option value="1km">1km</option>
                <option value="5km">5km</option>
                <option value="10km">10km</option>
                <option value="20km">20km</option>
                <option value="Custom distance">Custom distance</option>
              </select>
            </div>
          </div>
          
          
            
           
          
          {/* Fourth row - 2 fields */}
          <div className="form-row">
            <div className="form-group bio-group">
              <label  style={{marginLeft:"-510px"}}htmlFor="bio">Bio <sup style={{color:"red",fontSize:"10px"}}>*</sup></label>
              <textarea 
              
                id="bio"
                placeholder="Write a short bio about yourself" 
                required 
                maxLength={200}
              />
            </div>
            
            <div className="form-group video-group">
              <label  style={{marginLeft:"-335px"}}htmlFor="intro-video">Introductory Video <span>(optional)<sup style={{color:"red",fontSize:"10px"}}>*</sup></span></label>
              <div className="video-upload">
                <div className="dotted-border-video">
                  <img src="/images/videocam.png" alt="video camera"/>
                {/* <input type="file" id="intro-video" accept="video/*" /> */}
                </div>
                
              </div>
            </div>
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="submit-btn">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Getstarted;