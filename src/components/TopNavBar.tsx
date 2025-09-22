import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toriiLogo from "../assets/torii-gate-japan-svgrepo-com.svg";
import "./TopNavBar.styles.css";

const TopNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "bg" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-lg border-bottom py-3 sticky-top">
      <div className="container">
        <NavLink
          className="navbar-brand d-flex align-items-center gap-3 text-decoration-none hover-lift"
          to="/"
        >
          <div className="logo-container p-2 rounded-circle bg-light shadow-sm">
            <img src={toriiLogo} alt="Logo" width="28" height="28" />
          </div>
          <span className="fw-bold text-dark fs-4 brand-text">
            {t("topNav.brand")}
          </span>
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
          <div className={`hamburger ${isOpen ? "active" : ""}`}>
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
                {t("topNav.dashboard")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/users"
                className="nav-link text-dark fw-medium px-3 py-2 rounded-pill nav-hover"
                onClick={() => setIsOpen(false)}
              >
                {t("topNav.users")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/settings"
                className="nav-link text-dark fw-medium px-3 py-2 rounded-pill nav-hover"
                onClick={() => setIsOpen(false)}
              >
                {t("topNav.settings")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/login"
                className="btn px-4 py-2 rounded-pill login-btn d-flex justify-content-center"
                onClick={() => setIsOpen(false)}
              >
                {t("topNav.login")}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/register"
                className="btn px-4 py-2 rounded-pill login-btn d-flex justify-content-center"
                onClick={() => setIsOpen(false)}
              >
                {t("topNav.register")}
              </NavLink>
            </li>

            {/* ✅ Language toggle button */}
            <li className="nav-item">
              <button
                onClick={toggleLanguage}
                className="btn btn-outline-dark px-3 py-2 rounded-pill"
              >
                {i18n.language === "en" ? "BG" : "EN"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
