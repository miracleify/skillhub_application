import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../loginSection/loginsectionStyles/dashboard.css";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  
  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle select menu changes
  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    
    if (selectedOption === "log out") {
      navigate("/signin");
    } else if (selectedOption === "profile") {
      // Handle profile navigation
      console.log("Navigate to profile");
    } else if (selectedOption === "setting") {
      // Handle settings navigation
      console.log("Navigate to settings");
    }
  };
  
  return (
    <div className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbars">
        {/* Logo on the left */}
        <div className="nav-logo">
          <Link to="/">
            <img src="/image.png" alt="Logo" />
          </Link>
        </div>
        
        {/* Profile icons on the right */}
        <div className="profile-icons">
          <ul>
            <li><i className="fa-solid fa-message"></i></li>
            <li><i className="fa-solid fa-bell"></i></li>
            <li><i className="fa-regular fa-user"></i></li>
            <li>
              <select onChange={handleSelectChange} defaultValue="">
              <option value="" disabled hidden>
                
              </option>
                <option className="profile" value="profile">My Profile</option>
                <option value="setting">Settings</option>
                <option className="logout" value="log out">Log Out</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;