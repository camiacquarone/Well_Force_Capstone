import React from "react";
import "./Chip.css";

const Chip = ({ label, type = "default" }) => {
  return <span className={`chip chip-${type}`}>{label}</span>;
};

export default Chip;
