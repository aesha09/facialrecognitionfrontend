import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

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
    <div className="min-h-screen bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex flex-col items-center justify-center p-4 font-sans">
      <h1 className="text-4xl font-bold mb-4 drop-shadow">Facial Emotion Recognition</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-2xl shadow-lg border-4 border-white mb-4"
      />

      <button
        onClick={captureAndPredict}
        className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-semibold shadow-md hover:bg-indigo-100 transition"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Detect Emotion'}
      </button>

      {emotion && (
        <div className="mt-6 p-4 bg-white text-indigo-800 rounded-xl shadow-lg text-center w-64">
          <p className="text-lg font-semibold">Detected Emotion:</p>
          <p className="text-3xl font-bold capitalize">{emotion}</p>
          <p className="text-sm mt-1">Confidence: {confidence}</p>
        </div>
      )}
    </div>
  );
}
