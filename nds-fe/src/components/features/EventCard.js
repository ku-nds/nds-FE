import React from 'react';
import './EventCard.css';

function EventCard({ event }) {
  const { 
    image, 
    category, 
    isIndoor, 
    title, 
    location, 
    date, 
    time,
    distance 
  } = event;

  return (
    <div className="event-card">
      <div className="event-image-wrapper">
        <img src={image} alt={title} className="event-image" />
        <div className="event-badges">
          <span className="category-badge">{category}</span>
          <span className={`indoor-badge ${isIndoor ? 'indoor' : 'outdoor'}`}>
            {isIndoor ? '🏠 실내' : '🌳 실외'}
          </span>
        </div>
      </div>
      
      <div className="event-details">
        <h3 className="event-title">{title}</h3>
        
        <div className="event-info">
          <div className="info-row">
            <span className="info-icon">📍</span>
            <span className="info-text">{location}</span>
          </div>
          <div className="info-row">
            <span className="info-icon">📅</span>
            <span className="info-text">{date}</span>
          </div>
          <div className="info-row">
            <span className="info-icon">🕐</span>
            <span className="info-text">{time}</span>
          </div>
          {distance && (
            <div className="info-row distance">
              <span className="info-icon">📏</span>
              <span className="info-text">{distance}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;

