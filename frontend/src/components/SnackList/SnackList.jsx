
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import SnackCard from "../../components/SnackCard/SnackCard";
import "./SnackList.css";

export default function SnackList({ energyLevel, allergy }) {
  const [snacks, setSnacks] = useState([]);
  const [filteredSnacks, setFilteredSnacks] = useState([]);
  const [userAllergies, setUserAllergies] = useState([]);
  const { getToken } = useAuth();
  const [ignoreAllergiesFilter, setIgnoreAllergiesFilter] = useState(false); // New state!

  
  // 1. Fetch user allergies from backend
  useEffect(() => {
  const fetchUserAllergies = async () => {
    try {
      const token = await getToken();
      const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL
      const res = await axios.get(`${baseUrl}/api/users/current_user_snack`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserAllergies(res.data.allergies || []);
    } catch (err) {
      console.error("Error fetching user allergies:", err);
    }
  };

  fetchUserAllergies();
}, []);


  // 2. Fetch all snacks
  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL
        const res = await axios.get(`${baseUrl}/api/snacks`);
        setSnacks(res.data);
        console.log("📦 Snacks loaded:", res.data);
      } catch (err) {
        console.error("Error fetching snacks:", err);
      }
    };


    fetchSnacks();
  }, []);
      useEffect(() => {
    if (allergy === "None") {
      setIgnoreAllergiesFilter(true); // If "None" is selected, ignore allergies
    } else {
      setIgnoreAllergiesFilter(false); // Otherwise, apply allergy filtering
    }
  }, [allergy]); // Run this effect whenever the 'allergy' prop changes
  // 3. Filter snacks by both allergies and energy level
  useEffect(() => {
    let filtered = [...snacks];

    // Allergies filtering
    if (userAllergies.length && !ignoreAllergiesFilter) {
      const lowerAllergies = userAllergies.map((a) => a.toLowerCase());
      filtered = filtered.filter((snack) => {
        const snackText = `${snack.name} ${snack.description}`.toLowerCase();
        return !lowerAllergies.some((allergy) => snackText.includes(allergy));
      });
    }

    // Energy level filtering
    if (energyLevel && energyLevel !== "All" && energyLevel !== "Energy Level") {
      const normalizedEnergy = energyLevel.toLowerCase();
      filtered = filtered.filter((snack) =>
        snack.wellness_category?.some((category) =>
          category.toLowerCase().includes(normalizedEnergy)
        )
      );
    }

    setFilteredSnacks(filtered);
  }, [snacks, userAllergies, energyLevel, ignoreAllergiesFilter]);

  if (!filteredSnacks.length) {
    return <p>No snacks available for your selected preferences.</p>;
  }

  return (
    <div className="snack-container">
      <div className="snack-scroll-wrapper">
        <div className="snack-list">
          {filteredSnacks.map((snack) => (
            <SnackCard key={snack.id || snack.name} snack={snack} />
          ))}
        </div>
      </div>
    </div>
  );
}
