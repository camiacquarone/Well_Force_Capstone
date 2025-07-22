import React, { useState, useEffect } from "react";
import "./GoalsPage.css";
import HomePage from "../HomePage/HomePage.jsx";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";

function GoalsPage({ user, setUser }) {
  const [name, setName] = useState("");
  const [dietaryPref, setDietaryPref] = useState([]);
  const [userExist, setUserExist] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [newUserPosition, setNewUserPosition] = useState("");
  const [calories, setCalories] = useState(2000);
  const [newUserImage_url, setNewUserImage_url] = useState("");
  const [newFoodGoal, setNewFoodGoal] = useState([]);
  const [newFoodDay, setNewFoodDay] = useState([]);
  const [nameError, setNameError] = useState("");
  const position = ["Intern", "Full Time"];
  const commonAllergies = [
    "Milk",
    "Eggs",
    "Peanuts",
    "Tree Nuts",
    "Soy",
    "Wheat",
    "Fish",
    "Shellfish",
    "Sesame",
    "Mustard",
    "Celery",
    "Lupin",
    "Sulfites",
    "Corn",
    "Meat (Red/White)",
  ];

  const increaseCalories = () =>
    setCalories((prev) => Math.min(prev + 50, 5000));
  const decreaseCalories = () => setCalories((prev) => Math.max(prev - 50, 0));
  const navigate = useNavigate();

  const isFormValid =
    name.trim() !== "" &&
    newUserPosition.trim() !== "" &&
    newUserImage_url.trim() !== "" &&
    !nameError;
  const { getToken } = useAuth();

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
      setNameError("");
    } else {
      setNameError("Only letters and spaces are allowed.");
    }
  };

  function toggleFoodGoal(goal) {
    setNewFoodGoal((prev) =>
      prev.includes(goal)
        ? prev.filter((item) => item !== goal)
        : [...prev, goal]
    );
  }

  function toggleDietaryPref(dr) {
    setDietaryPref((prev) =>
      prev.includes(dr) ? prev.filter((item) => item !== dr) : [...prev, dr]
    );
  }

  function toggleAllergies(allerg) {
    setAllergies((prev) =>
      prev.includes(allerg)
        ? prev.filter((item) => item !== allerg)
        : [...prev, allerg]
    );
  }

  function toggleDay(day) {
    setNewFoodDay((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  useEffect(() => {
    const checkIfExist = async () => {
      if (!user) {
        setUserExist(false);
        return;
      }

      setUserExist(true);

      try {
        const token = await getToken();
      } catch (error) {}
    };

    checkIfExist();
  });

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Does the user exist? ", userExist);
    try {
      const token = await getToken();

      console.log(allergies);

      if (userExist) {
        const response = await axios.put(
          "http://localhost:3000/api/users",
          {
            image_url: newUserImage_url,
            name: name,
            allergies: allergies,
            dietary_pref: {
              connect: dietaryPref.map((drName) => ({
                name: drName,
              })),
            },
            goals: {
              connect: newFoodGoal.map((goalName) => ({ title: goalName })),
            },
            recommendations: {
              connect: [],
            },
            role: newUserPosition,
            caloric_goal: calories,
            daysOfWeek: newFoodDay,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("completed updating the user information");
        console.log(user);
        setUser(user);
      } else {
        const userData = {
          clerkId: "",
          email: "",
          image_url: newUserImage_url,
          name: name,
          allergies: allergies,
          dietary_pref: {
            connect: dietaryPref.map((drName) => ({
              name: drName,
            })),
          },
          goals: {
            connect: newFoodGoal.map((goalName) => ({ title: goalName })),
          },
          recommendations: {
            connect: [],
          },
          role: newUserPosition,
          caloric_goal: calories,
          daysOfWeek: newFoodDay,
        };

        console.log("submitting user data: ", userData);

        const response = await axios.post(
          "http://localhost:3000/api/users",
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the Clerk token
              "Content-Type": "application/json",
            },
          }
        );

        setUser(user);
        console.log(response.data);
      }

      console.log("user: ", user);
    } catch (error) {
      console.error("Error creating user profile (AxiosError object):", error);
    }

    console.log("USER INFORMATION");
    console.log("Name:", name);
    console.log("Position:", newUserPosition);
    console.log("Calories", calories);
    console.log("Image URL:", newUserImage_url);
    console.log("dietary preferences: ", dietaryPref);
    console.log("Food Goal:", newFoodGoal);
    console.log("Food Day:", newFoodDay);
    console.log("allergies: ", allergies);
  }

  return (
    <div className="GoalsPage">
      <span className="top-buttons">
        <button
          type="button"
          className="top-left-button"
          onClick={() => navigate("/")}
        >
          ⬅ Back
        </button>
        <button
          type="button"
          className="top-right-button"
          onClick={() => navigate("/home")}
        >
          Setup later ➡
        </button>
      </span>
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
            {/* BUG HERE */}
            <input
              type="number"
              value={calories}
              onChange={(e) => {
                const raw = e.target.value;
                const sanitized = raw.replace(/^0+(?!$)/, "");
                setCalories(sanitized === "" ? "0" : sanitized);
              }}
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
          <label htmlFor="newUserImage" id="profile-pic-text">
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

        {/* food goals  */}
        <div className="goals_but_input">
          <label htmlFor="newUserGoals">Food Goals</label>
          <div className="food-goals-select">
            <button
              type="button"
              className={`protein ${
                newFoodGoal.includes("Protein") ? "selected" : ""
              }`}
              onClick={() => toggleFoodGoal("Protein")}
            >
              I Want to Eat More Protein
            </button>
            <button
              type="button"
              className={`vegetables ${
                newFoodGoal.includes("Vegetables") ? "selected" : ""
              }`}
              onClick={() => toggleFoodGoal("Vegetables")}
            >
              I Want to Eat More Vegetables
            </button>
          </div>
        </div>

        {/* dietary preferences */}
        <div className="goals_but_input">
          <label htmlFor="newUserDietPref">
            Do you have any dietary preferences?
          </label>
          <div className="food-goals-select">
            <button
              type="button"
              className={`Vegetarian ${
                dietaryPref.includes("Vegetarian") ? "selected" : ""
              }`}
              onClick={() => toggleDietaryPref("Vegetarian")}
            >
              Vegetarian
            </button>
            <button
              type="button"
              className={`Vegan ${
                dietaryPref.includes("Vegan") ? "selected" : ""
              }`}
              onClick={() => toggleDietaryPref("Vegan")}
            >
              Vegan
            </button>

            <button
              type="button"
              className={`Gluten-Free ${
                dietaryPref.includes("Gluten-Free") ? "selected" : ""
              }`}
              onClick={() => toggleDietaryPref("Gluten-Free")}
            >
              Gluten-Free
            </button>
          </div>
        </div>

        {/* allergies */}

        <div className="goals_but_input">
          <label htmlFor="newUserAllergies">Do you have any allergies?</label>
          <div className="food-goals-select">
            {commonAllergies.map((allergy) => {
              return (
                <button
                  type="button"
                  className={`{allergy} ${
                    allergies.includes(allergy) ? "selected" : ""
                  }`}
                  onClick={() => toggleAllergies(allergy)}
                >
                  {allergy}
                </button>
              );
            })}
          </div>
        </div>

        <div className="goals_but_input">
          <label htmlFor="DaysWanted">
            What Days of the Week Would You Like Meal Suggestions?
          </label>

          <div className="food-days-select">
            <button
              type="button"
              className={`monday ${
                newFoodDay.includes("Monday") ? "selected" : ""
              }`}
              onClick={() => toggleDay("Monday")}
            >
              Monday
            </button>
            <button
              type="button"
              className={`tuesday ${
                newFoodDay.includes("Tuesday") ? "selected" : ""
              }`}
              onClick={() => toggleDay("Tuesday")}
            >
              Tuesday
            </button>
            <button
              type="button"
              className={`wedensday ${
                newFoodDay.includes("Wednesday") ? "selected" : ""
              }`}
              onClick={() => toggleDay("Wednesday")}
            >
              Wednesday
            </button>
            <button
              type="button"
              className={`thursday ${
                newFoodDay.includes("Thursday") ? "selected" : ""
              }`}
              onClick={() => toggleDay("Thursday")}
            >
              Thursday
            </button>
            <button
              type="button"
              className={`friday ${
                newFoodDay.includes("Friday") ? "selected" : ""
              }`}
              onClick={() => toggleDay("Friday")}
            >
              Friday
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="save-button"
          onClick={HomePage}
          disabled={!isFormValid}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default GoalsPage;
