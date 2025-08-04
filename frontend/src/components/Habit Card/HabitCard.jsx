import React, { useState, useEffect, useContext } from "react";
import "./HabitCard.css";
import { CaloriesContext } from "../CalorieTracker/CaloriesContext.jsx";
import { startOfWeek, addDays, format } from "date-fns";

const HabitCard = () => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const fullDayMap = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
  };

  const { caloriesByDay } = useContext(CaloriesContext);
  const [completions, setCompletions] = useState(Array(5).fill(false));
  const [foodDays, setFoodDays] = useState([]);
  const [currentWeekDates, setCurrentWeekDates] = useState([]);

  useEffect(() => {
    const storedDays =
      JSON.parse(localStorage.getItem("selectedFoodDays")) || [];
    setFoodDays(storedDays);
  }, []);

  useEffect(() => {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const week = Array.from({ length: 5 }, (_, i) =>
      format(addDays(monday, i), "yyyy-MM-dd")
    );
    setCurrentWeekDates(week);
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

          const date = new Date(); // get start of current week and add `i` days
          const monday = new Date();
          monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)); // get monday of current week
          const currentDate = new Date(monday);
          currentDate.setDate(monday.getDate() + i);
          const isoDate = currentDate.toISOString().split("T")[0];
          const isLogged = caloriesByDay[isoDate] > 0;

          return (
            <div className="day" key={i}>
              <div
                className={`circle ${isLogged ? "checked" : "unchecked"} ${
                  isFoodDay ? "food-day" : ""
                }`}
              >
                {isLogged ? (
                  <div className="circle-content">
                    <span className="checkmark">✓</span>
                    <img
                      src="/Appy-complete.png"
                      alt="appy"
                      className="circle-image"
                    />
                    <span className="good-job-text">GOOD JOB!</span>
                  </div>
                ) : (
                  <div className="circle-content">
                    {/* <span className="checkmark">×</span> */}
                    <span className="got-this-text">YOU GOT THIS!</span>
                  </div>
                )}
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
