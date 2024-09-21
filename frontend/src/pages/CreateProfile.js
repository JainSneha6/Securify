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
        <div className="min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 text-white flex flex-col justify-center items-center p-4">
            <h2 className="text-4xl font-bold mb-6">Create Profile</h2>
            <div className="flex flex-col space-y-4">
                <button
                    onClick={handleFaceRecognition}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Create Face Recognition Model
                </button>
                <button
                    onClick={handleVoiceRecognition}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Create Voice Recognition Model
                </button>
            </div>
        </div>
    );
};

export default CreateProfile;
