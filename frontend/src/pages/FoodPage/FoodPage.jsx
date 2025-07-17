import React, {useState,useEffect} from "react";
import MealsList from "../../components/MealsList/MealsList";
import SnackList from "../../components/SnackList/SnackList";
import "./FoodPage.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  RedirectToSignIn, // Import RedirectToSignIn
} from "@clerk/clerk-react";

function FoodPage() {
const [clerkUserId, setClerkUserId] = useState("");

  const { userId, isLoaded, isSignedIn } = useAuth();
  
  useEffect(() => {
    if (isLoaded && isSignedIn && userId) {
      setClerkUserId(userId);
    } else if (isLoaded && !isSignedIn) {
      setClerkUserId("Not Signed In");
    }
  }, [isLoaded, isSignedIn, userId]);

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  return (
    <div className="food-page">

      <header className="food-header">
        <h1>Food Header</h1>
        <div className="food-controls">
          <div className="dropdown-group">
            <select>
              <option>Energy Level</option>
              <option>Tired</option>
              <option>Stressed</option>
              <option>Energetic</option>
            </select>

            <select>
              <option>Allergies</option>
              <option>My Allergies</option>
              <option>None</option>
            </select>
          </div>

          <div className="profile-icon">👤</div>    
          {/* ^Make this the actual profile photo */}
        </div>
      </header>

      <main className="food-main">
        <section className="meals-section">
          <h2>Meals</h2>
          <div className="meals-grid">
            {/* Meal Cards Go Here */}
            <MealsList/>
          </div>
        </section>

        <section className="snacks-section">
          <h2>Snacks</h2>
          <div className="snacks-grid">
            {/* Snack Cards Go Here */}
            <SnackList/>
          </div>
        </section>
      </main>

      <button className="ai-companion-button">AI Companion</button>
    </div>
  );
}

export default FoodPage;
