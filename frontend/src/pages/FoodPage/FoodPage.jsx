import React, { useState, useEffect } from "react";
import MealsList from "../../components/MealsList/MealsList";
import SnackList from "../../components/SnackList/SnackList";
import AICompanionModal from "../../components/AICompanion/AICompanion";
import { Link } from "react-router-dom";
import "./FoodPage.css";

function FoodPage() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [energyLevel, setEnergyLevel] = useState("");
  const [allergy, setAllergy] = useState("");
  const [showAllMeals, setShowAllMeals] = useState(false);


  return (
    <div className="food-page">
      <header className="food-header">
        <h1>Meals & Snacks</h1>
        <div className="food-controls">
          {/* <p className="erngy-title">Energy Level</p> */}
          <div className="dropdown-group">
            <select
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value)}
              className={`energy-select ${energyLevel.toLowerCase()}-option`}
            >
              <option>Energy Level</option>
              <option>Tired</option>
              <option>Stressed</option>
              <option>Energetic</option>
              <option>All</option>
            </select>
           

            <select
              value={allergy}
              onChange={(e) => setAllergy(e.target.value)}
              className={`allergy ${allergy.toLowerCase()}`}
            >
              <option>Allergies</option>
              <option>My Allergies</option>
              <option>None</option>
            </select>
          </div>
            
          {/* <div className="profile-icon">👤</div> */}
          {/* ^Make this the actual profile photo */}
        </div>
      </header>

      <main className="food-main">
        <section className="meals-section">
          <h2>Meals</h2>
          <div className="meals-grid">
            {/* Meal Cards Go Here */}
            {/* <button className="toggle-button" onClick={() => setShowAllMeals(true)}>Show All Meals</button> */}
            <div className="button-wrapper">
              <button
                type="button"
                className="toggle-meals-button"
                onClick={() => setShowAllMeals((prev) => !prev)}>
                  See All
              </button>
              </div>

            <MealsList showAll={showAllMeals}/>
          </div>
        </section>

        <section className="snacks-section">
          <h2>Snacks</h2>
          <div className="snacks-grid">
            {/* Snack Cards Go Here */}
            <SnackList energyLevel={energyLevel} allergy={allergy} />
          </div>
        </section>

        <button
          type="button"
          className="ai-companion-button"
          onClick={() => setIsAIModalOpen(true)}
        >
          <img
            src="astro-profile-selected.png"
            alt="ai companion"
            width="60px"
            className="img-ai"
          ></img>
          Chat with me!
        </button>
        {isAIModalOpen && (
          <AICompanionModal onClose={() => setIsAIModalOpen(false)} />
        )}
      </main>
    </div>
  );
}

export default FoodPage;




// Inside JSX:

