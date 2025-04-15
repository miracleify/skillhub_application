import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/laststep.css";

function Laststep() {
  const Navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("consumer");
  const [showModal, setShowModal] = useState(false);
  const [progressSteps] = useState([
    { id: 0, text: "Basic Details", longText: "Basic Details", completed: false },
    { id: 1, text: "Profile Information", longText: "Profile Information", completed: false },
    { id: 2, text: "Verification", longText: "Verification", completed: true }
  ]);

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    Navigate('/getstarted');
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    Navigate('/consumerbtn');
  };

  const laststep = () => {
    Navigate('/laststep');
  };

  const handleCreateAccount = () => {
    setShowModal(true);
  };

  const handleContinue = () => {
    setShowModal(false);
    
    // Add any navigation or further actions here
  };

  return (
    <>
      <div className={`last-page ${showModal ? 'blur-background' : ''}`}>
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

          <form className="lastform">
          </form>
        </div>

        <div className="lastdiv">
          <div className="profilepices">
            <div className="dotted-border">
              <img src="/images/cam.png" alt="video camera" />
            </div>
            <div className="text">
              <span>Drag & drop or click to upload an image of your choice.</span>
              <span>(PLEASE ENSURE IMAGE IS CLEAR AND SHOWS YOUR FACE)</span>
            </div>
          </div>

          <div className="profilepices">
            <div className="dotted-border">
              <img src="/images/mobile.png" alt="video camera" />
            </div>
            <div className="text">
              <span>Click to take a photo of your face</span>
              <span>ENSURE PHOTO IS TAKEN IN WELL LIT CONDITIONS</span>
            </div>
          </div>

          <div className="captions">
            <h3>Acceptable forms of ID - Passport, Drivers License, etc..</h3>
            <h3 style={{ marginLeft: "80px" }}>Why do we need this? <a href="" style={{ color: "blue" }}>Find Out</a></h3>
          </div>
          <div className="form-input">
            <label htmlFor="number">BVN (X-digits) <sup style={{ color: "red", fontSize: "10px" }}>*</sup></label> <br></br>
            <input className="input-bar" type="number" id="number" placeholder="Enter your BVN" required />
          </div>
          <br /> <br />
          <div className="last-btn">
            <button id="save-btn" className="btns">Save information</button>
            <button id="create-btn" className="btns" onClick={handleCreateAccount}>Create Account</button>
          </div>
        </div>
      </div>

      {/* Congratulations Modal/Popover */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>CONGRATULATIONS</h2>
            <h3>Your account has been set up and you are almost ready to start selling your skill! Your profile will be verified within 3 - 5 working days.</h3>
            <button className="continue-btn" onClick={handleContinue}>Continue</button>
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
          color:  #007bff;
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
          background-color:rgb(35, 112, 194);
        }
      `}</style>
    </>
  );
}

export default Laststep;