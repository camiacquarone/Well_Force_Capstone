




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

// import React from "react";
// import { Link } from "react-router-dom";
// import "./NavBar.css";

// function NavBar({ isOpen, toggleNavBar }) {
    
//   return (
//     <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>
//       <div className="link_to_pages">
//         <Link to="/profile">Settings</Link>
//         <Link to="/">Landing Page</Link>
//       </div>
//       <button className="toggle-button" onClick={toggleNavBar}>
//         <span className="material-icons">arrow_forward</span>
//       </button>
//     </nav>
//   );
// }

// export default NavBar;


