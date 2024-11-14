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
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white flex flex-col justify-center items-center p-12">
      {/* Title Section */}
      <h2 className="text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-green-100">
        VOICE RECOGNITION
      </h2>

      <p className="text-xl font-semibold mb-12 tracking-wider">
        Capture your voice and start the recognition process.
      </p>

      {/* Input for user's name */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="mb-6 p-4 rounded-lg bg-green-200 text-green-800 placeholder-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 ring-offset-2 w-full max-w-xs"
      />

      {/* Microphone Icon Container */}
      <div
        className={`mt-8 w-32 h-32 bg-green-700 rounded-full flex justify-center items-center ${recording ? "animate-pulse" : ""}`}
        onClick={handleRecord}
      >
        <span className="text-4xl cursor-pointer">🎤</span>
      </div>

      {/* Instruction Text */}
      <p className="mt-8 text-xl font-semibold">Speak clearly to unlock the door</p>

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
