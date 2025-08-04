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

  const position = ["Intern", "Full Time"];
  const commonAllergies = [
    "Milk", "Eggs", "Peanuts", "Tree Nuts", "Soy", "Wheat", "Fish", "Shellfish", "Sesame"
  ];

  const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const isFormValid =
    name.trim() !== "" &&
    newUserPosition.trim() !== "" &&
    newUserImage_url.trim() !== "" &&
    !nameError;

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
      setNameError("");
    } else {
      setNameError("Only letters and spaces are allowed.");
    }
  };

  const increaseCalories = () => setCalories((prev) => Math.min(prev + 50, 5000));
  const decreaseCalories = () => setCalories((prev) => Math.max(prev - 50, 0));

  function toggleFoodGoal(goal) {
    setNewFoodGoal((prev) =>
      prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal]
    );
  }

  function toggleDietaryPref(dr) {
    setDietaryPref((prev) =>
      prev.includes(dr) ? prev.filter((item) => item !== dr) : [...prev, dr]
    );
    console.log("dietary preferences: ", dietaryPref);
  }

  function toggleAllergies(allerg) {
    setAllergies((prev) =>
      prev.includes(allerg) ? prev.filter((item) => item !== allerg) : [...prev, allerg]
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
  }, [user]); // ✅ Fixed: added dependency array

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

    console.log("Does the user exist? ", localUserExist);

    try {
      const token = await getToken();
      let resultUser;

      console.log("USER INFORMATION");
      console.log("Name:", name);
      console.log("Position:", newUserPosition);
      console.log("Calories", calories);
      console.log("Image URL:", newUserImage_url);
      console.log("dietary preferences: ", dietaryPref);
      console.log("Food Goal:", newFoodGoal);
      console.log("Food Day:", newFoodDay);
      console.log("allergies: ", allergies);

      if (localUserExist) {
        resultUser = await axios.put(
          `${baseUrl}/api/users`,
          {
            image_url: newUserImage_url,
            name: name,
            allergies: allergies,
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
          name: name,
          allergies: allergies,
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
      navigate("/home"); // ✅ This is now the only navigation call
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  }

  const hasProfile = !!user;

  return (
    <div className="GoalsPage">
      <span className="top-buttons">
        {!hasProfile && (
          <button
            type="button"
            className="top-left-button"
            onClick={() => navigate("/")}
          >
            ⬅ Back
          </button>
        )}
      </span>
      <h1>Profile</h1>
      <h3> Welcome to Your Profile! </h3>
      <form onSubmit={handleSubmit} className="create-profile-form">
        {/* Name */}
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

        {/* Position */}
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
                setCalories(sanitized === "" ? 0 : parseInt(sanitized)); // ✅ ensure it's a number
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

        {/* Profile Picture */}
        <div className="Goals_but_input">
          <label htmlFor="newUserImage" id="profile-pic-text">
            Profile Picture <span className="stars">*</span>
          </label>
          <div className="profile_pic">
            {[ /* characters */ 
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
                  className={`${char.className} ${isSelected ? "selected" : ""}`}
                  onClick={() => setNewUserImage_url(isSelected ? "" : char.selectedSrc)}
                />
              );
            })}
          </div>
        </div>

        {/* Food Goals */}
        {/* ... keep rest of form unchanged for brevity ... */}

        {/* Save Button */}
        <button
          type="submit"
          className="save-button"
          onClick={() => {
            localStorage.setItem("selectedFoodDays", JSON.stringify(newFoodDay));
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
