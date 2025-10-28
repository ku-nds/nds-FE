import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';
import './RecommendationEvents.css';

function RecommendationEvents() {

  //전달 받은 state 데이터 수신
  const location = useLocation();
    const { state } = location; 
    const { 
        latitude, 
        longitude, 
        guName, 
        weatherData,
        region,
        gu
    } = state || {}; // state가 없을 경우를 대비해 기본값 설정

  const path = window.location.pathname;
  const type = path.split('/')[2];

  const [selectedPlaceType, setSelectedPlaceType] = useState('all');

  useEffect(() => {
        if (weatherData) {
            console.log('이전 페이지에서 전달받은 대기질 데이터:', weatherData);
            console.log('권역과 시: ', region, gu);
        }
    }, [gu, guName, region, weatherData]);


  const getRecommendationMessage = () => {
    if (weatherData.pm10 >= 81) {
      return { text: '※ 대기질이 좋지 않습니다. 실내 행사를 추천드립니다.', icon: '🌫️', color: '#FFF3F3' };
    } else {
      return { text: '※ 대기질이 좋습니다! 실외 행사를 추천드립니다.', icon: '☀️', color: '#F0FDF4' };
    }
  };

  const handleBack = () => { window.location.href = '/'; };

  if (type !== 'place-type') {
    return (
      <div className="recommendation-events-page">
        <Header />
        <main className="main-content">
          <button className="back-button" onClick={handleBack}>← 뒤로 가기</button>
          <h1 className="events-main-title">
            {type === 'location' ? '위치 기반 행사' : '행사 카테고리별 추천'}
          </h1>
          <div className="coming-soon">
            <div className="coming-soon-icon">🚧</div>
            <h2>준비 중입니다</h2>
            <p>곧 만나실 수 있습니다.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const recommendation = getRecommendationMessage();

  return (
    <div className="recommendation-events-page">
      <Header />
      <main className="main-content">
        <button className="back-button" onClick={handleBack}>← 뒤로 가기</button>
        <h1 className="page-title">장소 유형별 추천</h1>

        <section className="air-quality-section">
          <h2 className="section-title">현재 대기질 정보</h2>
          <div className="air-quality-card">
            <div className="air-quality-item">
              <span className="label">측정소</span>
              <span className="value">{region + " " + gu}</span>
            </div>
            <div className="air-quality-item">
              <span className="label">미세먼지</span>
              <span className="value">{weatherData.pm10}µg/m²</span>
            </div>
            <div className="air-quality-item">
              <span className="label">초미세먼지</span>
              <span className="value">{weatherData.pm2_5}µg/m²</span>
            </div>
            <div className="air-quality-item">
              <span className="label">대기질</span>
              <span className="value" style={{ color: weatherData.airQualityColor }}>
                {weatherData.airQuality}
              </span>
            </div>
          </div>
          <div className="recommendation-banner" style={{ backgroundColor: recommendation.color }}>
            <span className="recommendation-icon">{recommendation.icon}</span>
            <span className="recommendation-text">{recommendation.text}</span>
          </div>
        </section>

        <section className="place-type-section">
          <h2 className="section-title">장소 유형 선택</h2>
          <div className="place-type-buttons">
            <button className={`place-type-btn ${selectedPlaceType === 'all' ? 'active' : ''}`} onClick={() => setSelectedPlaceType('all')}>전체</button>
            <button className={`place-type-btn ${selectedPlaceType === 'indoor' ? 'active' : ''}`} onClick={() => setSelectedPlaceType('indoor')}>🏠 실내</button>
            <button className={`place-type-btn ${selectedPlaceType === 'outdoor' ? 'active' : ''}`} onClick={() => setSelectedPlaceType('outdoor')}>☀️ 실외</button>
          </div>
        </section>

        <section className="events-list-section">
          <div className="events-list-header">
            <h2 className="section-title">전체 행사 (0개)</h2>
            <button className="sort-button">가까운 순으로 정렬</button>
          </div>
          <div className="events-list-content">
            <div className="no-events">행사 데이터 준비 중입니다.</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default RecommendationEvents;

