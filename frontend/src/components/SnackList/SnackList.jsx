// src/components/MealsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import SnackCard from "../../components/SnackCard/SnackCard"
import "./SnackList.css"

export default function SnackList() {
  const [snack, setSnack] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/snacks")
      .then((res) => setSnack(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!snack?.length) {
     <p>No meals available right now.</p>;
  }
  return (
    <div className="snack-container">
      <div className="snack-scroll-wrapper">
        <div className="snack-list">
      {snack.map((snack) => (
        <SnackCard key={snack.id} snack={snack} />
      ))}
    </div>
      </div>
    </div>
    
  );
}