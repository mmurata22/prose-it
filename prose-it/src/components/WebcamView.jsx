import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const WebcamView = ({ onCapture }) => {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [expression, setExpression] = useState(null);

  // HELPER: Find the highest scoring emotion
  const getDominantEmotion = (expressions) => {
    if (!expressions) return "";
    // Returns the key with the highest value (e.g. "happy")
    const emotion = Object.keys(expressions).reduce((a, b) => 
      expressions[a] > expressions[b] ? a : b
    );
    // Capitalize first letter
    return emotion.charAt(0).toUpperCase() + emotion.slice(1);
  };

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => { videoRef.current.srcObject = stream; })
      .catch((err) => console.error(err));
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (videoRef.current) {
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

  // Extract the name for display
  const currentEmotionName = expression ? getDominantEmotion(expression) : "No Face";

  return (
    <div className="webcam-container">
      {!modelsLoaded ? <h2>Loading AI Models...</h2> : 
       <button onClick={startVideo}>Start Camera</button>
      }
      
      <div style={{ position: 'relative' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          onPlay={handleVideoOnPlay}
          width="720"
          height="560"
        />
      </div>

      <div className="controls">
        {/* UPDATED: Displays the actual emotion name instead of "Tracking..." */}
        <p>Current Detect: <strong>{currentEmotionName}</strong></p>
        
        <button 
            onClick={() => onCapture(expression, currentEmotionName)} 
            disabled={!expression}
        >
          Generate Prose for this Look
        </button>
      </div>
    </div>
  );
};

export default WebcamView;