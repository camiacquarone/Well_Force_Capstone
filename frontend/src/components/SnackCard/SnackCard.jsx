import React, {useState} from "react"
import SnackModal from "/src/components/SnackModal/SnackModal.jsx";

// src/components/MealCard.jsx
export default function SnackCard({ snack }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
    <div className="snack-card">
      <img src={snack.image_url} alt={snack.name} onClick={() => setShowModal(true)}/>
      <h3>{snack.name}</h3>
      <p>Calories: {snack.nutritional_info[0]?.calories || "N/A"} kcal</p>
      <p>Protein: {snack.nutritional_info[0]?.protein || "N/A"} g</p>
    </div>
    {showModal && (
        <SnackModal snack={snack} onClose={() => setShowModal(false)} />
      )}
      </>
  );
}