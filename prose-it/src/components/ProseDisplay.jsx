import React from 'react';

const ProseDisplay = ({ prose, loading, emotionName }) => {
  
  if (loading) {
    return (
      <div className="prose-box loading">
        <p>✨ analyzing {emotionName.toLowerCase()} expression...</p>
      </div>
    );
  }

  if (!prose) {
    return (
      <div className="prose-box empty">
        <p><em>Act out an emotion to generate a description.</em></p>
      </div>
    );
  }

  return (
    <div className="prose-box">
      <h3>The Look: {emotionName}</h3> 
      <hr style={{ opacity: 0.3, margin: '10px 0' }} />
      
      <p className="prose-text">{prose}</p>
      
      <div className="actions">
        <button 
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(prose);
            alert("Copied!");
          }}
        >
          Copy Text
        </button>
      </div>
    </div>
  );
};

export default ProseDisplay;