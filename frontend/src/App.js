import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FaceRecognition from "./components/FaceRecognition";
import VoiceRecognition from "./components/VoiceRecognition";
import IrisRecognition from "./components/IrisRecognition";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/face-recognition" element={<FaceRecognition />} />
        <Route path="/voice-recognition" element={<VoiceRecognition />} />
        <Route path="/iris-recognition" element={<IrisRecognition />} />
      </Routes>
    </Router>
  );
};

export default App;
