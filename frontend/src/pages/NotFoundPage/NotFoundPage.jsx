import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h2>
        4
        <img src="/404-page.png" alt="0" className="astro-zero" />
        4: Error
      </h2>
      <p>PAGE NOT FOUND</p>
      <button className="back-home" onClick={() => navigate("/home")}>
        Back To Home
      </button>
    </div>
  );
}
