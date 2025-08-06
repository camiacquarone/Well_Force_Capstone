import React, { useState, useEffect } from "react";
import "./GoalsPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

function GoalsPage({ user, setUser }) {
  const [name, setName] = useState("");
  const [dietaryPref, setDietaryPref] = useState([]);
  const [localUserExist, setLocalUserExist] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [newUserPosition, setNewUserPosition] = useState("");
  const [calories, setCalories] = useState(2000);
  const [newUserImage_url, setNewUserImage_url] = useState("");
  const [newFoodGoal, setNewFoodGoal] = useState([]);
  const [newFoodDay, setNewFoodDay] = useState([]);
  const [nameError, setNameError] = useState("");
  const [userLoaded, setUserLoaded] = useState(false);

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
  ];

  const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const isFormValid =
    name.trim() !== "" &&
    newUserPosition.trim() !== "" &&
    newUserImage_url.trim() !== "" &&
    !nameError;

  useEffect(() => {
    if (user !== undefined) {
      setUserLoaded(true);
    }
  }, [user]);

  const hasProfile = !!user;

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
      setNameError("");
    } else {
      setNameError("Only letters and spaces are allowed.");
    }
  };

  const increaseCalories = () =>
    setCalories((prev) => Math.min(prev + 50, 5000));
  const decreaseCalories = () => setCalories((prev) => Math.max(prev - 50, 0));

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

  const toggleDay = (day) => {
    setNewFoodDay((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  useEffect(() => {
    const checkIfExist = async () => {
      if (!user) {
        setLocalUserExist(false);
        return;
      }
      setLocalUserExist(true);
      try {
        const token = await getToken();
      } catch (error) {}
    };
    checkIfExist();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLocalUserExist(true);
    setName(user.name || "");
    setNewUserImage_url(user.image_url || "");
    setCalories(user.caloric_goal || 2000);
    setDietaryPref(user.dietary_pref?.map((d) => d.name) || []);
    setAllergies(user.allergies || []);
    setNewFoodGoal(user.goals?.map((g) => g.title) || []);
    setNewFoodDay(user.daysOfWeek || []);
    setNewUserPosition(user.role || "");
  }, [user]);

  async function checkAndUpdatePreferences() {
    try {
      const token = await getToken();
      const res = await axios.get(`${baseUrl}/api/users/me/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const latestPreferences = res.data;
      const storedPreferences = localStorage.getItem("userPreferences");
      const latestString = JSON.stringify(latestPreferences);
      if (storedPreferences !== latestString) {
        localStorage.setItem("userPreferences", latestString);
        localStorage.removeItem("personalizedMeals");
      }
    } catch (err) {
      console.error("Error updating preferences after save:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = await getToken();
      let resultUser;

      
      if (localUserExist) {
        resultUser = await axios.put(
          `${baseUrl}/api/users`,
          {
            image_url: newUserImage_url,
            name,
            allergies,
            dietary_pref: {
              connect: dietaryPref.map((drName) => ({ name: drName })),
            },
            goals: {
              connect: newFoodGoal.map((goalName) => ({ title: goalName })),
            },
            recommendations: { connect: [] },
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
      } else {
        const userData = {
          clerkId: "",
          email: "",
          image_url: newUserImage_url,
          name,
          allergies,
          dietary_pref: {
            connect: dietaryPref.map((drName) => ({ name: drName })),
          },
          goals: {
            connect: newFoodGoal.map((goalName) => ({ title: goalName })),
          },
          recommendations: { connect: [] },
          role: newUserPosition,
          caloric_goal: calories,
          daysOfWeek: newFoodDay,
        };
        resultUser = await axios.post(`${baseUrl}/api/users`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      setUser(resultUser.data.user || resultUser.data);
      await checkAndUpdatePreferences();
      navigate("/home");
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  }

  return (
    <div className="GoalsPage">
      <span className="top-buttons"></span>
      <h1>Profile</h1>
      <h3>Welcome to Your Profile!</h3>
      <form onSubmit={handleSubmit} className="create-profile-form">
        {/* Name Input */}
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

        {/* Position Dropdown */}
        <div className="Goals_req_input">
          <label htmlFor="newUserPosition">
            Position <span className="stars">*</span>
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

        {/* Caloric Goal */}
        <div className="Goals_req_input">
          <label htmlFor="newUserCalories">
            Daily Calorie Intake Goal <span className="stars">*</span>
          </label>
          <div className="caloric input">
            <input
              type="number"
              value={calories}
              onChange={(e) => {
                const raw = e.target.value;
                const sanitized = raw.replace(/^0+(?!$)/, "");
                setCalories(sanitized === "" ? 0 : parseInt(sanitized));
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

        {/* Profile Picture Selection */}
        <div className="Goals_but_input">
          <label htmlFor="newUserImage" id="profile-pic-text">
            Profile Picture <span className="stars">*</span>
          </label>
          <div className="profile_pic">
            {["einstein", "astro", "codey", "ruth", "appy"].map((id) => {
              const selectedSrc = `/${id}-profile-selected.png`;
              const src = `/${id}-profile.png`;
              const isSelected = newUserImage_url === selectedSrc;
              return (
                <img
                  key={id}
                  src={isSelected ? selectedSrc : src}
                  alt={id}
                  className={`${id}-img ${isSelected ? "selected" : ""}`}
                  onClick={() =>
                    setNewUserImage_url(isSelected ? "" : selectedSrc)
                  }
                />
              );
            })}
          </div>
        </div>
        {/* Food Goals Section */}
        <div className="goals_but_input">
          <label htmlFor="newUserGoals">Food Goals</label>
          <div className="food-goals-select">
            {["Protein", "Vegetables", "Weight Loss", "Muscle Gain"].map(
              (goal) => (
                <button
                  type="button"
                  key={goal}
                  className={`${goal.replace(/\s+/g, "-").toLowerCase()} ${
                    newFoodGoal.includes(goal) ? "selected" : ""
                  }`}
                  onClick={() => toggleFoodGoal(goal)}
                >
                  I want to{" "}
                  {goal === "Weight Loss"
                    ? "lose weight"
                    : goal === "Muscle Gain"
                    ? "gain more muscle"
                    : `eat more ${goal.toLowerCase()}`}
                </button>
              )
            )}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="goals_but_input">
          <label>Do you have any dietary preferences?</label>
          <div className="food-df-select">
            {["Vegetarian", "Vegan", "Gluten-Free"].map((pref) => (
              <button
                key={pref}
                type="button"
                className={`${pref.replace(/\s+/g, "-").toLowerCase()} ${
                  dietaryPref.includes(pref) ? "selected" : ""
                }`}
                onClick={() => toggleDietaryPref(pref)}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="goals_but_input">
          <label>Do you have any allergies?</label>
          <div className="food-allergy-select">
            {commonAllergies.map((allergy) => (
              <button
                key={allergy}
                type="button"
                className={`${allergy.toLowerCase()} ${
                  allergies.includes(allergy) ? "selected" : ""
                }`}
                onClick={() => toggleAllergies(allergy)}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Days */}
        <div className="goals_but_input">
          <label>What days would you like meal suggestions?</label>
          <div className="food-days-select">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (day) => (
                <button
                  key={day}
                  type="button"
                  className={`${day.toLowerCase()} ${
                    newFoodDay.includes(day) ? "selected" : ""
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              )
            )}
          </div>
        </div>

        <button
          type="submit"
          className="save-button"
          onClick={() => {
            localStorage.setItem(
              "selectedFoodDays",
              JSON.stringify(newFoodDay)
            );
          }}
          disabled={!isFormValid}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default GoalsPage;
