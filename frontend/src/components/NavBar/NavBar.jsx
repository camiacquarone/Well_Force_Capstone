import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavBar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("nav-open");
      document.body.classList.remove("nav-closed");
    } else {
      document.body.classList.add("nav-closed");
      document.body.classList.remove("nav-open");
    }
  }, [isOpen]);

  return (
    <div className="navbar-container">
      <div className="navbar">
        {!isOpen && (
          <>
            <button className="hamburger-button" onClick={toggleNavBar}>
              ☰
            </button>

            <Link to="/home">
              <img
                src="/home.png"
                className="home-closed"
                alt="home"
                width="50px"
                height="35px"
                style={{ cursor: "pointer" }}
              />
            </Link>
            <Link to="/meals">
              <img
                src="/food.png"
                className="food-closed"
                alt="food"
                width="50px"
                height="35px"
                style={{ cursor: "pointer" }}
              />
            </Link>
            <Link to="/profile">
              <img
                src="/settings.png"
                className="settings-closed"
                alt="settings"
                width="50px"
                height="50px"
                style={{ cursor: "pointer" }}
              />
            </Link>
            <div className="pfp">
              <SignedOut>
                <SignInButton
                  mode="modal"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
                >
                  Sign In
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
                <div className="text-gray-700 text-sm md:text-base"></div>
              </SignedIn>
            </div>
          </>
        )}
        <div className="open">
          {isOpen && (
            <>
              <span className="navbar-banner">
                <img
                  src="/salesforce_logo.png"
                  className="navbar-logo"
                  alt="Salesforce Logo"
                />
                <h1 className="navbar-title">WellForce</h1>
              </span>

              <button className="close-button" onClick={toggleNavBar}>
                ×
              </button>
              <nav className="navbar-links">
                <span className="home" onClick={toggleNavBar}>
                  <img src="/home.png" alt="home" width="55px" height="35px" />
                  <Link to="/home">Home Page</Link>
                </span>
                <span className="food" onClick={toggleNavBar}>
                  <img src="/food.png" alt="food" width="50px" height="35px" />
                  <Link to="/meals">Meals Page</Link>
                </span>
                <span className="settings" onClick={toggleNavBar}>
                  <img
                    src="/settings.png"
                    alt="settings"
                    width="60px"
                    height="40px"
                  />
                  <Link to="/profile">Settings</Link>
                </span>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
