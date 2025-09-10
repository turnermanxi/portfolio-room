// Tutorial.jsx
import React, { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import "./Tutorial.css";

const Tutorial = ({ setFocusTarget }) => {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  const steps = [
    { message: "Welcome to my 3D Portfolio Room!" },
    { message: "Click below to see my projects!", highlightId: "monitor" },
  ];

  // ——— TYPING EFFECT ———
  useEffect(() => {
    const { message } = steps[step];
    setDisplayedText(""); // reset

    // schedule a timeout for each character
    const timeouts = message.split("").map((_, idx) =>
      setTimeout(() => {
        // slice up to idx+1 — never undefined
        setDisplayedText(message.slice(0, idx + 1));
      }, idx * 80)
    );

    // cleanup all pending timeouts if step changes early
    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [step]);

  // ——— ADVANCE STEP AFTER TYPING + PAUSE ———
  useEffect(() => {
    const pause = 1000;
    const duration = steps[step].message.length * 80 + pause;
    const timer = setTimeout(() => {
      if (step < steps.length - 1) setStep((s) => s + 1);
    }, duration);
    return () => clearTimeout(timer);
  }, [step]);

  const current = steps[step];

  return (
    <Html position={[0, 0, 0]}>
      <div className="tutorial-container">
        <p className="tutorial-text">{displayedText}</p>

        {current.highlightId && (
          <button
            className="tutorial-button"
            onClick={() => setFocusTarget(current.highlightId)}
          >
            Zoom to {current.highlightId}
          </button>
        )}
      </div>
    </Html>
  );
};

export default Tutorial;
// Note: The `setFocusTarget` prop is expected to be a function that handles zooming to the specified target.
// You can implement this function in the parent component where you use the Tutorial component.
// It should update the camera position and lookAt target based on the provided ID (e.g, "monitor").  