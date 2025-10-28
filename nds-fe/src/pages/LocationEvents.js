import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';
import './LocationEvents.css'; 

function LocationEvents() {
    // 이전 페이지에서 전달된 데이터 수신
    const location = useLocation();
    const { state } = location;
    const { 
        guName, 
        latitude,
        longitude
    } = state || {}; 

    console.log('LocationEvents 페이지 로드 및 전달된 데이터:', state);

    const handleBack = () => { window.location.href = '/'; };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header currentLocation={guName || '위치 확인 중'} />
            <main className="flex-grow p-4 md:p-8 max-w-6xl mx-auto w-full">
                <button 
                    className="back-button" 
                    onClick={handleBack}
                >
                    ← 뒤로 가기
                </button>
                <div className="coming-soon-container">
                    <div className="icon">📍</div>
                    <h1>위치 기반 3km 이내 행사 추천</h1>
                    <p>현재 위치: {guName || '데이터 수신 오류'}</p>
                    <div className="status-box">🚧 기능 구현 준비 중입니다 🚧</div>
                    <p className="description">이 페이지에서는 사용자 위치를 중심으로 가까운 순서대로 문화 행사를 필터링하여 보여줄 예정입니다.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default LocationEvents;