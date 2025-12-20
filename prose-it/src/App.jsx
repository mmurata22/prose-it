import { useState } from 'react';
import WebcamView from './components/WebcamView';
import ProseDisplay from './components/ProseDisplay';
import Sidebar from './components/Sidebar';
import { generateProse } from './services/gemini';
import './App.css';

function App() {
  // State for the AI generated text
  const [prose, setProse] = useState("");
  
  // State for loading status
  const [loading, setLoading] = useState(false);
  
  // State for the captured emotion name (e.g. "Happy")
  const [capturedEmotion, setCapturedEmotion] = useState("");
  
  // State for Sidebar settings (Pronouns & Genre)
  const [pronouns, setPronouns] = useState("they/them");
  const [style, setStyle] = useState("literary");

  // The function triggered when the user clicks "Generate"
  const handleCapture = async (emotions, emotionName) => {
    setLoading(true);
    setCapturedEmotion(emotionName);
    
    // Call the API with the detected emotions AND the user settings
    const text = await generateProse(emotions, pronouns, style);
    
    setProse(text);
    setLoading(false);
  };

  return (
    <div className="app-container">
      
      {/* LEFT SIDE: The Main Application Area */}
      <div className="main-content">
        <h1>ProsePose 🎭</h1>
        
        {/* The Camera Component */}
        <WebcamView onCapture={handleCapture} />

        {/* The Text Output Component */}
        <ProseDisplay 
          prose={prose} 
          loading={loading} 
          emotionName={capturedEmotion} 
        />
      </div>

      {/* RIGHT SIDE: The Settings Menu */}
      <Sidebar 
        pronouns={pronouns} 
        setPronouns={setPronouns} 
        style={style} 
        setStyle={setStyle}
      />

    </div>
  );
}

export default App;