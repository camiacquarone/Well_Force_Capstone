import React from "react";
import "./SnackModal.css"; // Optional: separate CSS file for modal styles

export default function SnackModal({ snack, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>{snack.name}</h2>
        <img className="img-meal" src={snack.image_url} alt={snack.name} />
        <p>Calories: {snack.nutritional_info[0]?.calories} kcal</p>
        <p>Protein: {snack.nutritional_info[0]?.protein} g</p>
        <p>{snack.description}</p>
      </div>
    </div>
  );
}