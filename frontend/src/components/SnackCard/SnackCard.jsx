import React, {useState} from "react"
import SnackModal from "/src/components/SnackModal/SnackModal.jsx";
import "../SnackCard/SnackCard.css";

// src/components/MealCard.jsx
export default function SnackCard({ snack }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
    <div className="snack-card">
      <h3 className="snack-card-title">{snack.name}</h3>
      <img src={snack.image_url} alt={snack.name} className= "snack-card-img" onClick={() => setShowModal(true)}/>
      <p> <span class>   Calories:</span>
 {snack.nutritional_info?.[0]?.calories ?? "N/A"} kcal
</p>

<p>
  Protein: {snack.nutritional_info?.[0]?.protein ?? "N/A"} g
</p>
    </div>
    {showModal && (
        <SnackModal snack={snack} onClose={() => setShowModal(false)} />
      )}
      </>
  );
}