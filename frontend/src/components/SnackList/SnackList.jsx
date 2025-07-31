
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import SnackCard from "../../components/SnackCard/SnackCard";
import "./SnackList.css";
import AddSnackModal from "../../components/SnackCard/AddSnackModal";

export default function SnackList({ energyLevel, allergy }) {
  const [snacks, setSnacks] = useState([]);
  const [filteredSnacks, setFilteredSnacks] = useState([]);
  const [userAllergies, setUserAllergies] = useState([]);
  const { getToken } = useAuth();
  const [ignoreAllergiesFilter, setIgnoreAllergiesFilter] = useState(false);
  const [userCustomSnacks, setUserCustomSnacks] = useState([]);
  const [showAddSnackModal, setShowAddSnackModal] = useState(false);

  const handleMoveToEnd = (snackIdToMove) => {
    setFilteredSnacks(prevSnacks => {
      // Find the snack to move
      const snackToMove = prevSnacks.find(s => s.id === snackIdToMove);
      if (!snackToMove) {
        console.warn(`Snack with ID ${snackIdToMove} not found.`);
        return prevSnacks;
      }

      // Create a new array with the snack filtered out
      const remainingSnacks = prevSnacks.filter(s => s.id !== snackIdToMove);
      
      // Return a new array with the snack appended to the end
      // This places it just before the "Add Snack" card in the rendering order.
      return [...remainingSnacks, snackToMove];
    });
  };

  useEffect(() => {
    const fetchUserAllergies = async () => {
      try {
        const token = await getToken();
        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
        const res = await axios.get(`${baseUrl}/api/users/current_user_snack`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserAllergies(res.data.allergies || []);
      } catch (err) {
        console.error("Error fetching user allergies:", err);
      }
    };

    fetchUserAllergies();
  }, [getToken]);

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
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
      setIgnoreAllergiesFilter(true);
    } else {
      setIgnoreAllergiesFilter(false);
    }
  }, [allergy]);

  const handleAddCustomSnack = (newSnack) => {
    const customSnackWithId = { ...newSnack, id: `custom-${Date.now()}` };
    setUserCustomSnacks((prevSnacks) => [...prevSnacks, customSnackWithId]);
    setShowAddSnackModal(false);
  };

  useEffect(() => {
    const allAvailableSnacks = [...snacks, ...userCustomSnacks];
    let filtered = [...allAvailableSnacks];

    if (userAllergies.length && !ignoreAllergiesFilter) {
      const lowerAllergies = userAllergies.map((a) => a.toLowerCase());
      filtered = filtered.filter((snack) => {
        const snackText = `${snack.name} ${snack.description || ""}`.toLowerCase();
        return !lowerAllergies.some((allergy) => snackText.includes(allergy));
      });
    }

    if (energyLevel && energyLevel !== "All" && energyLevel !== "Energy Level") {
      const normalizedEnergy = energyLevel.toLowerCase();
      filtered = filtered.filter((snack) =>
        snack.wellness_category?.some((category) =>
          category.toLowerCase().includes(normalizedEnergy)
        )
      );
    }

    setFilteredSnacks(filtered);
  }, [snacks, userAllergies, energyLevel, ignoreAllergiesFilter, userCustomSnacks]);

  // No need to sort if we are placing the add-snack-card explicitly
  // const sortedFilteredSnacks = [...filteredSnacks].sort((a, b) => {
  //     if (!a.id && !a.name) return -1;
  //     if (!b.id && !b.name) return 1;
  //     return 0;
  // });


  return (
    <div className="snack-container">
      {/* Conditionally render the modal */}
      {showAddSnackModal && (
        <AddSnackModal
          onClose={() => setShowAddSnackModal(false)}
          onAddSnack={handleAddCustomSnack}
        />
      )}

      {/* Conditionally render the "No snacks available" message */}
      {filteredSnacks.length === 0 && userCustomSnacks.length === 0 ? (
        <p>No snacks available for your selected preferences.</p>
      ) : (
        <div className="snack-scroll-wrapper">
          <div className="snack-list">
            
            {/* 1. Render all the filtered snacks first */}
            {filteredSnacks.map((snack) => (
              <SnackCard
                key={snack.id || snack.name}
                snack={snack}
                onMoveToEnd={handleMoveToEnd} // Pass the handler function as a prop
              />
            ))}

            {/* 2. Then, render the "Add Your Snack" card at the very end */}
            <div
              className="snack-card add-snack-card"
              onClick={() => setShowAddSnackModal(true)}
            >
              <h3 className="snack-card-title">Add Your Snack</h3>
              <div className="snack-image-container add-snack-image-container">
                <div className="plus-icon-wrapper">
                  <span className="plus-icon">+</span>
                </div>
              </div>
              <div className="snack-card-bottom-actions">
                <p>Click to create</p>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}