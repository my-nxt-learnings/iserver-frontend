import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/welcome.css";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to I-Server Directory</h1>
        <p>Explore and manage global server infrastructure</p>
        <button onClick={() => navigate("/home")}>Enter App</button>
      </div>
    </div>
  );
};

export default Welcome;
