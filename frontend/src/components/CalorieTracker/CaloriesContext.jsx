// CaloriesContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";

export const CaloriesContext = createContext();

export const CaloriesProvider = ({ children }) => {
  const [caloriesByDay, setCaloriesByDay] = useState({});
  const [snackLoggedByDay, setSnackLoggedByDay] = useState({});
  const [mealLoggedByDay, setMealLoggedByDay] = useState({});

  const { user } = useUser();
  const { getToken } = useAuth();
  const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchDailyCalories = async () => {
      if (!user) return;
      try {
        const token = await getToken();
        const res = await axios.get(`${baseUrl}/api/meals/log/totals`, {
          params: { userId: user.id },
          headers: { Authorization: `Bearer ${token}` },
        });
        setCaloriesByDay(res.data);
      } catch (error) {
        console.error("Failed to fetch daily calories:", error);
      }
    };
    fetchDailyCalories();
  }, [user]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loggedSnackDays")) || {};
    setSnackLoggedByDay(stored);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loggedMealDays")) || {};
    setMealLoggedByDay(stored);
  }, []);

  const refreshCalories = async () => {
    if (!user) return;
    try {
      const token = await getToken();
      // ✅ Fixed endpoint to match backend
      const res = await axios.get(`${baseUrl}/api/meals/log/totals`, {
        params: { userId: user.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCaloriesByDay(res.data);
    } catch (error) {
      console.error("Failed to refresh daily calories:", error);
    }
  };

  const addCalories = (date, amount, type = "snack") => {
    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0];
    setCaloriesByDay((prev) => ({
      ...prev,
      [dateStr]: (prev[dateStr] || 0) + amount,
    }));

    if (type === "snack") {
      logSnackForDay(new Date(dateStr));
    } else if (type === "meal") {
      logMealForDay(new Date(dateStr));
    }
  };

  const logSnackForDay = (date) => {
    const key = date.toISOString().split("T")[0];
    setSnackLoggedByDay((prev) => {
      const updated = { ...prev, [key]: true };
      localStorage.setItem("loggedSnackDays", JSON.stringify(updated));
      return updated;
    });
  };

  const logMealForDay = (date) => {
    const key = date.toISOString().split("T")[0];
    setMealLoggedByDay((prev) => {
      const updated = { ...prev, [key]: true };
      localStorage.setItem("loggedMealDays", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <CaloriesContext.Provider
      value={{
        caloriesByDay,
        setCaloriesByDay,
        addCalories,
        refreshCalories,
        snackLoggedByDay,
        logSnackForDay,
        mealLoggedByDay,
        logMealForDay,
      }}
    >
      {children}
    </CaloriesContext.Provider>
  );
};
