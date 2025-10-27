import React from 'react';
import './WeatherCard.css';

function WeatherCard({ icon, value, label, bgColor, iconColor }) {
  return (
    <div className="weather-card" style={{ backgroundColor: bgColor }}>
      <div className="weather-icon" style={{ color: iconColor }}>
        {icon}
      </div>
      <div className="weather-content">
        <div className="weather-value">{value}</div>
        <div className="weather-label">{label}</div>
      </div>
    </div>
  );
}

export default WeatherCard;

