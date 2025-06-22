import React, { useState } from "react";
import axios from "axios";

function Feedback({ prediction }) {
  const [feedback, setFeedback] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [correctedSpecies, setCorrectedSpecies] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedback = (isCorrect) => {
    if (isCorrect) {
      setFeedback("Thank you for your feedback!");
      sendFeedback(prediction.species_name, prediction.species_name, prediction.confidence);
    } else {
      setShowInput(true);
    }
  };

  const handleSubmit = async () => {
    if (!correctedSpecies.trim()) {
      setMessage("Please enter the correct species name.");
      return;
    }

    await sendFeedback(prediction.species_name, correctedSpecies, prediction.confidence);
    setMessage("Thank you! Your feedback has been submitted.");
    setShowInput(false);
  };

  const sendFeedback = async (originalSpecies, correctedSpecies, confidence) => {
    try {
      await axios.post("http://127.0.0.1:5000/feedback", {
        originalSpecies,
        correctedSpecies,
        confidence,
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="text-center mt-6">
      <h3 className="text-lg font-semibold">Was this prediction correct?</h3>
      <div className="flex justify-center space-x-4 mt-3">
        <button onClick={() => handleFeedback(true)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">✅ Yes</button>
        <button onClick={() => handleFeedback(false)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">❌ No</button>
      </div>

      {/* Show input field if the prediction is incorrect */}
      {showInput && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter the correct species name"
            value={correctedSpecies}
            onChange={(e) => setCorrectedSpecies(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full max-w-xs text-center"
          />
          <button onClick={handleSubmit} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Submit
          </button>
          {message && <p className="mt-2 text-gray-700">{message}</p>}
        </div>
      )}

      {feedback && <p className="mt-3 text-gray-700">{feedback}</p>}
    </div>
  );
}

export default Feedback;
