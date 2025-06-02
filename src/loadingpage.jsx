import React, { useEffect, useState } from "react";
import "./LoadingScreen.css"; // We'll add styles next

const LoadingScreen = ({ onFinish }) => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    // Auto-finish loading after 3 seconds (or hook to asset load)
    const timeout = setTimeout(() => {
      onFinish();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="loading-screen">
      <h1 className="loading-text">Loading{dots}</h1>
    </div>
  );
};

export default LoadingScreen;
