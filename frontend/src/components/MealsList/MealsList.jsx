import { useUser, useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../../components/MealsCard/MealsCard";
import "./MealsList.css";

export default function MealsList({ showAll }) {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [meals, setMeals] = useState([]);
  const [internalUserId, setInternalUserId] = useState(() =>
    localStorage.getItem("userId")
  );

  useEffect(() => {
    const getInternalUserId = async () => {
      if (user && !internalUserId) {
        try {
          const token = await getToken();
          const res = await axios.get("http://localhost:3000/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          localStorage.setItem("userId", res.data.id);
          setInternalUserId(res.data.id);
        } catch (error) {
          console.error("Failed to fetch internal user ID:", error);
        }
      }
    };

    getInternalUserId();
  }, [user, internalUserId, getToken]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = await getToken();

        const url = showAll
          ? "http://localhost:3000/api/meals"
          : "http://localhost:3000/api/mealchat/personalized";

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched meals:", res.data);

        let data = showAll ? res.data : res.data.meals;
        // setMeals(data);

        if (url === "http://localhost:3000/api/mealchat/personalized") {
          data = data.map((meal) => ({
            ...meal,
            is_AI: true, // Add the flag
          }));
          console.log("Meals after adding AI flag:", data); // Log after modification
        } else {
          data = data.map((meal) => ({
            ...meal,
            is_AI: meal.is_AI || false,
          }));
          console.log("Meals after adding AI flag (regular):", data);
        }

        setMeals(data);
      } catch (err) {
        console.error("Failed to load meals:", err);
      }
    };

    if (internalUserId) fetchMeals();
  }, [internalUserId, getToken, showAll]);

  // Render meals
  if (!meals?.length) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <img src="/bee.gif" alt="bee" width="150px"></img>
        <p style={{ marginLeft: "10px", fontSize: "1.2em", color: "#333" }}>
          Loading Your Customized Meals...
        </p>
      </div>
    );
  }

  return (
    <div className="meals-container">
      <div className="meals-scroll-wrapper">
        <div className="meals-list">
          {meals.map((meal) => {
            console.log(meal.is_AI);
            const cardType = meal.is_AI ? "ai" : "regular";

            return <MealCard type={cardType} key={meal.id} meal={meal} />;
          })}
        </div>
      </div>
    </div>
  );
}
