import React, { useState, useContext, useEffect } from "react";
import SnackModal from "/src/components/SnackModal/SnackModal.jsx";
import { CaloriesContext } from "/src/components/CalorieTracker/CaloriesContext.jsx";
import { useAuth, useUser } from "@clerk/clerk-react";
import "../SnackCard/SnackCard.css";
import axios from "axios";

const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

export default function SnackCard({ snack, onMoveToEnd }) {
  const [showModal, setShowModal] = useState(false);
  const { addCalories, refreshCalories } = useContext(CaloriesContext);

  const [eatCount, setEatCount] = useState(0);
  const [showFuelPopup, setShowFuelPopup] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;
  const ERROR_IMG = "/snack_not_found.png";

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = await getToken();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          .toISOString()
          .split("T")[0];
        if (!today || today === "1970-01-01") {
          console.error("Invalid date generated:", today);
          return;
        }

        const res = await axios.get(`${baseUrl}/api/snacks/log/count`, {
          params: { userId, snackId: snack.id, date: today },
          headers: { Authorization: `Bearer ${token}` },
        });

        setEatCount(res.data.count || 0);
        console.log("🍴 Loaded snack count:", res.data.count || 0);
      } catch (err) {
        console.error("Failed to load snack count:", err);
      }
    };

    fetchCount();
  }, []);

  const handleAddCalories = async () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      .toISOString()
      .split("T")[0];
    if (!today || today === "1970-01-01") {
      console.error("Invalid date generated:", today);
      return;
    }

    const token = await getToken();

    try {
      await axios.post(
        `${baseUrl}/api/snacks/log`,
        { userId, snackId: snack.id, date: today, count: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const snackCalories = parseInt(snack.nutritional_info?.[0]?.calories);
      if (!isNaN(snackCalories)) {
        addCalories(today, snackCalories);
        // refreshCalories();
        setEatCount((prev) => prev + 1);
        setShowFuelPopup(true);
        setTimeout(() => setShowFuelPopup(false), 2000);
      }
    } catch (error) {
      console.error("Snack log failed:", error);
    }
  };

  const handleSubtractCalories = async () => {
    if (eatCount <= 0) {
      console.warn("Cannot subtract below zero");
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      .toISOString()
      .split("T")[0];
    if (!today || today === "1970-01-01") {
      console.error("Invalid date generated:", today);
      return;
    }

    const token = await getToken();

    try {
      await axios.post(
        `${baseUrl}/api/snacks/log`,
        { userId, snackId: snack.id, date: today, count: -1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const snackCalories = parseInt(snack.nutritional_info?.[0]?.calories);
      if (!isNaN(snackCalories)) {
        // addCalories(today, -snackCalories);
        await refreshCalories();
        setEatCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Snack subtraction failed:", error);
    }
  };

  return (
    <>
      <div className="snack-card">
        {/* The new "move to end" button */}
        {onMoveToEnd && ( // Only render if the prop exists
          <button className="move-to-end-button" onClick={() => onMoveToEnd(snack.id)}>
            <span className="x-icon">×</span>
          </button>
        )}

        <h3 className="snack-card-title">{snack.name}</h3>
        <div className="snack-image-container">
          <img
            src={snack.image_url}
            alt={snack.name}
            className={`snack-card-img ${showFuelPopup ? "dimmed" : ""}`}
            onClick={() => setShowModal(true)}
            onError={(e) => {
              e.target.src = ERROR_IMG;
            }}
          />
          <div className="hover-text">What's Inside?</div>
          {showFuelPopup && <div className="fuel-popup">Fuel Logged!</div>}
        </div>

        <button className="eaten-button">Eaten Today: {eatCount}</button>
        <div>
          <button
            className="sub-calories-button"
            onClick={handleSubtractCalories}
          >
            ➖
          </button>
          <button className="add-calories-button" onClick={handleAddCalories}>
            ➕
          </button>
        </div>
      </div>

      {showModal && (
        <SnackModal snack={snack} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}