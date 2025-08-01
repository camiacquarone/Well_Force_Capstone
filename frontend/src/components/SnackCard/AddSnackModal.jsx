// src/components/AddSnackModal/AddSnackModal.jsx
import React, { useState } from "react";
import "./AddSnackModal.css"; // Create this CSS file for styling

export default function AddSnackModal({ onClose, onAddSnack }) {
  const [snackName, setSnackName] = useState("");
  const [snackDescription, setSnackDescription] = useState("");
  const [snackImageUrl, setSnackImageUrl] = useState("");
  const [snackWellnessCategory, setSnackWellnessCategory] = useState(""); // Comma-separated
  const [snackCalories, setSnackCalories] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!snackName.trim() || !snackCalories.trim()) {
      alert("Please enter at least a snack name and calories.");
      return;
    }

    const newSnack = {
      name: snackName.trim(),
      description: snackDescription.trim(),
      image_url: snackImageUrl.trim() || "https://via.placeholder.com/150", // Default image
      wellness_category: snackWellnessCategory
        .split(",")
        .map((cat) => cat.trim())
        .filter(Boolean), // Split by comma and clean up
      nutritional_info: [{ calories: parseInt(snackCalories) || 0 }], // Ensure calories is a number
      // Add other fields if desired, matching your SnackCard's expected props
    };

    onAddSnack(newSnack);
    // Clear form fields
    setSnackName("");
    setSnackDescription("");
    setSnackImageUrl("");
    setSnackWellnessCategory("");
    setSnackCalories("");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add Your Custom Snack</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="snackName">Snack Name:</label>
            <input
              type="text"
              id="snackName"
              value={snackName}
              onChange={(e) => setSnackName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="snackDescription">Description:</label>
            <textarea
              id="snackDescription"
              value={snackDescription}
              onChange={(e) => setSnackDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="snackImageUrl">Image URL (optional):</label>
            <input
              type="url"
              id="snackImageUrl"
              value={snackImageUrl}
              onChange={(e) => setSnackImageUrl(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="snackWellnessCategory">Wellness Category (comma-separated):</label>
            <input
              type="text"
              id="snackWellnessCategory"
              value={snackWellnessCategory}
              onChange={(e) => setSnackWellnessCategory(e.target.value)}
              placeholder="e.g., energy, protein, healthy fats"
            />
          </div>
          <div className="form-group">
            <label htmlFor="snackCalories">Calories:</label>
            <input
              type="number"
              id="snackCalories"
              value={snackCalories}
              onChange={(e) => setSnackCalories(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="add-button">Add Snack</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
