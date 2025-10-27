import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './RecommendationEvents.css';

function RecommendationEvents() {
  // URL에서 type 파라미터 추출
  const path = window.location.pathname;
  const type = path.split('/')[2];

  const getTitle = () => {
    switch (type) {
      case 'place-type':
        return '장소 유형별 행사';
      case 'location':
        return '위치 기반 행사';
      case 'category':
        return '행사 카테고리별 추천';
      default:
        return '추천 행사';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'place-type':
        return '날씨에 따른 실내/실외 행사를 추천합니다.';
      case 'location':
        return '현재 위치 기준 3km 이내의 가까운 행사를 찾아드립니다.';
      case 'category':
        return '관심 있는 분야별 맞춤 행사를 추천합니다.';
      default:
        return '추천 행사를 확인하세요.';
    }
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="recommendation-events-page">
      <Header />
      
      <main className="main-content">
        <div className="events-header">
          <button 
            className="back-button"
            onClick={handleBack}
          >
            ← 뒤로 가기
          </button>
          <h1 className="events-main-title">{getTitle()}</h1>
          <p className="events-description">{getDescription()}</p>
        </div>

        <div className="events-content">
          <div className="coming-soon">
            <div className="coming-soon-icon">🚧</div>
            <h2>준비 중입니다</h2>
            <p>곧 만나실 수 있습니다.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RecommendationEvents;

