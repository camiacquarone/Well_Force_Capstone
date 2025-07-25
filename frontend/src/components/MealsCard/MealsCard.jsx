import React, { useState } from "react";
import MealModal from "/src/components/MealModal/MealModal.jsx";
import { Link } from "react-router-dom";
import "../MealsCard/MealsCard.css";
// src/components/MealCard.jsx
export default function MealCard({ meal }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="meal-card">
        <h3 className="meal-name">{meal.name}</h3>
        <img
          src={meal.image_url}
          alt={meal.name}
          className="img-meal"
          onError={
            "https://demofree.sirv.com/products/123456/123456.jpg?profile=error-example"
          }
          width={"250px"}
          height={"200px"}
          onClick={() => setShowModal(true)}
        />
        <p>
          <span className="label">Restaurant:</span>{" "}
          <span className="restaurant-name">{meal.restaurant_name}</span>
        </p>

        <p>
          <span className="label">Price: </span>
          <span className="price">${meal.price.toFixed(2)} </span>
        </p>

        <p>
          <span className="label">Calories: </span>
          <span className="calories">
            {meal.nutritional_information?.[0]?.calories ?? "N/A"} kcal{" "}
          </span>
        </p>

        <p>
          <span className="label">Protein:</span>{" "}
          <span>
            {Array.isArray(meal.nutritional_information) &&
            meal.nutritional_information.length > 0
              ? meal.nutritional_information[0].protein
              : "N/A"}
            g{" "}
          </span>
        </p>

        <Link
          to={`https://order.trypicnic.com/search/${encodeURIComponent(
            meal.restaurant_name
          )}`}
        >
          <button className="order-now">Order Now</button>
        </Link>
      </div>
      {showModal && (
        <MealModal meal={meal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
