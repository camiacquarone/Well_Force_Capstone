import React, { useState } from "react";
import "./GoalsPage.css";
import HomePage from "../HomePage/HomePage.jsx";
import { useNavigate } from "react-router-dom";

function GoalsPage() {
  const [name, setName] = useState("");
  const [newUserPosition, setNewUserPosition] = useState("");
  const [calories, setCalories] = useState(2000);
  const [newUserImage_url, setNewUserImage_url] = useState("");
  const [newFoodGoal, setNewFoodGoal] = useState([]);
  const [newFoodDay, setNewFoodDay] = useState([]);
  const [nameError, setNameError] = useState("");
  const position = ["Intern", "Full Time"]; // Example values
  const increaseCalories = () =>
    setCalories((prev) => Math.min(prev + 50, 5000));
  const decreaseCalories = () => setCalories((prev) => Math.max(prev - 50, 0));
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
      setNameError("");
    } else {
      setNameError("Only letters and spaces are allowed.");
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Position:", newUserPosition);
    console.log("Calories", calories);
    console.log("Image URL:", newUserImage_url);
    console.log("Food Goal:", newFoodGoal);
    console.log("Food Day:", newFoodDay);
  }

  function toggleFoodGoal(goal) {
    setNewFoodGoal(
      (prev) =>
        prev.includes(goal)
          ? prev.filter((item) => item !== goal) // remove if already selected
          : [...prev, goal] // add if not selected
    );
  }
  function toggleFoodGoal(goal) {
    setNewFoodGoal((prev) =>
      prev.includes(goal)
        ? prev.filter((item) => item !== goal)
        : [...prev, goal]
    );
  }

  function toggleDay(day) {
    setNewFoodDay((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  return (
    <div className="GoalsPage">
      <button
        type="button"
        className="top-right-button"
        onClick={() => navigate("/home")}
      >
        Setup later ➡
      </button>
      <h1>Profile</h1>
      <h3> Welcome to Your Profile! </h3>
      <form onSubmit={handleSubmit} className="create-profile-form">
        <div className="Goals_req_input">
          <label htmlFor="newUserName">
            Name <span className="stars">*</span>
          </label>
          <input
            type="text"
            id="Name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter Name"
            required
          />
          {nameError && <p className="error-message">{nameError}</p>}
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
                  ? `select-${newUserPosition
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  : ""
              }`}
              value={newUserPosition}
              onChange={(e) => setNewUserPosition(e.target.value)}
              required
            >
              <option value="">Select a Position</option>
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
            Daily Calorie Intake Goal <span className="stars">*</span>
          </label>
          <div className="caloric input">
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
            />
            <button type="button" onClick={decreaseCalories} className="arrow">
              ⬇
            </button>
            <button type="button" onClick={increaseCalories} className="arrow">
              ⬆
            </button>
          </div>
        </div>
        <div className="Goals_but_input">
          <label htmlFor="newUserImage">
            Profile Picture <span className="stars">*</span>
          </label>
          <div className="profile_pic">
            {[
              {
                id: "einstein",
                src: "/einstein-profile.png",
                selectedSrc: "/einstein-profile-selected.png",
                alt: "Einstein",
                className: "einstein-img",
              },
              {
                id: "astro",
                src: "/astro-profile.png",
                selectedSrc: "/astro-profile-selected.png",
                alt: "Astro",
                className: "astro-img",
              },
              {
                id: "codey",
                src: "/codey-profile.png",
                selectedSrc: "/codey-profile-selected.png",
                alt: "Codey",
                className: "codey-img",
              },
              {
                id: "ruth",
                src: "/ruth-profile.png",
                selectedSrc: "/ruth-profile-selected.png",
                alt: "Ruth",
                className: "ruth-img",
              },
              {
                id: "appy",
                src: "/appy-profile.png",
                selectedSrc: "/appy-profile-selected.png",
                alt: "Appy",
                className: "appy-img",
              },
            ].map((char) => {
              const isSelected = newUserImage_url === char.selectedSrc;
              return (
                <img
                  key={char.id}
                  src={isSelected ? char.selectedSrc : char.src}
                  alt={char.alt}
                  className={`${char.className} ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() =>
                    setNewUserImage_url(isSelected ? "" : char.selectedSrc)
                  }
                />
              );
            })}
          </div>
        </div>
        <div className="goals_but_input">
          <label htmlFor="newUserImage">Food Goals</label>
          <div className="food-goals-select">
            <button
              className={`protein ${
                newFoodGoal.includes("Protein") ? "selected" : ""
              }`}
              onClick={() => toggleFoodGoal("Protein")}
            >
              I Want to Eat More Protein
            </button>
            <button
              className={`vegetables ${
                newFoodGoal.includes("Vegetables") ? "selected" : ""
              }`}
              onClick={() => toggleFoodGoal("Vegetables")}
            >
              I Want to Eat More Vegetables
            </button>
          </div>
        </div>
        <div className="goals_but_input">
          <label htmlFor="DaysWanted">
            What Days of the Week Would You Like Meal Suggestions?
          </label>

          <div className="food-days-select">
            <button
              className={`monday ${
                newFoodDay.includes("Monday") ? "selected" : ""
              }`}
              onClick={() => toggleDay("Monday")}
            >
              Monday
            </button>
            <button
              className={`tuesday ${
                newFoodDay.includes("Tuesday") ? "selected" : ""
              }`}
              onClick={() => toggleDay("Tuesday")}
            >
              Tuesday
            </button>
            <button
              className={`wedensday ${
                newFoodDay.includes("Wednesday") ? "selected" : ""
              }`}
              onClick={() => toggleDay("Wednesday")}
            >
              Wednesday
            </button>
            <button
              className={`thursday ${
                newFoodDay.includes("Thursday") ? "selected" : ""
              }`}
              onClick={() => toggleDay("Thursday")}
            >
              Thursday
            </button>
            <button
              className={`friday ${
                newFoodDay.includes("Friday") ? "selected" : ""
              }`}
              onClick={() => toggleDay("Friday")}
            >
              Friday
            </button>
          </div>
        </div>
        <button type="submit" className="save-button">
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default GoalsPage;
