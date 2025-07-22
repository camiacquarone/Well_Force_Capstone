import React, { useState, useEffect } from "react";
import MealsList from "../../components/MealsList/MealsList";
import SnackList from "../../components/SnackList/SnackList";
import AICompanionModal from "../../components/AICompanion/AICompanion";
import { Link } from "react-router-dom";
import "./FoodPage.css";

function FoodPage() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div className="food-page">
      <header className="food-header">
        <h1>Meals & Snacks</h1>
        <div className="food-controls">
          <div className="dropdown-group">
            <select>
              <option>Energy Level</option>
              <option>Tired</option>
              <option>Stressed</option>
              <option>Energetic</option>
            </select>

            <select>
              <option>Allergies</option>
              <option>My Allergies</option>
              <option>None</option>
            </select>
          </div>

          <div className="profile-icon">👤</div>
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

        <button
          type="button"
          className="ai-companion-button"
          onClick={() => setIsAIModalOpen(true)}
        >
          <img src="astro-profile-selected.png" alt="ai companion" width="60px" className="img-ai"></img>
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
