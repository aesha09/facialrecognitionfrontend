import React, { useRef, useState, useEffect } from "react";

const WebcamFeed = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("Loading...");

  useEffect(() => {
    const interval = setInterval(captureFrame, 2000);
    return () => clearInterval(interval);
  }, []);

  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");

    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataUrl }),
    });
    const result = await res.json();
    setEmotion(result.emotion);
  };

  return (
    <div>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        muted
        src="http://192.168.1.4:4747/video" // DroidCam stream URL
      />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
      <h2>Detected Emotion: {emotion}</h2>
    </div>
  );
};

export default WebcamFeed;
