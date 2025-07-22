// src/components/MealsList.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
//  import MealCard from "../../components/MealsCard/MealsCard"
//  import "./MealsList.css"

// export default function MealsList() {
//   const [meals, setMeals] = useState([]);

//   const userId = localStorage.getItem("userId");
//   console.log("This is the userID:", userId)

//   useEffect(() => {
//     axios.get(`http://localhost:3000/api/meals`)
//       .then((res) => setMeals(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   if (!meals?.length) {
//      <p>No meals available right now.</p>;
//   }

//   return (
//     <div className="meals-list">
//       {meals.map((meal) => (
//         <MealCard key={meal.id} meal={meal} />
//       ))}
//     </div>
//   );
// }

// src/components/MealsList.jsx
import { useUser, useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../../components/MealsCard/MealsCard";
import "./MealsList.css";

export default function MealsList() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [meals, setMeals] = useState([]);
  const [internalUserId, setInternalUserId] = useState(() => localStorage.getItem("userId"));

  // Step 1: Get internal user ID using Clerk session token
  useEffect(() => {
    const getInternalUserId = async () => {
      if (user && !internalUserId) {
        try {
          const token = await getToken();
          const res = await axios.get("http://localhost:3000/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          localStorage.setItem("userId", res.data.id);
          setInternalUserId(res.data.id);
        } catch (error) {
          console.error("Failed to fetch internal user ID:", error);
        }
      }
    };

    getInternalUserId();
  }, [user, internalUserId, getToken]);

  // Step 2: Fetch personalized meals (no longer needs userId in params)
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = await getToken();
        const res = await axios.get("http://localhost:3000/api/mealchat/personalized", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMeals(res.data.meals); // ⬅ make sure your backend responds with { meals: [...] }
      } catch (err) {
        console.error("Failed to load meals:", err);
      }
    };

    if (internalUserId) fetchMeals();
  }, [internalUserId, getToken]);

  // Render meals
  if (!meals?.length) {
    return <p>No meals available right now.</p>;
  }

  return (
    <div className="meals-list">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}