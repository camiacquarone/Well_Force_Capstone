import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";

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
  const [NavBarOpen, setNavBarOpen] = useState(false);
  const toggleNavBar = () => setNavBarOpen((isOpen) => !isOpen);

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
              <><HomePage/> <NavBar/></>
              
            </ProtectedRoute>
          }
        />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <GoalsPage /> <NavBar />
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
