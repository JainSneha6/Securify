import React, { useState, useRef } from "react";

const FaceRecognition = () => {
  const [personName, setPersonName] = useState(""); // User's name
  const [recognitionResult, setRecognitionResult] = useState(null); // Recognition result
  const [capturing, setCapturing] = useState(false); // Capturing state
  const videoRef = useRef(null); // Reference to the video element

  // Start the webcam stream
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing webcam: ", err);
    }
  };

  // Capture images from the video stream
  const captureImages = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const images = [];

    const video = videoRef.current;

    // Set canvas dimensions equal to video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    setCapturing(true);

    // Capture 50 images from the video stream
    for (let i = 0; i < 50; i++) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      images.push(imageData); // Store base64 image data
      await new Promise((resolve) => setTimeout(resolve, 100)); // Delay between captures
    }

    setCapturing(false);
    return images;
  };

  // Function to handle the API call to recognize face
  const handleRecognizeFace = async () => {
    if (!personName) {
      alert("Please enter your name");
      return;
    }

    const images = await captureImages();

    try {
      const response = await fetch("http://localhost:5000/recognize_face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: personName,
          images, // Send the array of images
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecognitionResult(data);
      } else {
        alert(data.message || "Face recognition failed");
      }
    } catch (error) {
      console.error("Error during face recognition:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white flex flex-col justify-center items-center p-12">
      {/* Title Section */}
      <div className="text-center -mt-8 mb-8">
        <h2 className="text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">
          FACE RECOGNITION
        </h2>
        <p className="text-xl font-semibold m-1 tracking-wider">
            Capture your face and start the recognition process.
        </p>
      </div>

      {/* Name Input */}
      <input
        type="text"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        placeholder="Enter your name"
        className="mb-6 p-4 rounded-lg bg-blue-200 text-blue-800 placeholder-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400 ring-offset-2 w-full max-w-xs"
      />

      {/* Webcam Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-64 h-64 rounded-full mb-6 object-cover border-4 border-blue-300 shadow-xl"
      />

      {/* Start Webcam Button */}
      <button
        onClick={startWebcam}
        className="px-6 py-3 mb-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 text-white font-semibold rounded-full shadow-2xl transform transition duration-300 ease-out hover:bg-blue-600 hover:shadow-xl hover:ring-4 hover:ring-blue-300 ring-offset-2"
      >
        Start Webcam
      </button>

      {/* Recognize Button */}
      <button
        onClick={handleRecognizeFace}
        disabled={capturing}
        className="px-6 py-3 mb-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 text-white font-semibold rounded-full shadow-2xl transform transition duration-300 ease-out hover:bg-blue-600 hover:shadow-xl hover:ring-4 hover:ring-blue-300 ring-offset-2"
      >
        {capturing ? "Capturing..." : "Recognize Face"}
      </button>

      {/* Display Recognition Result */}
      {recognitionResult && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Recognition Result</h3>
          <p>
            Result: <strong>{recognitionResult.result}</strong>
          </p>
          {recognitionResult.result === "Matched" && (
            <>
              {/* Optional: Add confidence or emotion */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
