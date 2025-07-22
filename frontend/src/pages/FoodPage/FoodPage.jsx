import React, { useState, useEffect } from "react";
import MealsList from "../../components/MealsList/MealsList";
import SnackList from "../../components/SnackList/SnackList";
import AICompanionModal from "../../components/AICompanion/AICompanion";
import { Link } from "react-router-dom";
import "./FoodPage.css";
// import Select from 'react-select'

function FoodPage() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [energyLevel, setEnergyLevel] = useState("");
  const [allergy, setAllergy] = useState("");

  // const showTitle = energyLevel !== "";
  return (
    <div className="food-page">
      <header className="food-header">
        <h1>Meals & Snacks</h1>
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
                <option value="" disabled>
                  None
                </option>
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
                <option value="" disabled>
                  Select
                </option>
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
        <section className="meals-section">
          <h2>Meals</h2>
          <div className="meals-grid">
            {/* Meal Cards Go Here */}
            <MealsList />
          </div>
        </section>

        <section className="snacks-section">
          <h2>Snacks</h2>
          <div className="snacks-grid">
            {/* Snack Cards Go Here */}
            <SnackList />
          </div>
        </section>
        {/* <Select options={options} /> */}

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
