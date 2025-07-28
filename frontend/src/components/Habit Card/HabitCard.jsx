import React, { useState, useEffect } from "react";
import "./HabitCard.css";

const HabitCard = () => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const fullDayMap = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
  };

  const [completions, setCompletions] = useState(Array(5).fill(false));
  const [foodDays, setFoodDays] = useState([]);

  useEffect(() => {
    const storedDays =
      JSON.parse(localStorage.getItem("selectedFoodDays")) || [];
    setFoodDays(storedDays);
  }, []);

  const toggleCompletion = (index) => {
    const updated = [...completions];
    updated[index] = !updated[index];
    setCompletions(updated);
  };

  useEffect(() => {
    const storedDays =
      JSON.parse(localStorage.getItem("selectedFoodDays")) || [];
    console.log("Loaded Food Days:", storedDays); 
  }, []);
  return (
    <div className="habit-card">
      <div className="habit-header">
        <p className="habit-title">YOUR WEEKLY TRACKER</p>
      </div>
      <div className="habit-week">
        {weekDays.map((abbr, i) => {
          const fullDay = fullDayMap[abbr]; 
          const isFoodDay = foodDays.includes(fullDay);

          return (
            <div className="day" key={i} onClick={() => toggleCompletion(i)}>
              <div
                className={`circle ${
                  completions[i] ? "checked" : "unchecked"
                } ${isFoodDay ? "food-day" : ""}`}
              >
                {completions[i] ? "✓" : "×"}
              </div>
              <p className="day-label">{abbr}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitCard;
