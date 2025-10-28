import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';
import './PlaceEvents.css'; 

function PlaceTypeEvents() { // 컴포넌트 이름을 PlaceTypeEvents로 명확히 가정

    // 전달 받은 state 데이터 수신
    const location = useLocation();
    const { state } = location; 
    // 전달받은 데이터 추출 및 안전한 기본값 설정
    const { 
        guName, 
        weatherData,
        region,
        gu
    } = state || {}; 

    // 데이터가 유효한지 확인하는 로딩 상태
    const [isLoading, setIsLoading] = useState(!weatherData); 

    // api로 받은 행사 목록 및 로딩 상태
    const [events, setEvents] = useState([]); // 행사 목록 상태
    const [isFetching, setIsFetching] = useState(false); // 이벤트 목록 로딩 상태
    const [fetchError, setFetchError] = useState(''); // 이벤트 목록 에러 상태

    const [selectedPlaceType, setSelectedPlaceType] = useState('all');

    //api 호출 함수
    const fetchEvents = useCallback(async (type) => {
        setIsFetching(true);
        setFetchError('');
        setEvents([]);

        try {
            // 프록시 설정을 통해 http://localhost:8080/api/place-festivals로 요청됩니다.
            const apiUrl = `/api/place-festivals?type=${type}`;
            
            console.log(`[API CALL] 행사 목록 요청: ${apiUrl}`);
            
            // Axios를 사용하여 Express.js 백엔드 API 호출
            const response = await axios.get(apiUrl);

            if (response.data.count === 0) {
                setFetchError('선택한 조건에 맞는 행사가 없습니다.');
            } else {
                setEvents(response.data.data);
                setFetchError('');
            }
        } catch (error) {
            console.error('백엔드 API 호출 실패:', error);
            setFetchError('행사 목록을 불러오는 중 서버 오류가 발생했습니다.');
        } finally {
            setIsFetching(false);
        }
    }, []);

    const handlePlaceTypeClick = (type) => {
        setSelectedPlaceType(type);
        fetchEvents(type); // 즉시 새로운 타입으로 API 호출
    };

    useEffect(() => {
        if (!weatherData) {
             // 데이터가 전달되지 않았다면 콘솔에 오류 기록 후 로딩 종료
            console.error('이전 페이지에서 weatherData를 전달받지 못했습니다. 메인 페이지로 돌아가세요.');
            setIsLoading(false);
        } else {
            console.log('PlaceTypeEvents 페이지 로드 및 데이터 수신 완료');
            setIsLoading(false);
            // 대기질에 따라 초기 필터 설정 (옵션)
            if ((weatherData.pm10 || 0) >= 81) {
                setSelectedPlaceType('indoor');
            } else {
                setSelectedPlaceType('outdoor');
            }
        }

        //초기 타입 결정하여 이벤트 데이터 로딩
        let initialType;
        const pm10Value = weatherData.pm10 || 0;

        if (pm10Value >= 81) {
            initialType = 'indoor'; 
        } else {
            initialType = 'outdoor'; 
        }
        
        //초기 상태 설정
        setSelectedPlaceType(initialType);
        //초기 데이터 호출 실행
        fetchEvents(initialType);
        //초기 로딩 상태 종료
        setIsLoading(false);

    }, [weatherData, fetchEvents]);


    const getRecommendationMessage = () => {
        // weatherData가 없으면 안전하게 기본값(0) 사용
        const pm10Value = weatherData?.pm10 || 0; 
        
        if (pm10Value >= 81) {
            return { text: '※ 대기질이 좋지 않습니다. 실내 행사를 추천드립니다.', icon: '🌫️', color: 'bg-red-50' }; // Tailwind 클래스 사용 권장
        } else {
            return { text: '※ 대기질이 좋습니다! 실외 행사를 추천드립니다.', icon: '☀️', color: 'bg-green-50' }; // Tailwind 클래스 사용 권장
        }
    };

    const handleBack = () => { window.location.href = '/'; };

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center">로딩 중...</div>;
    }
    
    // weatherData가 null이거나 중요한 데이터가 없을 때 폴백 처리
    if (!weatherData || !weatherData.airQuality) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                <h1 className="text-3xl font-bold text-red-600 mb-4">데이터 수신 오류</h1>
                <p className="text-gray-600">이전 페이지에서 위치/대기질 정보를 정상적으로 전달받지 못했습니다.</p>
                <button onClick={handleBack} className="mt-6 p-2 bg-blue-500 text-white rounded">메인으로 돌아가기</button>
            </div>
        );
    }


    const recommendation = getRecommendationMessage();
    const airQualityColor = weatherData.airQualityColor; 

    return (
        <div className="recommendation-events-page">
            {/* Header에 정확한 위치 정보 전달 */}
            <Header currentLocation={guName || `${region} ${gu}` || '서울시'} />
            <main className="main-content">
                <button className="back-button" onClick={handleBack}>← 뒤로 가기</button>
                <h1 className="page-title">장소 유형별 추천</h1>

                {/* 1. 현재 대기질 정보 섹션 */}
                <section className="air-quality-section">
                    <h2 className="section-title">현재 대기질 정보</h2>
                    <div className="air-quality-card">
                        <div className="air-quality-item">
                            <span className="label">측정소</span>
                            <span className="value">{`${region} ${gu}`}</span>
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
                            <span className="value" style={{ color: airQualityColor }}>
                                {weatherData.airQuality}
                            </span>
                        </div>
                    </div>
                    {/* 추천 배너는 Tailwind CSS 클래스를 사용하여 인라인 스타일 제거 */}
                    <div className={`recommendation-banner ${recommendation.color}`}> 
                        <span className="recommendation-icon">{recommendation.icon}</span>
                        <span className="recommendation-text">{recommendation.text}</span>
                    </div>
                </section>

                {/* 2. 장소 유형 선택 섹션 (핵심 기능) */}
                <section className="place-type-section">
                    <h2 className="section-title">장소 유형 선택</h2>
                    <div className="place-type-buttons">
                        <button className={`place-type-btn ${selectedPlaceType === 'all' ? 'active' : ''}`} onClick={() => handlePlaceTypeClick('general')}>전체</button>
                        <button className={`place-type-btn ${selectedPlaceType === 'indoor' ? 'active' : ''}`} onClick={() => handlePlaceTypeClick('indoor')}>🏠 실내</button>
                        <button className={`place-type-btn ${selectedPlaceType === 'outdoor' ? 'active' : ''}`} onClick={() => handlePlaceTypeClick('outdoor')}>☀️ 실외</button>    </div>
                </section>

                {/* 3. 행사 목록 섹션 (백엔드 Axios 호출 필요) */}
                <section className="events-list-section">
                    <div className="events-list-header">
                        <h2 className="section-title">전체 행사 (0개)</h2>
                        <button className="sort-button">가까운 순으로 정렬</button>
                    </div>
                    <div className="events-list-content">
                        {/* 에러 메시지 표시 */}
                        {fetchError && <div className="no-events text-red-600 bg-red-50 border border-red-200">{fetchError}</div>}
                        
                        {/* 행사 목록 렌더링 */}
                        {!fetchError && events.length > 0 ? (
                            <div className="events-grid">
                                {events.map(event => <EventCard key={event.id} event={event} />)}
                            </div>
                        ) : (
                            !fetchError && <div className="no-events">선택한 조건에 맞는 행사가 없습니다.</div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

const EventCard = ({ event }) => (
    <div className="event-card p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition duration-150">
        <h3 className="font-semibold text-blue-600 text-lg mb-1">{event.event_name}</h3>
        <p className="text-sm text-gray-500 mb-2">{event.place} ({event.district})</p>
        <div className="text-xs text-gray-700">
            <p>유형: {event.category}</p>
            <p>기간: {new Date(event.start_date).toLocaleDateString()} ~ {new Date(event.end_date).toLocaleDateString()}</p>
        </div>
    </div>
);

export default PlaceTypeEvents;