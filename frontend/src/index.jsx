import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/App.jsx";
// import "./index.css"; // Optional: for global styles
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key from environment variables.");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Cannot find root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/landing">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
