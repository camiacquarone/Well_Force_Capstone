import React from "react";
import "./MealModal.css"; // Optional: separate CSS file for modal styles

export default function MealModal({ meal, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>{meal.name}</h2>
        <img src={meal.image_url} alt={meal.name} className="img-meal2" />
        {/* <p>Restaurant: {meal.restaurant_name}</p> */}
        <h3>Nutritional Information</h3>

        <div className="food-info">
          <p>
            <span className="label">Calories:</span> {""}
            {meal.nutritional_information?.[0]?.calories ?? "--"} kcal
          </p>
          <p>
            <span className="label">Protein:</span>
            {""} {meal.nutritional_information?.[0]?.protein ?? "--"} g
          </p>

          <p>
            <span className="label">Total Fat:</span>
            {""} {meal.nutritional_information?.[0]?.total_fat ?? "--"} g
          </p>

          <p>
            <span className="label">Cholesterol:</span>
            {""} {meal.nutritional_information?.[0]?.cholesterol ?? "--"} g
          </p>

          <p>
            <span className="label">Sodium:</span>
            {""} {meal.nutritional_information?.[0]?.sodium ?? "--"} g
          </p>

          <p>
            <span className="label">Total Carbs:</span>
            {""} {meal.nutritional_information?.[0]?.total_carbs ?? "--"} g
          </p>

          <p>
            <span className="label">Sugars:</span>
            {""} {meal.nutritional_information?.[0]?.sugars ?? "--"} g
          </p>
        </div>
      </div>
    </div>
  );
}
