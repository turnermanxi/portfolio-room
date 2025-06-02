// src/components/ArrowHint.jsx
import React from "react";
import "./ArrowHint.css"; // we'll animate this

const ArrowHint = ({ position, onClick, size = "md" }) => {
  const sizes = {
    sm: "40px",
    md: "60px",
    lg: "80px",
  };

  return (
    <div
      className="arrow-hint"
      onClick={onClick}
      style={{
        left: position.x,
        top: position.y,
        width: sizes[size],
        height: sizes[size],
      }}
    >
      ↓
    </div>
  );
};

export default ArrowHint;
