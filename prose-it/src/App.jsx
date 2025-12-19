import { useState } from 'react';
import WebcamView from './components/WebcamView';
import ProseDisplay from './components/ProseDisplay';
import { generateProse } from './services/gemini';
import './App.css';

function App() {
  const [prose, setProse] = useState("");
  const [loading, setLoading] = useState(false);
  const [capturedEmotion, setCapturedEmotion] = useState("");

  // Update handleCapture to accept the name as a second argument
  const handleCapture = async (emotions, emotionName) => {
    setLoading(true);
    setCapturedEmotion(emotionName); // Save the name (e.g., "Sadness")
    
    const text = await generateProse(emotions);
    setProse(text);
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>ProsePose 🎭</h1>
      
      <WebcamView onCapture={handleCapture} />

      {/* Pass the captured name to the display */}
      <ProseDisplay 
        prose={prose} 
        loading={loading} 
        emotionName={capturedEmotion} 
      />
    </div>
  );
}

export default App;