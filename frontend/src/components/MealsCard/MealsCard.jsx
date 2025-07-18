import React, {useState} from "react"
import MealModal from "/src/components/MealModal/MealModal.jsx";

// src/components/MealCard.jsx
export default function MealCard({ meal }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
    <div className="meal-card">
      <img src={meal.image_url} alt={meal.name} onClick={() => setShowModal(true)}/>
      <h3>{meal.name}</h3>
      <p>Restaurant: {meal.restaurant_name}</p>
      <p>Price: ${meal.price.toFixed(2)}</p>
      <p>Calories: {meal.nutritional_information[0]?.calories || "N/A"} kcal</p>
      <p>Protein: {meal.nutritional_information[0]?.protein || "N/A"} g</p>
    </div>
    {showModal && (
        <MealModal meal={meal} onClose={() => setShowModal(false)} />
      )}
      </>
  );
}


