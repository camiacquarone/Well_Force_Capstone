import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";

import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

import LandingPage from "../pages/LandingPage/LandingPage.jsx";
import SignUpPage from "../pages/SignUpPage/SignUpPage.jsx";
import SignInPage from "../pages/SignInPage/SignInPage.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import GoalsPage from "../pages/GoalsPage/GoalsPage.jsx";
import AICompanion from "../components/AICompanion/AICompanion";

import NavBar from "../components/NavBar/NavBar";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.jsx";
import FoodPage from "../pages/FoodPage/FoodPage.jsx";

function App() {
  const { userId, getToken } = useAuth();

  const [NavBarOpen, setNavBarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const toggleNavBar = () => setNavBarOpen((isOpen) => !isOpen);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("frontend:", userId);
      if (!userId) {
        setUser(null);
        return;
      }

      try {
        const token = await getToken();
        const response = await axios.get(
           `http://localhost:3000/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setUser(response.data); // Update state with the fetched data
        console.log("User data fetched:", response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [userId, getToken]);

  useEffect(() => {
    console.log("User state updated:", user);
    // You can also add logic here that depends on the 'user' being available
    // For example, if you need to do something *after* the user data is confirmed loaded
  }, [user]);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          <Route path="/sign-in/*" element={<SignInPage />} />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <AICompanion />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <>
                  <HomePage user={user} setUser={setUser} /> <NavBar />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <GoalsPage user={user} setUser={setUser} /> <NavBar />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/meals"
            element={
              <ProtectedRoute>
                <>
                  <FoodPage /> <NavBar />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <>
                <h2>404: Not Found</h2>
                <p>The page you're looking for does not exist.</p>
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
