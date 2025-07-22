import { useUser, useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../../components/MealsCard/MealsCard";
import "./MealsList.css";
import ReactLoading from "react-loading";

export default function MealsList() {
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

        const res = await axios.get(
          "http://localhost:3000/api/mealchat/personalized",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched meals:", res.data);

        setMeals(res.data.meals);
      } catch (err) {
        console.error("Failed to load meals:", err);
      }
    };

    if (internalUserId) fetchMeals();
  }, [internalUserId, getToken]);

  // Render meals
  if (!meals?.length) {
    return (
      <div className="loader-container">
        <div class="loader"></div>
        <p style={{ marginLeft: "10px", fontSize: "1.2em", color: "#333" }}>
          Loading meals...
        </p>
      </div>
    );
    // return <ReactLoading height={667} width={375} />;
    // return <p>No meals available right now.</p>;
  }

  return (
    <div className="meals-list">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
