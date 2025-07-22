import React, {useState} from "react"
import MealModal from "/src/components/MealModal/MealModal.jsx";
import { Link } from "react-router-dom"
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
      <p>
           Calories: {meal.nutritional_information?.[0]?.calories ?? "N/A"} kcal
      </p>  
      <p>
        Protein: {Array.isArray(meal.nutritional_information) && meal.nutritional_information.length > 0 
          ? meal.nutritional_information[0].protein 
          : "N/A"} g
      </p>




      <Link to={`https://order.trypicnic.com/search/${encodeURIComponent(meal.restaurant_name)}`}>
      <button className="order-now">Order Now</button>
    </Link>
    </div>
    {showModal && (
        <MealModal meal={meal} onClose={() => setShowModal(false)} />
      )}
      </>
  );
}


