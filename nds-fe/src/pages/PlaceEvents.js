import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';
import EventDetailModal from '../components/features/EventDetailModal';
import Pagination from '../components/features/Pagination';
import { useAppContext } from '../context/AppContext'; // ✅ 추가
import './PlaceEvents.css';

function PlaceTypeEvents() {
  const location = useLocation();
  const { state } = location;

  // ✅ Context 불러오기
  const { weatherData: globalWeather, position: globalPosition } = useAppContext();

  // ✅ state로부터 받거나, 없으면 Context로부터 복원
  const weatherData = state?.weatherData || globalWeather;
  const region = state?.region || globalPosition?.region;
  const gu = state?.gu || globalPosition?.gu;
  const guName = state?.guName || globalPosition?.guName;

  // 상태
  const [isLoading, setIsLoading] = useState(!weatherData);
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPlaceType, setSelectedPlaceType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ✅ API 호출 함수
  const fetchEvents = useCallback(async (type = 'all', nextPage = 1) => {
    setIsFetching(true);
    setFetchError('');
    setEvents([]);
    try {
      let endpoint = '/api/festivals';
      let params = { page: nextPage, limit };

      if (type === 'indoor' || type === 'outdoor') {
        endpoint = '/api/festivals/type';
        params = { type, page: nextPage, limit };
      }

      const response = await axiosClient.get(endpoint, { params });
      if (!response?.data) throw new Error('서버 응답이 올바르지 않습니다.');

      const list = Array.isArray(response.data.data) ? response.data.data : [];
      setTotalPages(response.data.totalPages || 0);
      setPage(response.data.page || nextPage);

      if (list.length === 0) setFetchError('선택한 조건에 맞는 행사가 없습니다.');
      setEvents(list);
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || '행사 조회 오류';
      setFetchError(msg);
    } finally {
      setIsFetching(false);
    }
  }, [limit]);

  // ✅ 초기 로딩 시 Context 기반으로 판단
  useEffect(() => {
    if (!weatherData) {
      console.error('⚠️ weatherData가 존재하지 않습니다. 메인 페이지로 이동 필요.');
      setIsLoading(false);
      return;
    }

    const pm10Value = weatherData.pm10 || 0;
    const initialType = pm10Value >= 81 ? 'indoor' : 'outdoor';
    setSelectedPlaceType(initialType);
    fetchEvents(initialType, 1);
    setIsLoading(false);
  }, [weatherData, fetchEvents]);

  const handleBack = () => { window.location.href = '/'; };
  const openModal = (event) => { setSelectedEvent(event); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedEvent(null); };
  const handlePlaceTypeClick = (type) => { setSelectedPlaceType(type); fetchEvents(type); };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center">로딩 중...</div>;

  const getRecommendationMessage = () => {
    const pm10Value = weatherData?.pm10 || 0;
    return pm10Value >= 81
      ? { text: '🌫️ 대기질이 좋지 않습니다. 실내 행사 추천', color: 'bg-red-50' }
      : { text: '☀️ 대기질이 좋습니다! 실외 행사 추천', color: 'bg-green-50' };
  };

  const recommendation = getRecommendationMessage();

  return (
    <div className="recommendation-events-page">
      <Header currentLocation={guName || `${region} ${gu}` || '서울시'} />
      <main className="main-content">
        <button className="back-button" onClick={handleBack}>← 뒤로 가기</button>
        <h1 className="page-title">장소 유형별 추천</h1>

        {/* 대기질 */}
        <section className="air-quality-section">
          <h2 className="section-title">현재 대기질 정보</h2>
          <div className="air-quality-card">
            <div className="air-quality-item"><span className="label">측정소</span><span className="value">{`${region} ${gu}`}</span></div>
            <div className="air-quality-item"><span className="label">미세먼지</span><span className="value">{weatherData.pm10}µg/m²</span></div>
            <div className="air-quality-item"><span className="label">초미세먼지</span><span className="value">{weatherData.pm2_5}µg/m²</span></div>
            <div className="air-quality-item"><span className="label">대기질</span><span className="value" style={{ color: weatherData.airQualityColor }}>{weatherData.airQuality}</span></div>
          </div>
          <div className={`recommendation-banner ${recommendation.color}`}>
            <span>{recommendation.text}</span>
          </div>
        </section>

        {/* 장소 유형 선택 */}
        <section className="place-type-section">
          <h2 className="section-title">장소 유형 선택</h2>
          <div className="place-type-buttons">
            <button className={`place-type-btn ${selectedPlaceType === 'all' ? 'active' : ''}`} onClick={() => handlePlaceTypeClick('general')}>전체</button>
            <button className={`place-type-btn ${selectedPlaceType === 'indoor' ? 'active' : ''}`} onClick={() => handlePlaceTypeClick('indoor')}>🏠 실내</button>
            <button className={`place-type-btn ${selectedPlaceType === 'outdoor' ? 'active' : ''}`} onClick={() => handlePlaceTypeClick('outdoor')}>☀️ 실외</button>
          </div>
        </section>

        {/* 행사 목록 */}
        <section className="events-list-section">
          <div className="events-list-header">
            <h2 className="section-title">전체 행사</h2>
          </div>
          {fetchError ? (
            <div className="no-events text-red-600 bg-red-50 border border-red-200 p-3 mb-4">{fetchError}</div>
          ) : (
            <div className="events-grid">
              {events.length > 0 ? events.map(event => (
                <EventCard key={event.id} event={event} onCardClick={openModal} />
              )) : <div className="no-events">표시할 행사가 없습니다.</div>}
            </div>
          )}
        <Pagination 
            page={page} 
            totalPages={totalPages} 
            onChange={(p) => fetchEvents(selectedPlaceType, p)} 
        />
        </section>
      </main>
      <Footer />
      <EventDetailModal isOpen={isModalOpen} onClose={closeModal} event={selectedEvent} />
    </div>
  );
}

const EventCard = ({ event, onCardClick }) => {
  const formatDate = (dateString) => !dateString ? '미정' : new Date(dateString).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  return (
    <div className="event-card border rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200 cursor-pointer overflow-hidden" onClick={() => onCardClick(event)}>
      <div className="relative h-40">
        <img src={event.main_image || "https://via.placeholder.com/600x400.png?text=No+Image"} alt={event.event_name} className="w-full h-full object-cover" />
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded ${event.type_info === '실내' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
          {event.type_info || '일반'}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-gray-500 mb-1">{event.category || '기타'}</p>
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">{event.event_name}</h3>
        <div className="text-sm text-gray-600 mb-3">{formatDate(event.start_date)} ~ {formatDate(event.end_date)}</div>
        <div className="text-xs text-gray-700 space-y-1 border-t pt-2">
          <p>📍 {event.place} ({event.district})</p>
          <p className="text-blue-600">주최: {event.organizer || '미상'}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceTypeEvents;
