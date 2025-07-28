import AICompanionModal from "../../components/AICompanion/AICompanion";
import React, { useState, useEffect } from "react";
import axios from "axios";

import "../../App/App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

import "../HomePage/HomePage.css";
import Graph from "../../components/Graph/Graph";
import Carousel from "../../components/Carousel/Carousel";
import Info from "../../components/DisplayInfo/DisplayInfo";
import NavBar from "../../components/NavBar/NavBar";

import "../HomePage/HomePage.css";
import HabitCard from "../../components/Habit Card/HabitCard";

const HomePage = ({ user, setUser }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [snacks, setSnacks] = useState([]); // All fetched snacks
  const [filteredSnacks, setFilteredSnacks] = useState([]); // Snacks after filtering
  const [userAllergies, setUserAllergies] = useState([]); // User's allergies from backend profile
  const [ignoreAllergiesFilter, setIgnoreAllergiesFilter] = useState(false); // Controls allergy filter
  const [selectedEnergyLevel, setSelectedEnergyLevel] = useState("All"); // User's selected energy level
  const [selectedAllergyFilter, setSelectedAllergyFilter] = useState("All"); // User's selected allergy filter (e.g., "None", "Peanuts")

  const [isSnacksLoading, setIsSnacksLoading] = useState(true); // Loading state for snacks
  const [snacksError, setSnacksError] = useState(null); // Error state for snacks

  useEffect(() => {
    console.log("HomePage.jsx - Received user prop:", user);
  }, [user]);

  useEffect(() => {
    const fetchAllSnacks = async () => {
      setIsSnacksLoading(true);
      setSnacksError(null);
      try {
        const res = await axios.get("http://localhost:3000/api/snacks");
        setSnacks(res.data);
        console.log("📦 All snacks loaded:", res.data);
      } catch (err) {
        console.error("Error fetching all snacks:", err);
        setSnacksError("Failed to load snacks.");
      } finally {
        setIsSnacksLoading(false);
      }
    };

    fetchAllSnacks();
  }, []);

  useEffect(() => {
    if (selectedAllergyFilter === "None") {
      // Assuming "None" means ignore allergies
      setIgnoreAllergiesFilter(true);
    } else {
      setIgnoreAllergiesFilter(false);
    }
  }, [selectedAllergyFilter]);

  useEffect(() => {
    let filtered = [...snacks]; // Start with all snacks

    // Allergies filtering
    if (userAllergies.length > 0 && !ignoreAllergiesFilter) {
      const lowerAllergies = userAllergies.map((a) => a.toLowerCase());
      filtered = filtered.filter((snack) => {
        // Assuming snack.description contains ingredients/allergens
        const snackText = `${snack.name} ${
          snack.description || ""
        }`.toLowerCase();
        return !lowerAllergies.some((allergy) => snackText.includes(allergy));
      });
      console.log("Snacks after allergy filter:", filtered.length);
    }

    // Energy level filtering (assuming wellness_category is an array of strings)
    if (
      selectedEnergyLevel &&
      selectedEnergyLevel !== "All" &&
      selectedEnergyLevel !== "Energy Level"
    ) {
      const normalizedEnergy = selectedEnergyLevel.toLowerCase();
      filtered = filtered.filter((snack) =>
        snack.wellness_category?.some((category) =>
          category.toLowerCase().includes(normalizedEnergy)
        )
      );
      console.log("Snacks after energy filter:", filtered.length);
    }

    setFilteredSnacks(filtered);
  }, [snacks, userAllergies, selectedEnergyLevel, ignoreAllergiesFilter]);

  return (
    <div className="home-body">
      <h1 className="welcome-user">
        Welcome, {user ? user.name || "Friend" : "Guest"}!
      </h1>
      <div className="container-temp">
        <div className="separated-container">
          <Info user={user} />
          <Carousel snacks={filteredSnacks} />
        </div>
        <span className="right-container">
        <HabitCard/>
        <div className="graph-container">
          <Graph />
        </div>

        </span>
      </div>
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
        <AICompanionModal onClose={() => setIsAIModalOpen(false)} />
      )}
    </div>
    //   </header>
    // </div>
    // </div>
  );
};

export default HomePage;
