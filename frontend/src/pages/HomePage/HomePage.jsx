import AICompanionModal from "../../components/AICompanion/AICompanion";
import React, { useState, useEffect } from "react";
import axios from "axios";

import "../../App/App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

import "../HomePage/HomePage.css";
import Graph from "../../components/Graph/Graph";
import Carousel from "../../components/Carousel/Carousel";
import Info from "../../components/DisplayInfo/DisplayInfo";
import NavBar from "../../components/NavBar/NavBar";

import "../HomePage/HomePage.css";

const HomePage = ({ user, setUser }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  useEffect(() => {
    console.log("HomePage.jsx - Received user prop:", user);
  }, [user]);

  return (
    <div className="home-body">
      <h1 className="welcome-user">
        Welcome, {user ? user.name || "Friend" : "Guest"}!
      </h1>
      <div className="container-temp">
        <div className="separated-container">
          <Info user={user} />
          <Carousel />
        </div>
        <Graph />
      </div>
      {/* <div className="App p-4 bg-gray-100 min-h-screen font-inter flex flex-col items-center justify-center">
        <header className="App-header text-center mb-8 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <SignedOut>
              <SignInButton
                mode="modal"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
              >
                Sign In
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <div className="text-gray-700 text-sm md:text-base"></div>
            </SignedIn> */}
            <button
              type="button"
              className="ai-companion-button"
              onClick={() => setIsAIModalOpen(true)}
            >
              <img
                src="astro-profile-selected.png"
                alt="ai companion"
                width="60px"
                className="img-ai"
              ></img>
              Chat with me!
            </button>
            {isAIModalOpen && (
              <AICompanionModal onClose={() => setIsAIModalOpen(false)} />
            )}
          </div>
      //   </header>
      // </div>
    // </div>
  );
};

export default HomePage;
