import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import "./App.css"

const videoConstraints = {
  width: 480,
  height: 360,
  facingMode: 'user'
};

export default function App() {
  const webcamRef = useRef(null);
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureAndPredict = async () => {
    if (!webcamRef.current) return;
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then(res => res.blob());
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');

    try {
      const response = await axios.post('https://facial-emotion-backend.onrender.com/predict', formData);
      setEmotion(response.data.emotion);
      setConfidence(response.data.confidence.toFixed(2));
    } catch (error) {
      console.error('Prediction error:', error);
      setEmotion('Error');
      setConfidence(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Facial Emotion Recognition</h1>
  
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="webcam"
      />
  
      <button
        onClick={captureAndPredict}
        className="detect-button"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Detect Emotion'}
      </button>
  
      {emotion && (
        <div className="result-card">
        <p className="result-label">Detected Emotion:</p>
        <p className="result-emotion">{emotion}</p>
        <p className="result-confidence">Confidence: {confidence}</p>
      </div>
      
      )}
    </div>
  );
  
}
