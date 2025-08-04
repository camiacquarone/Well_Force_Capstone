import React, { useState, useContext, useEffect } from "react";
import MealModal from "/src/components/MealModal/MealModal.jsx";
import { Link } from "react-router-dom";
import "../MealsCard/MealsCard.css";
import { CaloriesContext } from "../CalorieTracker/CaloriesContext.jsx";
import Notification from "../Notification/Notification.jsx";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

export default function MealCard({
  meal,
  type,
  hasOrderedBefore,
  setHasOrderedBefore,
}) {
  const [showModal, setShowModal] = useState(false);
  const [eatCount, setEatCount] = useState(0);
  const [showFuelPopup, setShowFuelPopup] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { addCalories, refreshCalories } = useContext(CaloriesContext);
  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = await getToken();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          .toISOString()
          .split("T")[0];

        const res = await axios.get(`${baseUrl}/api/meals/log/count`, {
          params: { userId, mealId: meal.id, date: today },
          headers: { Authorization: `Bearer ${token}` },
        });

        setEatCount(res.data.count || 0);
        console.log("🍽️ Loaded meal count:", res.data.count || 0);
      } catch (err) {
        console.error("Failed to load meal count:", err);
      }
    };

    fetchCount();
  }, []);

  const handleAddCalories = async () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      .toISOString()
      .split("T")[0];

    const token = await getToken();

    try {
      await axios.post(
        `${baseUrl}/api/meals/log`,
        { userId, mealId: meal.id, date: today, count: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mealCalories = parseInt(
        meal.nutritional_information?.[0]?.calories
      );
      if (!isNaN(mealCalories)) {
        addCalories(today, mealCalories, "meal");
        setEatCount((prev) => prev + 1);
        setShowFuelPopup(true);
        setTimeout(() => setShowFuelPopup(false), 2000);
      }
    } catch (err) {
      console.error("Meal log failed:", err);
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

    const token = await getToken();

    try {
      await axios.post(
        `${baseUrl}/api/meals/log`,
        { userId, mealId: meal.id, date: today, count: -1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mealCalories = parseInt(
        meal.nutritional_information?.[0]?.calories
      );
      if (!isNaN(mealCalories)) {
        addCalories(today, -mealCalories);
      }
      setEatCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Meal subtraction failed:", err);
    }
  };
  const ERROR_IMG = "/image_not_found.png";

  return (
    <>
      <div className={`meal-card meal-card-${type}`}>
        <h3 className="meal-name">{meal.name}</h3>
        <div className="meal-image-container">
          <img
            src={meal.image_url}
            alt={meal.name}
            onError={(e) => {
              e.target.src = ERROR_IMG;
            }}
            width={"250px"}
            height={"200px"}
            className={`img-meal ${showFuelPopup ? "dimmed" : ""}`}
            onClick={() => setShowModal(true)}
          />

          <div className="hover-text">What's Inside?</div>
          {showFuelPopup && <div className="fuel-popup">Fuel Logged!</div>}
        </div>

        <p>
          <span className="label">Price: </span>
          <span className="price">${meal.price.toFixed(2)} </span>
        </p>
        <p className="restaurant-line">
          <span className="label">Restaurant:</span>{" "}
          <span className="restaurant-name">{meal.restaurant_name}</span>
        </p>

        {/* <Notification /> */}

        <a
          href={`https://order.trypicnic.com/search/${encodeURIComponent(
            meal.restaurant_name
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="order-now"
            onClick={() => {
              setHasOrderedBefore(true);
            }}
          >
            {hasOrderedBefore === false && isHovering && <Notification />}
            Order Now
          </button>
        </a>
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
          <div className="ai-header">
            <img src="../../public/bee.png" />
            <h5 className="ai-pick-title">WellForce AI Pick</h5>
          </div>
        </div>
      </div>
      {showModal && (
        <MealModal meal={meal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
