import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import EventDetailModal from '../components/features/EventDetailModal';
import Pagination from '../components/features/Pagination';
import { useAppContext } from '../context/AppContext'; // ✅ 추가
import './CategoryEvents.css';

function CategoryEvents() {
  const { position: globalPosition } = useAppContext();
  const guName = globalPosition?.guName || '서울특별시';

  const [category, setCategory] = useState('');
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const categories = useMemo(() => [
    '전체', '국악', '무용', '연극', '영화', '콘서트', '클래식', '뮤지컬/오페라',
    '축제-문화/예술', '축제-기타', '전시/미술', '교육/체험', '기타'
  ], []);

  const fetchByCategory = useCallback(async (selected = '', nextPage = 1) => {
    setIsFetching(true);
    setFetchError('');
    try {
      const params = { page: nextPage, limit, ...(selected && selected !== '전체' ? { category: selected } : {}) };
      const response = await axiosClient.get('/api/festivals/category', { params });
      const list = response?.data?.data || [];
      setEvents(list);
      setTotalPages(response?.data?.totalPages || 0);
      setPage(nextPage);
      if (list.length === 0) setFetchError('선택한 카테고리에 해당하는 행사가 없습니다.');
    } catch {
      setFetchError('데이터를 불러오는 중 오류 발생');
    } finally {
      setIsFetching(false);
    }
  }, [limit]);

  useEffect(() => { fetchByCategory('', 1); }, [fetchByCategory]);
  const handleBack = () => window.location.href = '/';
  const openModal = (event) => { setSelectedEvent(event); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedEvent(null); };

  return (
    <div className="recommendation-events-page">
      <Header currentLocation={guName} />
      <main className="main-content">
        <button className="back-button" onClick={handleBack}>← 뒤로 가기</button>
        <h1 className="page-title">카테고리별 추천</h1>

        {/* 카테고리 필터 */}
        <section className="place-type-section">
          <h2 className="section-title">카테고리 선택</h2>
          <div className="place-type-buttons flex-wrap">
            {categories.map(c => (
              <button key={c} className={`place-type-btn ${category === c ? 'active' : ''}`} onClick={() => { setCategory(c); fetchByCategory(c); }}>
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* 결과 목록 */}
        <section className="events-list-section">
          {isFetching ? <div className="no-events">불러오는 중...</div> : (
            fetchError ? <div className="no-events">{fetchError}</div> :
            <div className="events-grid">
              {events.length > 0 ? events.map(event => (
                <CategoryEventCard key={event.id} event={event} onCardClick={openModal} />
              )) : <div className="no-events">표시할 행사가 없습니다.</div>}
            </div>
          )}

        <Pagination 
            page={page} 
            totalPages={totalPages} 
            onChange={(p) => fetchByCategory(category, p)} 
        />
        </section>
      </main>
      <Footer />
      <EventDetailModal isOpen={isModalOpen} onClose={closeModal} event={selectedEvent} />
    </div>
  );
}

const CategoryEventCard = ({ event, onCardClick }) => (
  <div className="event-card border rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200 cursor-pointer overflow-hidden" onClick={() => onCardClick(event)}>
    <div className="relative h-40">
      <img src={event.main_image || "https://via.placeholder.com/600x400.png?text=No+Image"} alt={event.event_name} className="w-full h-full object-cover" />
    </div>
    <div className="p-4">
      <p className="text-xs font-medium text-gray-500 mb-1">{event.category}</p>
      <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">{event.event_name}</h3>
      <p className="text-sm text-gray-600">{event.place}</p>
    </div>
  </div>
);

export default CategoryEvents;
