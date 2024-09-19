import React from "react";

const FaceRecognition = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-blue-600 text-white flex flex-col justify-center items-center p-4">
      {/* Title Section */}
      <h2 className="text-4xl font-bold mb-6">
        Face Recognition
      </h2>
      
      {/* Webcam Feed Container with Subtle Gradient Border */}
      <div className="w-64 h-64 flex justify-center items-center bg-gray-800 rounded-full border-4 border-blue-300">
        <div className="w-full h-full flex justify-center items-center p-4 bg-gray-700 rounded-full">
          <span className="text-xl text-white">[ Webcam Feed ]</span>
        </div>
      </div>

      {/* Instruction Text */}
      <p className="mt-6 text-lg">
        Align your face with the camera to proceed
      </p>
    </div>
  );
};

export default FaceRecognition;
