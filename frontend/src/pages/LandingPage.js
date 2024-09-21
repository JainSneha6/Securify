import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaMicrophoneAlt, FaEye, FaKey, FaUserPlus } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-70"></div>

      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-extrabold mb-4 animate-fade-in">
          Securify - Your Safety, Our Priority!
        </h1>
        <FaKey className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 textwhite opacity-20" style={{ fontSize: '700px', top: '160px' }} />
        <p className="text-lg animate-fade-in delay-200">
          Choose your biometric method to unlock the door
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex space-x-8 z-10 mt-16">
        <GlassCard
          title="Create Profile"
          gradient="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
          Icon={FaUserPlus}
          onClick={() => navigate("/create-profile")}
        />
        <GlassCard
          title="Face Recognition"
          gradient="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
          Icon={FaUserShield}
          onClick={() => navigate("/face-recognition")}
        />
        <GlassCard
          title="Voice Recognition"
          gradient="bg-gradient-to-r from-green-400 via-green-500 to-green-600"
          Icon={FaMicrophoneAlt}
          onClick={() => navigate("/voice-recognition")}
        />
        <GlassCard
          title="Iris Recognition"
          gradient="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"
          Icon={FaEye}
          onClick={() => navigate("/iris-recognition")}
        />
      </div>
    </div>
  );
};

// GlassCard component remains unchanged
const GlassCard = ({ title, gradient, Icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer backdrop-blur-lg bg-white bg-opacity-10 border border-gray-600 rounded-xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500 relative overflow-hidden ${gradient}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-30 z-0"></div>
      <Icon className="text-5xl mb-4 text-white relative z-10" />
      <h2 className="text-xl font-semibold text-white relative z-10">{title}</h2>
    </div>
  );
};

export default LandingPage;
