import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';
import EventDetailModal from '../components/features/EventDetailModal';
import Pagination from '../components/features/Pagination';
import { getCurrentLocation, DEFAULT_LOCATION, DEFAULT_LOCATION_NAME } from '../utils/geolocation';
import './LocationEvents.css'; 

function LocationEvents() {
    // 이전 페이지에서 전달된 데이터 수신
    const location = useLocation();
    const { state } = location;
    const { 
        guName: initialGuName, 
        latitude: initialLat,
        longitude: initialLng
    } = state || {}; 

    const [guName, setGuName] = useState(initialGuName || DEFAULT_LOCATION_NAME);
    const [position, setPosition] = useState(() => ({
        latitude: typeof initialLat === 'number' ? initialLat : DEFAULT_LOCATION.latitude,
        longitude: typeof initialLng === 'number' ? initialLng : DEFAULT_LOCATION.longitude,
    }));

    const [events, setEvents] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(0);

    const handleBack = () => { window.location.href = '/'; };

    const openModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const coordsReady = useMemo(() => typeof position.latitude === 'number' && typeof position.longitude === 'number', [position]);

    // 현재 위치 확보 (state에 없으면 브라우저에서 획득)
    useEffect(() => {
        if (coordsReady) return;
        (async () => {
            try {
                const current = await getCurrentLocation();
                setPosition({ latitude: current.latitude, longitude: current.longitude });
                setGuName(initialGuName || DEFAULT_LOCATION_NAME);
            } catch (err) {
                console.error('현재 위치를 가져오지 못했습니다.', err);
                // 권한이 없거나 실패해도 기본 위치(건국대)로 동작
                setPosition({ latitude: DEFAULT_LOCATION.latitude, longitude: DEFAULT_LOCATION.longitude });
                setGuName(DEFAULT_LOCATION_NAME);
            }
        })();
    }, [coordsReady]);

    // 인근 행사 조회
    const fetchNearbyEvents = useCallback(async (lat, lng, nextPage = 1) => {
        setIsFetching(true);
        setFetchError('');
        setEvents([]);
        try {
            const apiUrl = `/api/festivals/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&page=${encodeURIComponent(nextPage)}&limit=${encodeURIComponent(limit)}`;
            const response = await axios.get(apiUrl);
            if (!response?.data) {
                setFetchError('서버 응답이 올바르지 않습니다.');
                setEvents([]);
                return;
            }
            const list = Array.isArray(response.data.data) ? response.data.data : [];
            setTotalPages(response.data.totalPages || 0);
            setPage(response.data.page || nextPage);
            if (list.length === 0) {
                setFetchError('주변 3km 이내에 추천할 행사가 없습니다.');
                setEvents([]);
            } else {
                setEvents(list);
            }
        } catch (error) {
            console.error('인근 행사 조회 실패:', error);
            const msg = error?.response?.data?.error || error.message || '인근 행사 조회 중 오류가 발생했습니다.';
            setFetchError(msg);
            setEvents([]);
        } finally {
            setIsFetching(false);
        }
    }, [limit]);

    // 좌표 준비되면 이벤트 조회
    useEffect(() => {
        if (!coordsReady) return;
        fetchNearbyEvents(position.latitude, position.longitude, 1);
    }, [coordsReady, position, fetchNearbyEvents]);

    return (
        <div className="recommendation-events-page">
            <Header currentLocation={guName} />
            <main className="main-content">
                <button className="back-button" onClick={handleBack}>← 뒤로 가기</button>
                <h1 className="page-title">내 주변 3km 이내 행사</h1>

                <section className="events-list-section">
                    <div className="events-list-header">
                        <h2 className="section-title">추천 행사 목록</h2>
                    </div>

                    {isFetching && (
                        <div className="no-events">불러오는 중...</div>
                    )}

                    {!isFetching && fetchError && (
                        <div className="no-events text-red-600 bg-red-50 border border-red-200 p-3 mb-4">
                            {fetchError}
                        </div>
                    )}

                    {!isFetching && !fetchError && (
                        <div className="events-list-content">
                            {events.length > 0 ? (
                                <div className="events-grid">
                                    {events.map(event => (
                                        <NearbyEventCard key={event.id} event={event} onCardClick={openModal} />
                                    ))}
                                </div>
                            ) : (
                                <div className="no-events">표시할 행사가 없습니다.</div>
                            )}
                        </div>
                    )}
                    <Pagination page={page} totalPages={totalPages} onChange={(p) => fetchNearbyEvents(position.latitude, position.longitude, p)} />
                </section>
            </main>
            <Footer />

            <EventDetailModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                event={selectedEvent} 
            />
        </div>
    );
}

// PlaceEvents와 동일한 카드 룩앤필 유지
const NearbyEventCard = ({ event, onCardClick }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '미정';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    };

    const startDate = formatDate(event.start_date);
    const endDate = formatDate(event.end_date);

    return (
        <div 
            className="event-card border rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200 cursor-pointer overflow-hidden"
            onClick={() => onCardClick(event)}
        >
            <div className="relative h-40">
                <img 
                    src={event.main_image || "https://via.placeholder.com/600x400.png?text=No+Image"} 
                    alt={event.event_name} 
                    className="w-full h-full object-cover"
                />
                {event.distance && (
                    <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-semibold px-2 py-0.5 rounded">
                        {event.distance}km
                    </span>
                )}
                <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded ${
                    event.type_info === '실내' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                }`}>
                    {event.type_info || '일반'}
                </span>
            </div>

            <div className="p-4">
                <p className="text-xs font-medium text-gray-500 mb-1">{event.category || '기타'}</p>
                <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                    {event.event_name}
                </h3>
                <div className="text-sm text-gray-600 mb-3">
                    {startDate} ~ {endDate}
                </div>
                <div className="text-xs text-gray-700 space-y-1 border-t pt-2">
                    <p>📍 {event.place} ({event.district})</p>
                    <p className="text-blue-600">주최: {event.organizer || '미상'}</p>
                </div>
            </div>
        </div>
    );
};

export default LocationEvents;