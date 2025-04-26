import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../loginSection/loginsectionStyles/dashboard.css";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
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

  return (
    <div className={`nav-containers ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbars">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/">
            <img src="/image.png" alt="Logo" />
          </Link>

          <div className="profile-icons">
            <ul>
                <li><i class="fa-solid fa-message"></i></li>
                <li><i class="fa-solid fa-bell"></i></li>
                <li><i class="fa-regular fa-user"></i></li>
                <select>
                    <option value="profile"><Link to="/profile">My Profile</Link></option>
                    <option value="setting"><Link to="/settings">Settings</Link></option>
                    <option value="log out"><Link to="/sign">log out</Link></option>
                </select>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;