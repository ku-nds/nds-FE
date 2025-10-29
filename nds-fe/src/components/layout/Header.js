import React, { useState } from 'react';
import './Header.css';

function Header({ onUserMenuClick, onNotificationClick, onSettingsClick, currentLocation }) {
  return (
    <header className="header-container">
      <div className="header-left">
        <div className="logo-section">
          <span className="logo-icon">🏛️</span>
          <div className="logo-text">
            <div className="main-title">서울 스마트시티</div>
            <div className="sub-title">문화행사 큐레이션</div>
          </div>
        </div>
        
        {currentLocation && (
          <div className="location-badge">
            <span className="location-badge-icon">📍</span>
            <span className="location-badge-text">{currentLocation}</span>
          </div>
        )}
      </div>
      
      {/* <div className="header-right">
        <button 
          className="header-icon-btn"
          onClick={onNotificationClick}
          aria-label="알림"
        >
          🔔
        </button>
        <button 
          className="header-icon-btn"
          onClick={onSettingsClick}
          aria-label="설정"
        >
          ⚙️
        </button>
        <button 
          className="header-icon-btn user-profile"
          onClick={onUserMenuClick}
          aria-label="사용자 프로필"
        >
          👤
        </button>
      </div> */}
    </header>
  );
}

export default Header;

