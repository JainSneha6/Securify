import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FaceRecognition from "./components/FaceRecognition";
import VoiceRecognition from "./components/VoiceRecognition";

import CreateProfile from "./pages/CreateProfile";
import FaceModelCapture from "./components/FaceModelCapture";
import VoiceModelCapture from "./components/VoiceModelCapture";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/face-recognition" element={<FaceRecognition />} />
        <Route path="/voice-recognition" element={<VoiceRecognition />} />

        <Route path="/create-face-model" element={<FaceModelCapture />} />
        <Route path="/create-voice-model" element={<VoiceModelCapture />} />
      </Routes>
    </Router>
  );
};

export default App;
