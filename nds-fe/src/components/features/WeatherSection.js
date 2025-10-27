import React from 'react';
import WeatherCard from './WeatherCard';
import './WeatherSection.css';

function WeatherSection({ location, pm10, pm2_5, o3, airQuality, airQualityColor }) {
  return (
    <div className="weather-section">
      <div className="location-header">
        <div className="location-info">
          <span className="location-icon">📍</span>
          <div className="location-details">
            <div className="location-name">{location}</div>
            <div className="location-status">현재 위치</div>
          </div>
        </div>
      </div>

      <div className="weather-cards">
        <WeatherCard 
          icon="🌫️"
          value={pm10}
          label="미세먼지"
          bgColor="#FFF3F3"
          iconColor="#D32F2F"
        />
        <WeatherCard 
          icon="☁️"
          value={pm2_5}
          label="초미세먼지"
          bgColor="#FFF3F3"
          iconColor="#F57C00"
        />
        <WeatherCard 
          icon="⚡"
          value={o3 ? o3.toFixed(3) : '0.000'}
          label="오존"
          bgColor="#E1F5FE"
          iconColor="#00BCD4"
        />
        <WeatherCard 
          icon="🍃"
          value={airQuality}
          label="대기질"
          bgColor="#FFF3F3"
          iconColor={airQualityColor || "#43A047"}
        />
      </div>
    </div>
  );
}

export default WeatherSection;

