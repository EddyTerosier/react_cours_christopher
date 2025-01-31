import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/authSlice.js";

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg tindor-navbar">
      <div className="container">
        {/* Logo / Brand */}
        <Link to="/" className="navbar-brand tindor-brand">
          Tindor
        </Link>

        {/* Hamburger */}
        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/matches" className="nav-link">
                Matches
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/chat" className="nav-link">
                Messages
              </Link>
            </li>
            {auth.token && (
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
