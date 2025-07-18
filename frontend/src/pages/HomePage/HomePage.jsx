import React, { useState, useEffect } from "react";
import "../../App/App.css"; // Assuming you have a basic App.css for styling
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton, // Clerk's UserButton component for profile and logout
  useAuth, // Hook to get authentication status and token
} from "@clerk/clerk-react";

import "../HomePage/HomePage.css";
import NavBar from "../../components/NavBar/NavBar";

const HomePage = () => {
  const [clerkUserId, setClerkUserId] = useState("");

  // useAuth hook from Clerk to get the current session token and user info
  const { userId, isLoaded, isSignedIn, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // useEffect hook to update Clerk user ID when auth state changes
  useEffect(() => {
    if (isLoaded && isSignedIn && userId) {
      setClerkUserId(userId);
    } else if (isLoaded && !isSignedIn) {
      setClerkUserId("Not Signed In");
    }
  }, [isLoaded, isSignedIn, userId]);

  return (
    <div>
      {/* <NavBar isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      <h1 className="welcome-user">Welcome, User!</h1>
    </div>
  );
};

export default HomePage;
