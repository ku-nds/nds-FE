import React, { useCallback, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';
import EventDetailModal from '../components/features/EventDetailModal';
import Pagination from '../components/features/Pagination';
import { useAppContext } from '../context/AppContext';
import NearbyEventCard from '../components/features/NearbyEventCard';
import './LocationEvents.css'; 

function LocationEvents() {
  const location = useLocation();
  const { state } = location;
  const { position: globalPosition } = useAppContext();

  const latitude = state?.latitude || globalPosition?.latitude;
  const longitude = state?.longitude || globalPosition?.longitude;
  const guName = state?.guName || globalPosition?.guName || '서울특별시 광진구';

  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const fetchNearbyEvents = useCallback(async (lat, lng, nextPage = 1) => {
    setIsFetching(true);
    try {
      const params = { lat, lng, page: nextPage, limit };
      const response = await axiosClient.get('/api/festivals/nearby', { params });
      const list = response?.data?.data || [];
      setEvents(list);
      setPage(nextPage);
      setTotalPages(response?.data?.totalPages || 0);
      if (list.length === 0) setFetchError('주변 3km 이내에 추천할 행사가 없습니다.');
    } catch (e) {
      setFetchError('데이터를 불러오는 중 오류 발생');
    } finally {
      setIsFetching(false);
    }
  }, [limit]);

  useEffect(() => {
    if (latitude && longitude) fetchNearbyEvents(latitude, longitude, 1);
  }, [latitude, longitude, fetchNearbyEvents]);

  const handleBack = () => window.location.href = '/';
  const openModal = (event) => { setSelectedEvent(event); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedEvent(null); };

  return (
    <div className="recommendation-events-page">
      <Header currentLocation={guName} />
      <main className="main-content">
        <button className="back-button" onClick={handleBack}>← 뒤로 가기</button>
        <h1 className="page-title">내 주변 3km 이내 행사</h1>
        
        <section className="events-list-section">
          {isFetching ? <div className="no-events">불러오는 중...</div> : (
            fetchError ? <div className="no-events">{fetchError}</div> :
            <div className="events-grid">
              {events.length > 0 ? events.map(e => 
                <NearbyEventCard 
                  key={e.id} 
                  event={e} 
                  onCardClick={openModal} 
                />) :
              <div className="no-events">표시할 행사가 없습니다.</div>}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onChange={(p) => fetchNearbyEvents(latitude, longitude, p)} />
        </section>
      </main>
      <Footer />
      <EventDetailModal isOpen={isModalOpen} onClose={closeModal} event={selectedEvent} />
    </div>
  );
}

export default LocationEvents;
