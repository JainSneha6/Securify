import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const FaceModelCapture = () => {
    const [name, setName] = useState("");
    const [emotion, setEmotion] = useState(""); // New state for emotion
    const [capturing, setCapturing] = useState(false);
    const videoRef = useRef(null);
    const mediaStreamRef = useRef(null);

    const handleCapture = async () => {
        setCapturing(true);
        const capturedImages = [];

        // Create a canvas to draw the video frames
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        let count = 0;

        const captureInterval = setInterval(() => {
            if (count < 100) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/jpeg');
                capturedImages.push(imageData);
                count++;
            } else {
                clearInterval(captureInterval);
                sendImages(capturedImages);
            }
        }, 100); // Capture every 100 ms
    };

    const sendImages = async (capturedImages) => {
        try {
            const response = await axios.post('http://localhost:5000/upload_images', {
                name,
                emotion, // Send the selected emotion to the backend
                images: capturedImages,
            });
            alert(response.data.message);
        } catch (error) {
            console.error("Error sending images:", error);
            alert("Error sending images");
        } finally {
            setCapturing(false);
        }
    };

    useEffect(() => {
        const startVideoStream = async () => {
            try {
                if (!mediaStreamRef.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    mediaStreamRef.current = stream;

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current.play().catch((error) => {
                                console.error("Error starting video playback:", error);
                            });
                        };
                    }
                }
            } catch (error) {
                console.error("Error accessing the webcam:", error);
            }
        };

        startVideoStream();

        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-300 to-blue-600 text-white flex flex-col justify-center items-center p-4">
            <h2 className="text-4xl font-bold mb-6">Face Recognition Model Capture</h2>

            {/* Input for the user's name */}
            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded mb-4"
            />

            {/* Dropdown for emotion selection */}
            <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded mb-4"
            >
                <option value="">Select Emotion</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="neutral">Neutral</option>
                <option value="surprised">Surprised</option>
            </select>

            {/* Video element to display webcam stream */}
            <video ref={videoRef} className="w-64 h-64 rounded-lg mb-4" />

            {/* Button to start capturing images */}
            <button
                onClick={handleCapture}
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${capturing ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={capturing}
            >
                {capturing ? "Capturing..." : "Start Capturing Face Images"}
            </button>
        </div>
    );
};

export default FaceModelCapture;
