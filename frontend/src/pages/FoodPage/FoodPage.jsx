import React, { useState, useEffect } from "react";
import MealsList from "../../components/MealsList/MealsList";
import SnackList from "../../components/SnackList/SnackList";
import AICompanionModal from "../../components/AICompanion/AICompanion";
import { Link } from "react-router-dom";
import "./FoodPage.css";
// import Select from 'react-select'

function FoodPage({ user, setUser }) {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [energyLevel, setEnergyLevel] = useState("");
  const [allergy, setAllergy] = useState("");
  const [showAllMeals, setShowAllMeals] = useState(false);
  const [buttonText, setButtonText] = useState(true);
  console.log("user in FoodPage:", user);


  return (
    <div className="food-page">
      <header className="food-header">
        <h1 className="meals-header">Meals & Snacks</h1>
        <div className="food-controls">
          {/* <div> */}
          <div className="dropdown-group">
            <div className="energy-drop">
              <label htmlFor="energySelect" className="energy-select">
                Energy Level
              </label>

              <select
                id="energySelect"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value)}
                required
                className={`energy-select ${energyLevel.toLowerCase()}-option`}
              >
                <option value="">None</option>
                <option value="tired">Tired</option>
                <option value="stressed">Stressed</option>
                <option value="energetic">Energetic</option>
                <option value="all">All</option>
              </select>
              {/* </div> */}
            </div>

            <div className="allergy-drop">
              <label htmlFor="energySelect" className="allergy-select">
                Allergies
              </label>

              <select
                value={allergy}
                onChange={(e) => setAllergy(e.target.value)}
                className={`allergy ${allergy.toLowerCase()}`}
              >
                <option>My Allergies</option>
                <option>None</option>
              </select>
            </div>
          </div>

          {/* <div className="profile-icon">👤</div> */}
          {/* ^Make this the actual profile photo */}
        </div>
      </header>

      <main className="food-main">
        <section className="snacks-section">
          <h2> Recommended Snacks</h2>
          <div className="snacks-grid">
            {/* Snack Cards Go Here */}
            <SnackList energyLevel={energyLevel} allergy={allergy} />
          </div>
        </section>

        <section className="meals-section">
          <h2>Meals For You</h2>
          <div className="meals-grid">
            <div className="button-wrapper">
              <button
                type="button"
                className="toggle-meals-button"
                onClick={() => {
                  setShowAllMeals((prev) => !prev), setButtonText(!buttonText);
                }}
              >
                {buttonText ? "Show All" : "Show Recommended"}
              </button>
            </div>

            <MealsList showAll={showAllMeals} />
          </div>
        </section>

        {/* <Select options={options} /> */}

        <button
          type="button"
          className="ai-companion-button"
          onClick={() => setIsAIModalOpen(true)}
        >
          <img
            src="BWell-Astro.png"
            alt="ai companion"
            width="60px"
            className="img-ai"
          ></img>
          <span className="chat-message"> Chat With Me!</span>
        </button>
        {isAIModalOpen && (
          <AICompanionModal
            onClose={() => setIsAIModalOpen(false)}
            user={user}
          />
        )}
      </main>
    </div>
  );
}

export default FoodPage;

// Inside JSX:
