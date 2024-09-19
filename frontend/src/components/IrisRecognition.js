import React from "react";

const IrisRecognition = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-purple-600 text-white flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold mb-4">Iris Recognition</h2>
      <div className="w-64 h-64 bg-gray-800 rounded-full flex justify-center items-center">
        <div className="animate-spin-slow w-48 h-48 border-4 border-t-transparent border-white rounded-full"></div>
      </div>
      <p className="mt-8">Look into the scanner to proceed</p>
    </div>
  );
};

export default IrisRecognition;
