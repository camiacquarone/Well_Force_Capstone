import React from "react";
import { SignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";

const SignInPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/home", { replace: true });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="auth-page-container">
      {" "}
      {!isSignedIn && <SignIn path="/sign-in" routing="path" />}
    </div>
  );
};

export default SignInPage;
