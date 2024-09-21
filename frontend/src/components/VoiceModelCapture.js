import React, { useEffect, useState } from "react";
import axios from "axios";

const VoiceModelCapture = () => {
    const [name, setName] = useState("");
    const [recording, setRecording] = useState(false);

    const handleRecord = async () => {
        setRecording(true);
        try {
            await axios.post("http://localhost:5000/record_voice", { name });
            alert("Recorded 5 voice samples for " + name);
        } catch (error) {
            console.error("Error recording voice samples:", error);
            alert("Error recording voice samples");
        } finally {
            setRecording(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-300 to-green-600 text-white flex flex-col justify-center items-center p-4">
            <h2 className="text-4xl font-bold mb-6">Voice Recognition Model Capture</h2>
            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded mb-4"
            />
            <button
                onClick={handleRecord}
                className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${recording ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={recording}
            >
                {recording ? "Recording..." : "Start Recording Voice Samples"}
            </button>
        </div>
    );
};

export default VoiceModelCapture;
