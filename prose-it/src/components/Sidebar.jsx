import React from 'react';

const Sidebar = ({ pronouns, setPronouns, style, setStyle }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>📝 Character</h3>
        <label>Pronouns</label>
        <select value={pronouns} onChange={(e) => setPronouns(e.target.value)}>
          <option value="she/her">She / Her</option>
          <option value="he/him">He / Him</option>
          <option value="they/them">They / Them</option>
          <option value="I/me">First Person (I / Me)</option>
        </select>
      </div>

      <div className="sidebar-section">
        <h3>🎨 Writing Style</h3>
        <label>Genre / Vibe</label>
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="literary">Literary Fiction (Standard)</option>
          <option value="thriller">Thriller / Noir (Tense)</option>
          <option value="romance">Romance (Soft & Emotional)</option>
          <option value="fantasy">High Fantasy (Epic)</option>
          <option value="horror">Horror (Unsettling)</option>
          <option value="screenplay">Screenplay (Action lines)</option>
        </select>
      </div>

      <div className="sidebar-info">
        <h4>About</h4>
        <p>Act out an expression to generate prose in the selected style.</p>
      </div>
    </div>
  );
};

export default Sidebar;