import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';
import './CategoryEvents.css'; 

function CategoryEvents() {
    // 이전 페이지에서 전달된 데이터 수신
    const location = useLocation();
    const { state } = location;
    const { guName } = state || {}; // 주소 정보를 가져옴

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
                    <div className="icon">📚</div>
                    <h1>행사 카테고리별 추천</h1>
                    <div className="status-box">🚧 기능 구현 준비 중입니다 🚧</div>
                    <p className="description">이 페이지에서는 사용자의 선호 카테고리(공연, 전시, 축제 등)에 맞춰 행사 목록을 필터링하여 보여줄 예정입니다.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CategoryEvents;