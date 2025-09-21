import { useState } from "react";
import { NavLink } from "react-router-dom";
import toriiLogo from "../assets/torii-gate-japan-svgrepo-com.svg";
import './TopNavBar.styles.css';

const TopNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-lg border-bottom py-3 sticky-top">
      <div className="container">
        <NavLink 
          className="navbar-brand d-flex align-items-center gap-3 text-decoration-none hover-lift" 
          to="/"
        >
          <div className="logo-container p-2 rounded-circle bg-light shadow-sm">
            <img 
              src={toriiLogo} 
              alt="Logo" 
              width="28" 
              height="28"
              className="logo-icon"
            />
          </div>
          <span className="fw-bold text-dark fs-4 brand-text">Admin Panel</span>
        </NavLink>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler border-0 shadow-none p-2"
          type="button"
          aria-controls="topNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((v) => !v)}
        >
          <div className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Navigation items */}
        <div 
          id="topNav" 
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className="nav-link text-dark fw-medium px-3 py-2 rounded-pill nav-hover"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/users"
                className="nav-link text-dark fw-medium px-3 py-2 rounded-pill nav-hover"
                onClick={() => setIsOpen(false)}
              >
                Users
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/settings"
                className="nav-link text-dark fw-medium px-3 py-2 rounded-pill nav-hover"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/login"
                className="btn px-4 py-2 rounded-pill login-btn d-flex justify-content-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;