import React from "react";
import "./SnackModal.css";

export default function SnackModal({ snack, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>{snack.name}</h2>
        <img className="img-meal" src={snack.image_url} alt={snack.name} />
        <p><span>Calories:</span>{""} {snack.nutritional_info[0]?.calories} kcal</p>
        <p><span>Protein:</span>{""} {snack.nutritional_info[0]?.protein} g</p>
        <p className="description-modal">{snack.description}</p>
      </div>
    </div>
  );
}