import React from 'react';
import './RecommendationButtons.css';

function RecommendationButtons() {
  const handleCardClick = (type) => {
    window.location.href = `/events/${type}`;
  };

  return (
    <section className="recommendation-buttons-section">
      <h2 className="section-title">행사 추천 필터</h2>
      <div className="recommendation-cards">
        <div 
          className="recommendation-card blue" 
          onClick={() => handleCardClick('place-type')}
        >
          <div className="card-icon">🏛️</div>
          <h3 className="card-title">장소 유형</h3>
          <p className="card-description">날씨에 따른 실내/실외 행사 추천</p>
        </div>
        
        <div 
          className="recommendation-card green" 
          onClick={() => handleCardClick('location')}
        >
          <div className="card-icon">📍</div>
          <h3 className="card-title">위치 기반</h3>
          <p className="card-description">3km 내 가까운 행사 추천</p>
        </div>
        
        <div 
          className="recommendation-card purple" 
          onClick={() => handleCardClick('category')}
        >
          <div className="card-icon">📚</div>
          <h3 className="card-title">행사 카테고리</h3>
          <p className="card-description">관심 분야별 맞춤 추천</p>
        </div>
      </div>
    </section>
  );
}

export default RecommendationButtons;

