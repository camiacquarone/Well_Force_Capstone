import React from "react";
import { SignUp, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css"; // Your existing CSS for this page

const SignUpPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // If the user is already signed in, redirect them
  //this may occur if the user wants to mess around and tries to make a new account while signed in
  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/home", { replace: true });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="auth-page-container">
      {" "}
      {!isSignedIn && (
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          afterSignUpUrl="/profile"
           appearance={{elements:{formButtonPrimary:{backgroundColor:"#239dd6"}}}}
        />
      )}
    </div>
  );
};

export default SignUpPage;
