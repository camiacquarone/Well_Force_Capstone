import React, { useState } from "react";
import "./GoalsPage.css"

function GoalsPage() {
  const [name, setName] = useState("");
  const [newUserPosition, setNewUserPosition] = useState("");
  const [calories, setCalories] = useState(2000);
  const [newUserImage_url,setNewUserImage_url] = useState("");
  const [newFoodGoal,setNewFoodGoal] = useState([]);
  const [newFoodDay,setNewFoodDay] = useState([]);
  const position = ["Intern", "Full Time"]; // Example values
  const increaseCalories = () => setCalories((prev) => Math.min(prev + 50, 5000));
  const decreaseCalories = () => setCalories((prev) => Math.max(prev - 50, 0));

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Position:", newUserPosition);
    console.log("Calories", calories)
    console.log("Image URL:", newUserImage_url);
    console.log("Food Goal:", newFoodGoal);
    console.log("Food Day:", newFoodDay);
  }

  function toggleFoodGoal(goal) {
  setNewFoodGoal((prev) =>
    prev.includes(goal)
      ? prev.filter((item) => item !== goal) // remove if already selected
      : [...prev, goal]                      // add if not selected
  );
}
  function toggleDay(day) {
  setNewFoodDay((prev) =>
    prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
  );
}



  return (
    <div className="GoalsPage">
      <h1>Profile</h1>
      <h3> Welcome to your profile </h3>
      <form onSubmit={handleSubmit} className="create-profile-form">
        <div className="Goals_req_input">
            <label htmlFor="newUserName">
                Name <span className="stars">*</span>
            </label>
          <input
            type="text"
            id="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
            required
          />
        </div>
        <div className="Goals_req_input">
          <label htmlFor="newUserPosition">
            Position<span className="stars">*</span>
          </label>
          <div className="user-postion">
             <select
            id="newUserPosition"
            className={`position-select ${
              newUserPosition
                ? `select-${newUserPosition.toLowerCase().replace(/\s+/g, "-")}`
                : ""
            }`}
            value={newUserPosition}
            onChange={(e) => setNewUserPosition(e.target.value)}
            required
          >
            <option value="">Select a position</option>
            {position.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          </div>
         
        </div>
        <div className="Goals_req_input">
            <label htmlFor="newUserCalories">
                Daily Calories <span className="stars">*</span>
            </label>
            <div className="caloric input">
                
                <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    />
                 <button type="button" onClick={decreaseCalories}>⬇</button>
                 <button type="button" onClick={increaseCalories}>⬆</button>
            </div>
        </div>
        <div className="Goals_but_input">
            <label htmlFor="newUserImage">
                Profile Picture <span className="stars">*</span>
            </label>
            <div className="profile_pic">
                
                <button type="button" onClick={() => setNewUserImage_url("frontend/public/Astro.png")}>
                <img src="/Astro1.png" alt="Astro" width="200"
            height="230"/>
                </button>
                {/* {newUserImage_url && (
                     <div>
                    <p>Selected Image Preview:</p>
                    <img src={newUserImage_url} alt="Selected Profile" />
                    </div>
                        )} */}
                
            </div>
        </div>
        <div className="Goals_but_input">
            <label htmlFor="newUserImage">
                Food Goals 
            </label>
            <div className="FoodGoals_select">
                
                <button type="button" onClick={() => toggleFoodGoal("Protien")}>
                I want to eat more protien
                </button>
                <button type="button" onClick={() => toggleFoodGoal("Vegetables")}>
                I want to eat more vegetables
                </button>
            </div>
        </div>
        <div className="Goals_but_input">
            <label htmlFor="DaysWanted">
                How Many Days do you want meal suggestions?
            </label>

            <div className="FoodDays_select">
                <button type="button" onClick={() => toggleDay("Monday")}>
                Monday
                </button>
                <button type="button" onClick={() => toggleDay("Tuesday")}>
                Tuesday
                </button>
                <button type="button" onClick={() => toggleDay("Wednesday")}>
                Wednesday
                </button>
            </div>
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default GoalsPage;





