import React from "react";
import "./MealModal.css"; // Optional: separate CSS file for modal styles

export default function MealModal({ meal, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>{meal.name}</h2>
        <img src={meal.image_url} alt={meal.name} />
        <p>Restaurant: {meal.restaurant_name}</p>
        <p>Calories: {meal.nutritional_information[0]?.calories} kcal</p>
        <p>Protein: {meal.nutritional_information[0]?.protein} g</p>
      </div>
    </div>
  );
}
