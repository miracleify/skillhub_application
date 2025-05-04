import React, { useState } from "react";
import "../styles/contact.css";
import { sendContactUs } from "../services/contactService";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await sendContactUs(formData);
      setSuccess("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        message: ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-container">
      <div className="contact-content">
        <br></br> <br></br><br></br>
        <div className="contactimg">
        <img 
            src="./images/contact.png" 
            alt="Contact page illustration" 
            className="contact-img1"
          />
        </div>
        <h2 className="contact-us">Contact Us</h2>
        <p className="contact-subtitle">Let's get in touch. We're happy to help!</p>
      </div>
      
      <div className="contact-body">
        <div className="contact-image-wrapper">
          <img 
            src="./images/contact.png" 
            alt="Contact page illustration" 
            className="contact-img"
          />
        </div>
        
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="contact-label">
                Name<sup className="mandatory-asterisk">*</sup>
              </label>
              <input
                className="contact-input-field"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="contact-label">
                Email<sup className="mandatory-asterisk">*</sup>
              </label>
              <input
                className="contact-input-field"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="contact-label">
                Phone Number<sup className="mandatory-asterisk">*</sup>
              </label>
              <input
                className="contact-input-field"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="contact-label">
                Message<sup className="mandatory-asterisk">*</sup>
              </label>
              <textarea
                className="contact-message-field"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message..."
                required
              />
            </div>
            
            <button type="submit" className="send-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
            {success && <div style={{ color: "green", marginTop: "10px" }}>{success}</div>}
            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
          </form>
        </div>
      </div>
    </main>
  );
}

export default Contact;