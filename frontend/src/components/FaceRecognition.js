import React, { useState, useRef } from "react";

const FaceRecognition = () => {
  const [personName, setPersonName] = useState(""); // User's name
  const [chosenEmotion, setChosenEmotion] = useState(""); // Selected emotion
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
      alert("Please enter your name and choose an emotion");
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
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-blue-600 text-white flex flex-col justify-center items-center p-4">
      {/* Title Section */}
      <h2 className="text-4xl font-bold mb-6">Face Recognition</h2>

      {/* Name Input */}
      <input
        type="text"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        placeholder="Enter your name"
        className="mb-4 p-2 rounded bg-gray-200 text-gray-800"
      />

      {/* Emotion Dropdown */}
      {/* <select
        value={chosenEmotion}
        onChange={(e) => setChosenEmotion(e.target.value)}
        className="mb-4 p-2 rounded bg-gray-200 text-gray-800"
      >
        <option value="">Select Emotion</option>
        <option value="happy">Happy</option>
        <option value="sad">Sad</option>
        <option value="angry">Angry</option>
        <option value="neutral">Neutral</option>
        <option value="surprised">Surprised</option>
      </select> */}

      {/* Webcam Feed */}
      <video ref={videoRef} autoPlay playsInline className="w-64 h-64 rounded-full mb-4"></video>

      {/* Start Webcam Button */}
      <button
        onClick={startWebcam}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
      >
        Start Webcam
      </button>

      {/* Recognize Button */}
      <button
        onClick={handleRecognizeFace}
        disabled={capturing}
        className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
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
              {/* <p>Confidence: {recognitionResult.confidence}%</p>
              <p>Detected Emotion: {recognitionResult.emotion}</p> */}
            </>
          )}
          {/* {recognitionResult.result === "Not Matched" && (
            // <p>Detected Emotion: {recognitionResult.emotion}</p>
          )} */}
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
