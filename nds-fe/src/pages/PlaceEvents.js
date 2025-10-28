import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';
import EventDetailModal from '../components/features/EventDetailModal';
import './PlaceEvents.css';


const MOCK_FESTIVALS = [
    {
    "id": 101,
    "event_name": "현대미술 특별전: 디지털 아트의 미래",
    "category": "전시",
    "district": "종로구",
    "place": "국립현대미술관 서울관",
    "organizer": "국립현대미술관",
    "start_date": "2025-04-20T00:00:00.000Z",
    "end_date": "2025-07-15T00:00:00.000Z",
    "datetime_info": "매일 10:00~18:00 (월요일 휴관)",
    "homepage": "http://www.moca.go.kr",
    "main_image": "https://i.ibb.co/3q4V1gQ/exhibit-indoor.jpg", // 실내 이미지 (임시)
    "is_free": "N",
    "distance": 1.8, // 임시 거리 (프론트엔드 표시용)
    // 💡 아래 필드는 상세조회 시 필요하지만, 카드 표시를 위해 임시로 추가
    "type_info": "실내" 
    },
    {
    "id": 102,
    "event_name": "북촌 한옥마을 문화체험",
    "category": "지역축제",
    "district": "종로구",
    "place": "북촌한옥마을",
    "organizer": "서울시 북촌센터",
    "start_date": "2025-05-01T00:00:00.000Z",
    "end_date": "2025-05-31T00:00:00.000Z",
    "datetime_info": "주말 11:00~16:00",
    "homepage": "http://bukchon.seoul.go.kr",
    "main_image": "https://i.ibb.co/N7B9zYw/hanok-outdoor.jpg", // 실외 이미지 (임시)
    "is_free": "Y",
    "distance": 2.1,
    "type_info": "실외" 
    },
    {
    "id": 103,
    "event_name": "서울 재즈 페스티벌 2024",
    "category": "음악",
    "district": "송파구",
    "place": "올림픽공원",
    "organizer": "프라이빗 주식회사",
    "start_date": "2025-05-15T00:00:00.000Z",
    "end_date": "2025-05-17T00:00:00.000Z",
    "datetime_info": "18:00 시작",
    "homepage": null,
    "main_image": "https://i.ibb.co/L8G7R2w/jazz-outdoor.jpg", // 실외 이미지 (임시)
    "is_free": "N",
    "distance": 2.3,
    "type_info": "실외" 
    },
    {
    "id": 104,
    "event_name": "한강 벚꽃 축제",
    "category": "지역축제",
    "district": "영등포구",
    "place": "여의도 한강공원",
    "organizer": "영등포구청",
    "start_date": "2025-04-05T00:00:00.000Z",
    "end_date": "2025-04-14T00:00:00.000Z",
    "datetime_info": "종일 운영",
    "homepage": null,
    "main_image": "https://i.ibb.co/T5w9Y2V/cherry-blossom-outdoor.jpg", // 실외 이미지 (임시)
    "is_free": "Y",
    "distance": 3.1,
    "type_info": "실외" 
    }
]

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

    // 모달 상태 추가
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // 모달 열기 함수 (EventCard에서 호출됨)
    const openModal = (event) => {
        // 백엔드에서 상세 정보를 다시 불러와야 하지만, Mocking 단계에서는 전달받은 event를 그대로 사용
        setSelectedEvent(event); 
        setIsModalOpen(true);
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    //api 호출 함수
    //TODO 받아오는 값에 따라서 변경되어야함..
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

            // API 호출 실패 시 Mock 데이터 사용 (Catch Block)
            console.error('❌ 백엔드 API 호출 실패! Mock 데이터를 사용합니다.', error);
            
            // Mock 데이터에서 필터링
            const filteredData = MOCK_FESTIVALS.filter(event => {
                if (type === 'general' || type === 'all') return true;
                if (type === 'indoor') {
                    return event.type_info === '실내';
                }
                if (type === 'outdoor') {
                    return event.type_info === '실외';
                }
                return true;
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setFetchError(`[경고] 서버 연결 실패로 ${filteredData.length}개의 임시 Mock데이터 표시`);
            setEvents(filteredData);
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
                        <h2 className="section-title">전체 행사</h2>
                        <button className="sort-button">가까운 순으로 정렬</button>
                    </div>
                    <div className="events-list-content">
                        {/* 에러/경고 배너는 항상 보여줌 */}
                        {fetchError && (
                            <div className="no-events text-red-600 bg-red-50 border border-red-200 p-3 mb-4">
                                {fetchError}
                            </div>
                        )}

                        {/* 이벤트 목록은 fetchError 여부와 상관없이 events.length로 결정 */}
                        {events.length > 0 ? (
                        <div className="events-grid">
                           {/* EventCard에 openModal 함수 전달 */}
                            {events.map(event => <EventCard key={event.id} event={event} onCardClick={openModal} />)}
                        </div>
                        ) : (
                        <div className="no-events">선택한 조건에 맞는 행사가 없습니다.</div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
            {/* 이벤트 상세 모달 */}
            <EventDetailModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                event={selectedEvent} 
            />
        </div>
    );
}

const EventCard = ({ event, onCardClick }) => {
    // 날짜 포맷팅 (예: 4월 20일 - 7월 15일)
    const formatDate = (dateString) => {
        if (!dateString) return '미정';
        // ISO 문자열을 Date 객체로 변환
        const date = new Date(dateString);
        // 'M월 D일' 형식으로 포맷팅
        return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    };
    
    const startDate = formatDate(event.start_date);
    const endDate = formatDate(event.end_date);

    return (
        <div 
            className="event-card border rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200 cursor-pointer overflow-hidden"
            onClick={() => onCardClick(event)}
        >
            {/* 1. 이미지 및 태그 영역 (사진 상단) */}
            <div className="relative h-40">
                <img 
                    src={event.main_image || "https://via.placeholder.com/600x400.png?text=No+Image"} 
                    alt={event.event_name} 
                    className="w-full h-full object-cover"
                />
                
                {/* 거리 태그 (왼쪽 상단) */}
                {event.distance && (
                    <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-semibold px-2 py-0.5 rounded">
                        {event.distance}km
                    </span>
                )}
                
                {/* 실내/실외 태그 (오른쪽 상단) */}
                <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded ${
                    event.type_info === '실내' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                }`}>
                    {event.type_info || '일반'}
                </span>
            </div>

            {/* 2. 상세 정보 영역 (p-4) */}
            <div className="p-4">
                <p className="text-xs font-medium text-gray-500 mb-1">{event.category || '기타'}</p>
                <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                    {event.event_name}
                </h3>
                
                {/* 날짜 정보 */}
                <div className="text-sm text-gray-600 mb-3">
                    {startDate} ~ {endDate}
                </div>
                
                {/* 장소 및 기타 정보 */}
                <div className="text-xs text-gray-700 space-y-1 border-t pt-2">
                    <p>📍 {event.place} ({event.district})</p>
                    <p className="text-blue-600">주최: {event.organizer || '미상'}</p>
                </div>
            </div>
        </div>
    );
};

export default PlaceTypeEvents;