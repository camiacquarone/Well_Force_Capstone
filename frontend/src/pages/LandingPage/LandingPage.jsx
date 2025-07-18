
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { SignUp, useAuth } from "@clerk/clerk-react";
import React, { useState, useEffect } from "react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  //   React.useEffect(() => {
  //     if (isSignedIn) {
  //       navigate("/home", { replace: true });
  //     }
  //   }, [isSignedIn, navigate]);
  useEffect(() => {
    document.body.classList.remove("nav-closed");
  }, []);

  return (
    <>
      <div className="landing-page-text">
        <div className="banner">
          <img
            src="/salesforce_logo.png"
            className="logo"
            alt="Salesforce Logo"
          />

          <h1 className="title">WellForce</h1>
        </div>

        <h2 className="landing-page-message">
          Nourishing Your Journey with Smart Snacking and Mindful Meals ©
        </h2>
        <button
          className="get-started-button"
          onClick={() => navigate("/sign-up")}
        >
          GET STARTED
        </button>
      </div>

      <div className="footer-wrapper">
        <img
          src="/Astro1.png"
          alt="Astro animation"
          width="200"
          height="230"
          className="astro-gif-container"
        />

        <img
          src="/Codey.gif"
          alt="Astro animation"
          width="400"
          height="220"
          className="codey-gif-container"
        />
        <img
          src="/Einstein1.png"
          alt="Astro animation"
          width="400"
          height="220"
          className="einstein-container"
        />
        <img
          src="/Appy.png"
          alt="Astro animation"
          width="400"
          height="220"
          className="appy-container"
        />
        <img
          src="/Ruth.png"
          alt="Astro animation"
          width="400"
          height="220"
          className="ruth-container"
        />
        <img
          src="/forest.png"
          className="above-footer-animation2"
          alt="forest"
        />
        <img src="/grass.png" className="above-footer-animation" alt="grass" />
        <footer className="footer">©2025 WellForce</footer>
      </div>
    </>
  );
}
