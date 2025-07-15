
import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar({ isOpen, toggleNavBar }) {
    
  return (
    <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="link_to_pages">
        <Link to="/profile">Settings</Link>
        <Link to="/">Landing Page</Link>
      </div>
      <button className="toggle-button" onClick={toggleNavBar}>
        <span className="material-icons">arrow_forward</span>
      </button>
    </nav>
  );
}

export default NavBar;



// import { useState } from "react";
// import { Link } from "react-router-dom";
// import "./Sidebar.css";

// function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
//       <div className="sidebar">
//         {isOpen ? (
//           <>
//             <button className="close-button" onClick={toggleSidebar}>×</button>
//             <nav className="sidebar-links">
//               <Link to="/profile" onClick={toggleSidebar}>Settings</Link>
//               <Link to="/" onClick={toggleSidebar}>Landing Page</Link>
//             </nav>
//           </>
//         ) : (
//           <button className="hamburger-button" onClick={toggleSidebar}>
//             ☰
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;
