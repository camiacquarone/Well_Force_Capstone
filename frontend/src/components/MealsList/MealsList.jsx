// src/components/MealsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../../components/MealsCard/MealsCard"

export default function MealsList() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/meals")
      .then((res) => setMeals(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!meals?.length) {
     <p>No meals available right now.</p>;
  }

  return (
    <div className="meals-list">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
