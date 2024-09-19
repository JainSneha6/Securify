import React from "react";

const VoiceRecognition = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-300 to-green-600 text-white flex flex-col justify-center items-center p-4">
      {/* Title Section */}
      <h2 className="text-4xl font-bold mb-6">
        Voice Recognition
      </h2>
      
      {/* Microphone Icon Container */}
      <div className="w-32 h-32 bg-gray-800 rounded-full flex justify-center items-center animate-pulse">
        <span className="text-4xl">🎤</span>
      </div>
      
      {/* Instruction Text */}
      <p className="mt-8 text-lg">
        Speak clearly to unlock the door
      </p>
    </div>
  );
};

export default VoiceRecognition;
