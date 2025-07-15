import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import LandingPage from "../pages/LandingPage/LandingPage";
import GoalsPage from "../pages/GoalsPage/GoalsPage";
import AICompanion from "../components/AICompanion/AICompanion";
import NavBar from "../components/NavBar/NavBar";



function App() {

const [NavBarOpen, setNavBarOpen] = useState(false);
const toggleNavBar = () => setNavBarOpen((isOpen) => !isOpen);

  return (
    <div className="App">
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/sidebar" element={<NavBar isOpen={NavBarOpen} toggleNavBar={toggleNavBar}/>}/>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<AICompanion />} />
            <Route path="/profile" element={<GoalsPage/>}/>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );

}

export default App;
