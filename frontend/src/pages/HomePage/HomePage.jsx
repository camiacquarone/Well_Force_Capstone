import AICompanionModal from "../../components/AICompanion/AICompanion";
import React, { useState, useEffect } from "react";
import axios from "axios";

import "../../App/App.css";

import "../HomePage/HomePage.css";
import Graph from "../../components/Graph/Graph";
import Carousel from "../../components/Carousel/Carousel";
import Info from "../../components/DisplayInfo/DisplayInfo";
import NavBar from "../../components/NavBar/NavBar";

import "../HomePage/HomePage.css";
import HabitCard from "../../components/Habit Card/HabitCard";

const HomePage = ({ user, setUser }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [snacks, setSnacks] = useState([]);
  const [filteredSnacks, setFilteredSnacks] = useState([]);
  const [userAllergies, setUserAllergies] = useState([]);
  const [ignoreAllergiesFilter, setIgnoreAllergiesFilter] = useState(false);
  const [selectedEnergyLevel, setSelectedEnergyLevel] = useState("All");
  const [selectedAllergyFilter, setSelectedAllergyFilter] = useState("All");
  const [dailyCalories, setDailyCalories] = useState({});

  const [isSnacksLoading, setIsSnacksLoading] = useState(true);
  const [snacksError, setSnacksError] = useState(null);

  useEffect(() => {
    console.log("HomePage.jsx - Received user prop:", user);
  }, [user]);

  useEffect(() => {
    const fetchAllSnacks = async () => {
      setIsSnacksLoading(true);
      setSnacksError(null);
      try {
        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
        const res = await axios.get(`${baseUrl}/api/snacks`);
        setSnacks(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching all snacks:", err);
      }
      setIsSnacksLoading(false);
    };

    fetchAllSnacks();
  }, []);
  useEffect(() => {
    const fetchCaloriesPerDay = async () => {
      if (!user?.clerkId) return;
      try {
        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
        const res = await axios.get(`${baseUrl}/api/snacks/log/daily`, {
          params: { userId: user.clerkId },
        });
        console.log("📊 Calories per day:", res.data);
        setDailyCalories(res.data);
      } catch (err) {
        console.error("Failed to fetch daily calories:", err);
      }
    };

    fetchCaloriesPerDay();
  }, [user]);

  useEffect(() => {
    if (selectedAllergyFilter === "None") {
      setIgnoreAllergiesFilter(true);
    } else {
      setIgnoreAllergiesFilter(false);
    }
  }, [selectedAllergyFilter]);

  useEffect(() => {
    let filtered = [...snacks];

    if (userAllergies.length > 0 && !ignoreAllergiesFilter) {
      const lowerAllergies = userAllergies.map((a) => a.toLowerCase());
      filtered = filtered.filter((snack) => {
        const snackText = `${snack.name} ${
          snack.description || ""
        }`.toLowerCase();
        return !lowerAllergies.some((allergy) => snackText.includes(allergy));
      });
      console.log("Snacks after allergy filter:", filtered.length);
    }

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
      <h1 className="welcome-user">Welcome{user ? ", " + user.name : ""}!</h1>
      <div className="container-temp">
        <div className="separated-container">
          <Info user={user} />
          <Carousel snacks={filteredSnacks} />
        </div>
        <span className="right-container">
          <HabitCard />
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
        <AICompanionModal onClose={() => setIsAIModalOpen(false)} user={user} />
      )}
    </div>
  );
};

export default HomePage;
