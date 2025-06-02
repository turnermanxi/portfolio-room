// Tutorial.jsx
import React, { useEffect, useState } from "react";

const Tutorial = ({ setFocusTarget }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { message: "Welcome!", highlightId: null },
    { message: "Use your mouse or touch to look around.", highlightId: null },
    { message: "Each object is interactive.", highlightId: "monitor" },
    { message: "Click to explore projects!", highlightId: "shelf" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearTimeout(timer);
  }, [step]);

  const current = steps[step];

  return (
    <div className="absolute top-5 left-5 bg-white bg-opacity-90 text-black p-4 rounded-xl shadow-md z-50">
      <p>{current.message}</p>

      {current.highlightId && (
        <div className="mt-3 flex flex-col gap-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
            onClick={() => setFocusTarget(current.highlightId)}
          >
            Zoom to {current.highlightId}
          </button>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
