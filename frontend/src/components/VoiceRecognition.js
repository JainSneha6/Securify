import React, { useState } from "react";

const VoiceRecognition = () => {
  const [recording, setRecording] = useState(false);
  const [name, setName] = useState("");
  const [recognitionResult, setRecognitionResult] = useState("");

  // Function to send the user's name to the backend and start recording on the server
  const handleRecord = async () => {
    if (!name) {
      setRecognitionResult("Please enter your name.");
      return;
    }

    setRecording(true); // Show the recording status on frontend

    try {
      const response = await fetch("http://localhost:5000/recognize_voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }), // Send only the name
      });

      const result = await response.json();
      setRecognitionResult(result.result); // Show the recognition result
    } catch (error) {
      console.error("Error recognizing voice:", error);
      setRecognitionResult("Error recognizing voice.");
    } finally {
      setRecording(false); // Stop the recording status
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-300 to-green-600 text-white flex flex-col justify-center items-center p-4">
      {/* Title Section */}
      <h2 className="text-4xl font-bold mb-6">Voice Recognition</h2>

      {/* Input for user's name */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="p-2 rounded text-black"
      />

      {/* Microphone Icon Container */}
      <div
        className={`w-32 h-32 bg-gray-800 rounded-full flex justify-center items-center ${recording ? "animate-pulse" : ""
          }`}
        onClick={handleRecord}
      >
        <span className="text-4xl cursor-pointer">🎤</span>
      </div>

      {/* Instruction Text */}
      <p className="mt-8 text-lg">Speak clearly to unlock the door</p>

      {/* Recording Status */}
      {recording && <p className="mt-4">Recording... Please wait.</p>}

      {/* Recognition Result */}
      {recognitionResult && (
        <p className="mt-4 text-lg">{`Recognition Result: ${recognitionResult}`}</p>
      )}
    </div>
  );
};

export default VoiceRecognition;
