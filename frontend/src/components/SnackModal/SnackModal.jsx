import React from "react";
import "./SnackModal.css";

export default function SnackModal({ snack, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>{snack.name}</h2>

        <img className="img-meal" src={snack.image_url} alt={snack.name} />
        <p className="description-modal">{snack.description}</p>
        <div className="modal-header">
          <h3>Nutritional Info: </h3>
        </div>
        <div className="food-info">
          <p>
            <span className="label">Calories:</span>
            <span>
              {""} {snack.nutritional_info[0]?.calories} kcal
            </span>
          </p>
          <p>
            <span className="label">Protein:</span>
            {""} {snack.nutritional_info[0]?.protein} g
          </p>

          <p>
            <span className="label">Total Fat:</span>
            {""} {snack.nutritional_info[0]?.total_fat} g
          </p>

          <p>
            <span className="label">Cholesterol</span>
            {""} {snack.nutritional_info[0]?.cholesterol} g
          </p>
          <p>
            <span className="label">Sodium:</span>
            {""} {snack.nutritional_info[0]?.sodium} g
          </p>
          <p>
            <span className="label">Total Carbs:</span>
            {""} {snack.nutritional_info[0]?.total_carbs} g
          </p>
          <p>
            <span className="label">Sugars</span>
            {""} {snack.nutritional_info[0]?.sugars} g
          </p>
        </div>
      </div>
    </div>
  );
}
