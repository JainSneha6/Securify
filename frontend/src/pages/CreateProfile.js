import React from "react";
import { useNavigate } from "react-router-dom";

const CreateProfile = () => {
    const navigate = useNavigate();

    const handleFaceRecognition = () => {
        // Redirect to face recognition capture page
        navigate("/create-face-model");
    };

    const handleVoiceRecognition = () => {
        // Redirect to voice recognition capture page
        navigate("/create-voice-model");
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white flex flex-col justify-center items-center p-12">
            <div className="text-center">
                <h2 className="text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">
                    CREATE YOUR PROFILE
                </h2>
                <p className="text-xl font-semibold mb-12 tracking-wider">
                    Select your recognition method to start the journey!
                </p>
            </div>

            <div className="flex flex-col space-y-6 w-full max-w-lg">
                <button
                    onClick={handleFaceRecognition}
                    className="bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800 hover:scale-110 text-white font-semibold py-4 px-8 rounded-full shadow-2xl transform transition duration-300 ease-out hover:bg-yellow-600 hover:shadow-xl hover:ring-4 hover:ring-yellow-300 ring-offset-2"
                >
                    Face Recognition Model
                </button>
                <button
                    onClick={handleVoiceRecognition}
                    className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 hover:scale-110 text-white font-semibold py-4 px-8 rounded-full shadow-2xl transform transition duration-300 ease-out hover:bg-yellow-500 hover:shadow-xl hover:ring-4 hover:ring-yellow-300 ring-offset-2"
                >
                    Voice Recognition Model
                </button>
            </div>
        </div>
    );
};

export default CreateProfile;
