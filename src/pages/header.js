// Header.js
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/Artisan';
import Contact from '../pages/contact';
import NotFound from '../pages/NotFound';
import Signin from '../pages/signin';
import ErrorBoundary from '../ErrorBoundary';
import Consumer from './consumer';
import Artisan from '../pages/Artisan';
import '../nav.css';
import Getstarted from './getstarted';
import ViewProfile from '../viewprofile';
import { FaBars, FaTimes } from 'react-icons/fa';
import { TradesProvider } from '../TradesContext'; // Import the context provider
import { useTrades } from '../TradesContext'; // Adjust path as needed


function Header() {
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
    <TradesProvider>
      <div>
        <div className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
          <nav className="navbar">
            {/* Logo */}
            <div className="nav-logo">
              <Link to="/">
                <img src="/image.png" alt="Logo" />
              </Link>
            </div>

            {/* Sidebar Toggle Icon (Mobile) */}
            <div className="nav-toggle" onClick={() => setSidebarOpen(true)}>
              <FaBars />
            </div>

            {/* Desktop Navigation */}
            <ul className="nav-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/artisans">Artisans</Link>
              </li>
              <li>
                <Link to="/consumer">Consumer</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li className="signin">
                <Link to="/signin">Sign In</Link>
              </li>
              <li className="get-started">
                <Link to="/signin">Get Started</Link>
              </li>
            </ul>
          </nav>

          {/* Sidebar Menu (Mobile) */}
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <FaTimes className="close-icon" onClick={() => setSidebarOpen(false)} />
            </div>
            <ul className="sidebar-list">
              <li>
                <Link to="/" onClick={() => setSidebarOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/artisans" onClick={() => setSidebarOpen(false)}>
                  Artisans
                </Link>
              </li>
              <li>
                <Link to="/consumer" onClick={() => setSidebarOpen(false)}>
                  Consumer
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => setSidebarOpen(false)}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="signin" to="/signin" onClick={() => setSidebarOpen(false)}>
                  Sign In
                </Link>
              </li>
              <li className="get-started">
                <Link to="/signin" onClick={() => setSidebarOpen(false)}>
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Overlay when sidebar is open */}
          {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
        </div>

        <Routes>
          {/* Routes now don't need props */}
          <Route path="/" element={<Home />} />
          <Route path="/artisan" element={<Artisan />} />
          <Route path="/consumer" element={<Consumer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/getstarted" element={<Getstarted />} />
          <Route path="/profile/:id" element={<ViewProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </TradesProvider>
  );
}

export default Header;