import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const WebcamView = ({ onCapture }) => {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [expression, setExpression] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Helper to get emotion name
  const getDominantEmotion = (expressions) => {
    if (!expressions) return "";
    const emotion = Object.keys(expressions).reduce((a, b) => 
      expressions[a] > expressions[b] ? a : b
    );
    return emotion.charAt(0).toUpperCase() + emotion.slice(1);
  };

  // Load models (runs in background)
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
        console.log("Models Loaded Successfully");
      } catch (error) {
        console.error("Model Loading Failed:", error);
      }
    };
    loadModels();
  }, []);

  const startVideo = () => {
    setIsCameraActive(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => { 
          if(videoRef.current) {
            videoRef.current.srcObject = stream; 
          }
      })
      .catch((err) => {
          console.error("Camera Error:", err);
          setIsCameraActive(false);
      });
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      // Only detect if video is playing AND models are actually ready
      if (modelsLoaded && videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current, 
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();

        if (detections.length > 0) {
          setExpression(detections[0].expressions); 
        }
      }
    }, 500);
  };

  const currentEmotionName = expression ? getDominantEmotion(expression) : "No Face";

  return (
    <div className="webcam-container">
      
      {/* THE STAGE */}
      <div className="video-stage">
        
        {/* IF CAMERA IS OFF -> SHOW BUTTON ALWAYS */}
        {!isCameraActive && (
          <div className="placeholder-screen">
             <div className="placeholder-content">
                <span style={{fontSize: '3rem'}}>📷</span>
                <p>Camera is Ready</p>
                
                {/* BUTTON IS FORCED TO BE HERE */}
                <button 
                  onClick={startVideo} 
                  className="start-btn"
                  style={{ marginTop: '10px', fontSize: '1.2rem', padding: '15px 30px' }}
                >
                  START CAMERA
                </button>

                {/* Status Text Below */}
                <p style={{marginTop: '15px', fontSize: '0.9rem', color: modelsLoaded ? 'green' : 'red'}}>
                  {modelsLoaded ? "AI Models Ready ✅" : "Loading AI Models... (Check Console if stuck)"}
                </p>
             </div>
          </div>
        )}

        {/* IF CAMERA IS ON -> SHOW VIDEO */}
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          onPlay={handleVideoOnPlay}
          width="720"
          height="560"
          style={{ display: isCameraActive ? 'block' : 'none' }} 
        />
      </div>

      <div className="controls">
        <p>Current Detect: <strong>{isCameraActive ? currentEmotionName : "Waiting for camera..."}</strong></p>
        
        <button 
            onClick={() => onCapture(expression, currentEmotionName)} 
            disabled={!expression}
        >
          Generate Prose
        </button>
      </div>
    </div>
  );
};

export default WebcamView;