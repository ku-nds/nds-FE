import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';
import EventDetailModal from '../components/features/EventDetailModal';
import Pagination from '../components/features/Pagination';
import './CategoryEvents.css'; 

function CategoryEvents() {
    // 이전 페이지에서 전달된 데이터 수신
    const location = useLocation();
    const { state } = location;
    const { guName } = state || {};

    // 필터 상태
    const [category, setCategory] = useState('');

    // 데이터 상태
    const [events, setEvents] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(0);

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleBack = () => { window.location.href = '/'; };

    const openModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const categories = useMemo(() => (
        [
            '전체',
            '국악',
            '무용',
            '연극',
            '영화',
            '콘서트',
            '클래식',
            '뮤지컬/오페라',
            '축제-기타',
            '축제-시민화합',
            '축제-문화/예술',
            '축제-자연/경관',
            '축제-전통/역사',
            '교육/체험',
            '전시/미술',
            '독주/독창회',
            '기타'
        ]
    ), []);

    // 카테고리별 조회
    const fetchByCategory = useCallback(async (selected, nextPage = 1) => {
        setIsFetching(true);
        setFetchError('');
        setEvents([]);
        try {
            const endpoint = '/api/festivals/category';
            const qsCategory = selected && selected !== '전체' ? `category=${encodeURIComponent(selected)}` : '';
            const qsPage = `page=${encodeURIComponent(nextPage)}`;
            const qsLimit = `limit=${encodeURIComponent(limit)}`;
            const apiUrl = qsCategory
                ? `${endpoint}?${qsCategory}&${qsPage}&${qsLimit}`
                : `${endpoint}?${qsPage}&${qsLimit}`;

            const response = await axios.get(apiUrl);
            if (!response?.data) {
                setFetchError('서버 응답이 올바르지 않습니다.');
                return;
            }
            const list = Array.isArray(response.data.data) ? response.data.data : [];
            setTotalPages(response.data.totalPages || 0);
            setPage(response.data.page || nextPage);
            if (list.length === 0) {
                setFetchError('선택한 카테고리에 해당하는 행사가 없습니다.');
                setEvents([]);
            } else {
                setEvents(list);
            }
        } catch (error) {
            console.error('카테고리 행사 조회 실패:', error);
            const msg = error?.response?.data?.error || error.message || '행사 조회 중 오류가 발생했습니다.';
            setFetchError(msg);
            setEvents([]);
        } finally {
            setIsFetching(false);
        }
    }, [limit]);

    // 초기 진입 시 전체 보기
    useEffect(() => {
        fetchByCategory('', 1);
    }, [fetchByCategory]);

    const onChangeCategory = (e) => {
        const value = e.target.value;
        setCategory(value);
    };

    const onApplyFilter = () => {
        fetchByCategory(category, 1);
    };

    const onClearFilter = () => {
        setCategory('');
        fetchByCategory('', 1);
    };

    return (
        <div className="recommendation-events-page">
            <Header currentLocation={guName || '서울시'} />
            <main className="main-content">
                <button className="back-button" onClick={handleBack}>← 뒤로 가기</button>
                <h1 className="page-title">카테고리별 추천</h1>

                {/* 1. 필터 바 (칩 버튼 + 보조 셀렉트) */}
                <section className="place-type-section">
                    <h2 className="section-title">카테고리 선택</h2>
                    <div className="place-type-buttons" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                        {/* 칩 버튼들 */}
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                            {categories.map((c) => {
                                const value = c === '전체' ? '' : c;
                                const isActive = category === value;
                                return (
                                    <button 
                                        key={c}
                                        className={`place-type-btn ${isActive ? 'active' : ''}`}
                                        onClick={() => { setCategory(value); fetchByCategory(value); }}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {c}
                                    </button>
                                );
                            })}
                        </div>

                        {/* 보조 셀렉트 및 액션 */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <select 
                                value={category} 
                                onChange={onChangeCategory}
                                className="place-type-btn"
                                style={{ minWidth: 200 }}
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c === '전체' ? '' : c}>{c}</option>
                                ))}
                            </select>
                            <button 
                                className="place-type-btn" 
                                onClick={onApplyFilter}
                                style={{ whiteSpace: 'nowrap', padding: '0.5rem 1rem', minWidth: 80 }}
                            >
                                적용
                            </button>
                            <button 
                                className="place-type-btn" 
                                onClick={onClearFilter}
                                style={{ whiteSpace: 'nowrap', padding: '0.5rem 1rem', minWidth: 80 }}
                            >
                                초기화
                            </button>
                        </div>
                    </div>
                    <Pagination page={page} totalPages={totalPages} onChange={(p) => fetchByCategory(category, p)} />
                </section>

                {/* 2. 결과 리스트 */}
                <section className="events-list-section">
                    <div className="events-list-header">
                        <h2 className="section-title">결과 목록</h2>
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
                                        <CategoryEventCard key={event.id} event={event} onCardClick={openModal} />)
                                    )}
                                </div>
                            ) : (
                                <div className="no-events">표시할 행사가 없습니다.</div>
                            )}
                        </div>
                    )}
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

// 카드 UI: Place/Location과 동일 룩앤필 유지
const CategoryEventCard = ({ event, onCardClick }) => {
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
                {/* 무료 여부 뱃지 */}
                {typeof event.is_free !== 'undefined' && (
                    <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-semibold px-2 py-0.5 rounded">
                        {event.is_free ? '무료' : '유료'}
                    </span>
                )}
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

export default CategoryEvents;