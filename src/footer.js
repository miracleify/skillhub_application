import React from "react";
import "./footer.css";

function Footer() {
  const footerStyle = {
    width: "100%",
    backgroundColor: "#0468c7",
    color: "white",
    padding: "40px 0",
    boxSizing: "border-box",
    margin: 0,
    position: "absolute",
    left: 0,
    right: 0,
    height: "50vh",
  };
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>
            <span>Skill</span>Hub
          </h2>
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-x-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
        <div className="footer-columns">
          {/* Company Column */}
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Contact</li>
              <li>Blogs</li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Terms of Use</li>
              <li>Refund Policy</li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li>Help Centre</li>
              <li>FAQ</li>
              <li>Contact</li>
              <li>Refund Policy</li>
            </ul>
          </div>

          {/* Reach Us Column */}
          <div>
            <h4>Reach Us</h4>
            <ul>
              <li>+123 801 234 5678</li>
              <li>support@skillhub.com</li>
              <li>123 Mainview Point, Lagos, Nigeria</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copy Right */}
      <div className="footer-bottom">
        <p>© 2025 SkillHub. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
