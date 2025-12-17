import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { findShortestPath } from '../api/festivalApi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ShortestPathPlanner from '../components/features/ShortestPathPlanner';
import KakaoMap from '../components/features/KakaoMap';
import Pagination from '../components/features/Pagination';
import EventCard from '../components/features/EventCard';
import './ShortestPathPage.css';

// ... (rest of the component is the same until the render method)

function ShortestPathPage() {
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // Adjusted for card layout
  const [totalPages, setTotalPages] = useState(0);
  const [selectedFestivals, setSelectedFestivals] = useState([]);
  const [shortestPath, setShortestPath] = useState(null);
  const [isPathLoading, setIsPathLoading] = useState(false);
  const [pathError, setPathError] = useState('');

  const fetchAllEvents = useCallback(async (nextPage = 1) => {
    setIsFetching(true);
    setFetchError('');
    try {
      const params = { page: nextPage, limit };
      const response = await axiosClient.get('/api/festivals', { params });
      const list = response?.data?.data || [];
      setEvents(list);
      setPage(nextPage);
      setTotalPages(response?.data?.totalPages || 0);
      if (list.length === 0) setFetchError('행사 정보를 가져올 수 없습니다.');
    } catch (e) {
      setFetchError('데이터를 불러오는 중 오류 발생');
    } finally {
      setIsFetching(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchAllEvents(1);
  }, [fetchAllEvents]);
  
  const handleSelectFestival = (festivalId) => {
    setSelectedFestivals(prev =>
      prev.includes(festivalId)
        ? prev.filter(id => id !== festivalId)
        : [...prev, festivalId]
    );
  };
  
  const handleFindShortestPath = async () => {
    if (selectedFestivals.length < 2) {
      alert('최소 2개 이상의 축제를 선택해주세요.');
      return;
    }
    setIsPathLoading(true);
    setPathError('');
    try {
      const data = await findShortestPath(selectedFestivals);
      setShortestPath(data);
    } catch (error) {
      setPathError('최단 경로를 계산하는 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsPathLoading(false);
    }
  };

  const handleBack = () => window.location.href = '/';

  const formatDate = (start, end) => {
    if (!start && !end) return '날짜 정보 없음';
    if (start && end) return `${start} ~ ${end}`;
    return start || end;
  };

  return (
    <div className="shortest-path-page">
      <Header />
      <main className="main-content">
        <button className="back-button" onClick={handleBack}>← 뒤로 가기</button>
        <h1 className="page-title">최단 경로 찾기</h1>
        
        <ShortestPathPlanner
          selectedCount={selectedFestivals.length}
          onFindPath={handleFindShortestPath}
          distance={shortestPath?.total_distance_km}
          isLoading={isPathLoading}
          error={pathError}
        />

        {shortestPath && (
          <KakaoMap
            path={shortestPath.optimal_path}
            className="shortest-path-map"
          />
        )}

        <section className="events-list-section">
          <h2>축제 선택</h2>
          {isFetching ? <div className="loading">불러오는 중...</div> : (
            fetchError ? <div className="error">{fetchError}</div> :
            <div className="events-grid">
              {events.map(event => {
                const isSelected = selectedFestivals.includes(event.id);
                const eventForCard = {
                  image: event.main_image || 'https://via.placeholder.com/300x200?text=No+Image',
                  category: event.category || '기타',
                  isIndoor: event.type_info === '실내',
                  title: event.event_name,
                  location: event.place || '장소 정보 없음',
                  date: formatDate(event.start_date, event.end_date),
                  time: event.datetime_info || '',
                };

                return (
                  <div
                    key={event.id}
                    className={`selectable-event-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectFestival(event.id)}
                  >
                    <EventCard event={eventForCard} />
                    <div className="selection-overlay">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="event-checkbox"
                      />
                      <span className="selection-check">✔</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onChange={(p) => fetchAllEvents(p)} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ShortestPathPage;
