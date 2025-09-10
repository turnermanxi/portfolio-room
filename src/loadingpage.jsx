import React, { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import "./LoadingScreen.css";

const LoadingScreen = ({ onFinish }) => {
  const { progress } = useProgress(); // tracks three.js default loading manager

  useEffect(() => {
    if (progress >= 100) onFinish?.();
  }, [progress, onFinish]);

  return (
    <div className="loading-screen">
      <h1 className="loading-text">Loading… {Math.floor(progress)}%</h1>
    </div>
  );
};

export default LoadingScreen;

