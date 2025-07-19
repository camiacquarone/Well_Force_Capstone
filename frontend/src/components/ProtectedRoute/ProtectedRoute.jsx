import React from "react";
import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null; // Avoid flashing before auth loads

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return children;
};

export default ProtectedRoute;


