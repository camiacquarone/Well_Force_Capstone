




import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`navbar-container ${isOpen ? "open" : ""}`}>
      <div className="navbar">
        {isOpen ? (
          <>
            <button className="close-button" onClick={toggleNavBar}>×</button>
            <nav className="navbar-links">
              <Link to="/profile" onClick={toggleNavBar}>Settings</Link>
              <Link to="/" onClick={toggleNavBar}>Landing Page</Link>
              <Link to="/home" onClick={toggleNavBar}>Home Page</Link>
            </nav>
          </>
        ) : (
          <button className="hamburger-button" onClick={toggleNavBar}>
            ☰
          </button>
        )}
      </div>
    </div>
  );
}

export default NavBar;



