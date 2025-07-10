import React from "react";
import "./LandingPage.css";

export default function LandingPage() {
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
        <button className="get-started-button">GET STARTED</button>
      </div>



      <div className="footer-wrapper">
        <div className="astro-gif-container">
          <img
            src="/Astro1.png"
            alt="Astro animation"
            width="200"
            height="230"
          />
        </div>
                <img
            src="/Codey.gif"
            alt="Astro animation"
            width="400"
            height="220"
            className="codey-gif-container"
          />
        <img src="/forest.png" className="above-footer-animation2" alt="forest"/>
        <img src="/grass.png" className="above-footer-animation" alt="grass" />
        <footer className="footer">©2025 WellForce</footer>
      </div>
    </>
  );
}
