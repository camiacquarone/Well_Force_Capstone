import React, { useState, useEffect } from "react";

import "../../App/App.css";
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
  //   <div className="App p-4 bg-gray-100 min-h-screen font-inter flex flex-col items-center justify-center">
  //     <header className="App-header text-center mb-8 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
  //       <h1 className="welcome-user">Welcome, User!</h1>
  //       <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
  //         <SignedOut>
  //           <SignInButton
  //             mode="modal"
  //             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
  //           >
  //             Sign In
  //           </SignInButton>
  //         </SignedOut>
  //         <SignedIn>
  //           {/* Clerk's UserButton provides profile picture and logout functionality */}
  //           <UserButton afterSignOutUrl="/" />
  //           <div className="text-gray-700 text-sm md:text-base">
  //             {user && user.primaryEmailAddress && (
  //               <p>
  //                 Email:{" "}
  //                 <span className="font-semibold">
  //                   {user.primaryEmailAddress.emailAddress}
  //                 </span>
  //               </p>
  //             )}
  //           </div>
  //         </SignedIn>
  //       </div>
  //     </header>
  //   </div>
  //   <div className="App p-4 bg-gray-100 min-h-screen font-inter flex flex-col items-center justify-center">
  //     <header className="App-header text-center mb-8 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
  //       <h1 className="welcome-user">
  //         Welcome, User!
  //       </h1>
  //       <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
  //         <SignedOut>
  //           <SignInButton
  //             mode="modal"
  //             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
  //            >
  //             Sign In
  //           </SignInButton>
  //         </SignedOut>
  //         <SignedIn>
  //           {/* Clerk's UserButton provides profile picture and logout functionality */}
  //           <UserButton afterSignOutUrl="/" />
  //           <div className="text-gray-700 text-sm md:text-base">
  //             {user && user.primaryEmailAddress && (
  //               <p>
  //                 Email:{" "}
  //                 <span className="font-semibold">
  //                   {user.primaryEmailAddress.emailAddress}
  //                 </span>
  //               </p>
  //             )}
  //           </div>
  //         </SignedIn>
  //       </div>
  //     </header>

  //   </div>
  // );
};

export default HomePage;
