import { useUser, useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../../components/MealsCard/MealsCard";
import "./MealsList.css";

export default function MealsList({ showAll }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [meals, setMeals] = useState(() => {
    const cached = localStorage.getItem(
      showAll ? "allMeals" : "personalizedMeals"
    );
    return cached ? JSON.parse(cached) : [];
  });
  const [internalUserId, setInternalUserId] = useState(() =>
    localStorage.getItem("userId")
  );

  useEffect(() => {
    const getInternalUserId = async () => {
      if (user && !internalUserId) {
        try {
          const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
          const token = await getToken();
          const res = await axios.get(`${baseUrl}/api/users/me`, {
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
        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
        const url = showAll
          ? `${baseUrl}/api/meals`
          : `${baseUrl}/api/mealchat/personalized`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data = showAll ? res.data : res.data.meals;

        if (!showAll && data.length > 0) {
          data[0].is_AI = true;
        }

        if (showAll) {
          data = data.map((meal) => ({ ...meal, is_AI: meal.is_AI || false }));
        }

        localStorage.setItem(
          showAll ? "allMeals" : "personalizedMeals",
          JSON.stringify(data)
        );
        setMeals(data);
      } catch (err) {
        console.error("Failed to load meals:", err);
      }
    };

    const cachedMeals = localStorage.getItem(
      showAll ? "allMeals" : "personalizedMeals"
    );
    if (!cachedMeals || JSON.parse(cachedMeals).length === 0) {
      if (internalUserId) fetchMeals();
    }
  }, [internalUserId, getToken, showAll]);

  useEffect(() => {
    const checkPreferencesAndFetch = async () => {
      try {
        const token = await getToken();
        const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

        const res = await axios.get(`${baseUrl}/api/users/me/preferences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const latestPreferences = res.data;
        const storedPreferences = localStorage.getItem("userPreferences");

        const latestString = JSON.stringify(latestPreferences);

        if (storedPreferences !== latestString) {
          localStorage.setItem("userPreferences", latestString);
          localStorage.removeItem("personalizedMeals");
        }
      } catch (error) {
        console.error("Failed to check or compare user preferences:", error);
      }
    };

    if (internalUserId && !showAll) checkPreferencesAndFetch();
  }, [internalUserId, getToken, showAll]);

  if (!meals?.length) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <img src="/bee.gif" alt="bee" width="150px" />
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
          {meals.map((meal) => (
            <MealCard
              type={meal.is_AI ? "ai" : "regular"}
              key={meal.id}
              meal={meal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
