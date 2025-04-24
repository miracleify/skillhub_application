import React, { useState, useEffect } from "react";
import { useTrades } from "../TradesContext";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/hiringartisanPage.css"; 

function HiringartisanPage() {
  const { tradespeople } = useTrades();
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state to track input values
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    jobDescription: "",
    startDate: "",
    endDate: "",
    startTime: "",
    notes: "",
    checkbox: "",
  });

  // Load user data from multiple sources
  useEffect(() => {
    console.log("Looking for tradesperson with ID:", id);
    
    // First try to find the person in tradespeople context
    let foundPerson = tradespeople && tradespeople.length > 0
      ? tradespeople.find(p => p.id === parseInt(id) || p.id === id || p._id === id)
      : null;
      
    // If not found in context, try sessionStorage
    if (!foundPerson) {
      try {
        const storedPerson = sessionStorage.getItem('selectedTradesPerson');
        if (storedPerson) {
          const parsedPerson = JSON.parse(storedPerson);
          console.log("Found person in sessionStorage:", parsedPerson);
          
          // Check if this is the person we're looking for
          if (parsedPerson.id === id || parsedPerson.id === parseInt(id) || parsedPerson._id === id) {
            foundPerson = parsedPerson;
          }
        }
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
      }
    }
    
    setPerson(foundPerson);
    setIsLoading(false);
  }, [id, tradespeople]);
  
  function hireArtisan(){
    navigate("/hirepage")
  }

  // Handle input changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e, action) => {
    e.preventDefault();
    console.log("Form submitted with action:", action);
    console.log("Form data:", formData);

    // Here you would typically send this data to your backend
    alert(
      `${action} for ${person?.fname} ${person?.lname} submitted successfully!`
    );
  };

  // Check if data is still loading
  if (isLoading) {
    return (
      <div className="div-container">
        <h1>Loading...</h1>
        <p>Fetching tradesperson data...</p>
      </div>
    );
  }

  // Check if person is found
  if (!person) {
    return (
      <div className="div-container">
        <h1>Person Not Found</h1>
        <p>Could not find tradesperson with ID: {id}</p>
        <p>Debug info: {sessionStorage.getItem('selectedTradesPerson') ? "User exists in session storage" : "No user in session storage"}</p>
        <button onClick={() => navigate("/")} className="hire-button">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="div">
      <br></br> <br /><br></br> <br />
      <div className="">
        <div className="profile-header">
          <img
            src={person.image}
            className="viewprofile-img"
            alt={person.fname}
          />

          <div className="profile-details">
            <h2 className="viewprofile-name">
              {person.fname} {person.lname}
              {person.verified && (
                <i className="fa-solid fa-circle-check verification-icon"></i>
              )}
            </h2>

            <p className="viewprofile-expertise">
              <strong>Expertise:</strong> {person.expertise}
            </p>

            <p className="viewprofile-location">
              <strong>Service Area:</strong> {person.location}
            </p>

            <div className="ratings">
              <strong>Overall Rating:</strong>
              <span className="rating-stars">{person.ratings}</span>
            </div>
          </div>
        </div>
      </div>
      <form
        onSubmit={(e) => handleSubmit(e, "Confirm & Hire")}
        className="form-container"
      >
        {/* Name and Email in one row */}
        <div className="form-row field-appear">
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
            </label>
            <input
              className="input-animated"
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email<sup style={{ color: "red", fontSize: "10px" }}>*</sup>
            </label>
            <input
              className="input-animated"
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Job Description on its own line with increased height */}
        <div className="form-row field-appear">
          <div className="form-group full-width">
            <label htmlFor="jobDescription">
              Job Description
              <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
            </label>
            <textarea
              className="textarea-input input-animated"
              id="jobDescription"
              placeholder={`Give a detailed description of what you want ${person.fname} to do for you?`}
              value={formData.jobDescription}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Three date fields in one row */}
        <div className="form-row field-appear">
          <div className="form-group">
            <label htmlFor="startDate">
              Start date<sup style={{ color: "red", fontSize: "10px" }}>*</sup>
            </label>
            <input
              className="input-animated"
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">
              End date<sup style={{ color: "red", fontSize: "10px" }}>*</sup>
            </label>
            <input
              className="input-animated"
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">
              Preferred Start Time{" "}
              <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
            </label>
            <input
              className="input-animated"
              type="time"
              id="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row field-appear">
          <div className="form-group full-width">
            <label htmlFor="notes">Notes/Special Requests (Optional) <sup style={{ color: "red", fontSize: "10px" }}>*</sup></label>
            <textarea
              className="textarea-input input-animated"
              id="notes"
              placeholder={`Is there anything you would like ${person.fname} to know?`}
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
         
        </div>
        <div className="form-row field-appear">
            <div className="form-group full-width" id="chexkbox-container">
              <input
                id="checkbox"
                value={formData.checkbox}
                onChange={handleChange}
                type="checkbox"
                required
              />

              <label htmlFor="checkbox">
                By checking this box you agree to skillhub's <a href="">terms & condtions</a>
              </label>
            </div>
          </div>
        {/* Buttons */}
        <div className="button-group">
          <button
            className="quote-btn"
            type="button"
            onClick={(e) => handleSubmit(e, "Request A Quote")}
          >
            Request A Quote
          </button>
          <button onClick={hireArtisan} className="hiring-btn" id="hire" type="submit" >
            Confirm & Hire
          </button>
        </div>
      </form>
    </div>
  );
}

export default HiringartisanPage;