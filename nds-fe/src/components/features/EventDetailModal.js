import React, { useEffect, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import './EventDetailModal.css';
import KakaoMap from './KakaoMap';
import axiosClient from '../../api/axiosClient';

const EventDetailModal = ({ isOpen, onClose, event }) => {
  // ESC 키로 닫기
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // 편의시설 상태 — keep hooks at top-level so they're called on every render
  const [amenities, setAmenities] = useState(null);
  const [radius, setRadius] = useState(1000);
  const [showTypes, setShowTypes] = useState({ subway: true, restaurant: true, parking: true });
  const [mapCenter, setMapCenter] = useState(null);
  const [eventCoords, setEventCoords] = useState(null);

  useEffect(() => {
    // if event has coordinates, prefer them for event marker and center
    const lat = event?.latitude || event?.lat || event?.y;
    const lng = event?.longitude || event?.lng || event?.x;
    if (lat && lng) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (!Number.isNaN(parsedLat) && !Number.isNaN(parsedLng)) {
        setEventCoords({ lat: parsedLat, lng: parsedLng, title: event?.event_name });
        setMapCenter({ lat: parsedLat, lng: parsedLng });
      }
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const formatKoreanDate = (dateStr) => {
    if (!dateStr) return '미정';
    return new Date(dateStr)
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      })
      .replace(/\./g, '')
      .replace(/월/, '월 ')
      .replace(/일/, '일 ');
  };

  // 상세 페이지 링크: 외부 홈페이지가 있으면 그것을 새 탭으로, 없으면 내부 라우트로
  const detailHref = event.homepage || `/events/${event.id}`;
  const isExternal = !!event.homepage;

  const fetchAmenities = async () => {
    try {
      const response = await axiosClient.get(`/api/festivals/${event.id}/amenities`, { params: { radius } });
      const data = response?.data;
      if (!data || !data.amenities) {
        alert('편의시설 정보를 불러오지 못했습니다.');
        return;
      }
      setAmenities(data.amenities);

      // set map center to first returned amenity if event coords are missing
      if (!eventCoords) {
        const any = data.amenities.subway?.[0] || data.amenities.restaurant?.[0] || data.amenities.parking?.[0];
        if (any && (any.y || any.latitude) && (any.x || any.longitude)) {
          const lat = parseFloat(any.y || any.latitude);
          const lng = parseFloat(any.x || any.longitude);
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) setMapCenter({ lat, lng });
        }
      }
    } catch (err) {
      console.error(err);
      alert('편의시설 조회 중 오류가 발생했습니다.');
    }
  };

  const modalContent = (
    <div
      className="event-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={event.event_name}
    >
      <div
        className="event-modal-container"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="event-modal-hero">
          <img
            src={event.main_image || 'https://via.placeholder.com/1200x600?text=No+Image'}
            alt={event.event_name}
            className="event-modal-hero-img"
          />
          <div className="event-modal-top-tags">
            <span className="tag category">{event.category}</span>
            <span className={`tag type ${event.type_info === '실내' ? 'indoor' : 'outdoor'}`}>
              {event.type_info || '일반'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="모달 닫기">✕</button>
        </div>

        {/* 편의시설 필터 및 지도 */}
        <div className="event-modal-body border-top">
          <h3 className="section-title">편의시설 확인</h3>
          <div className="amenities-controls">
            <label className="amenity-label">반경 (m):
              <input type="number" min={500} max={5000} value={radius} onChange={(e) => setRadius(Math.max(500, Math.min(5000, Number(e.target.value || 1000))))} className="amenity-radius-input" />
            </label>
            <label className="amenity-checkbox"><input type="checkbox" checked={showTypes.subway} onChange={(e) => setShowTypes(s => ({...s, subway: e.target.checked}))} /> 지하철</label>
            <label className="amenity-checkbox"><input type="checkbox" checked={showTypes.restaurant} onChange={(e) => setShowTypes(s => ({...s, restaurant: e.target.checked}))} /> 맛집</label>
            <label className="amenity-checkbox"><input type="checkbox" checked={showTypes.parking} onChange={(e) => setShowTypes(s => ({...s, parking: e.target.checked}))} /> 주차장</label>
            <button className="btn btn-primary" id="amenity-fetch-btn" onClick={async () => await fetchAmenities()}>조회</button>
          </div>

          <div style={{ marginTop: 12 }}>
            {amenities ? (
              <div>
                <div className="amenities-summary">조회된 편의시설 — 지하철: {amenities.subway?.length || 0} / 맛집: {amenities.restaurant?.length || 0} / 주차장: {amenities.parking?.length || 0}</div>
                <KakaoMap
                  className="amenities-map"
                  amenities={{
                    subway: showTypes.subway ? amenities.subway : [],
                    restaurant: showTypes.restaurant ? amenities.restaurant : [],
                    parking: showTypes.parking ? amenities.parking : [],
                  }}
                  center={mapCenter}
                  eventMarker={eventCoords}
                />
              </div>
            ) : (
              <div className="text-muted">조회 버튼을 눌러 축제 주변 편의시설을 확인하세요.</div>
            )}
          </div>
        </div>

        <div className="event-modal-body">
          <h2 className="modal-title">{event.event_name}</h2>

          <div className="modal-row">
            <div className="modal-icon">📍</div>
            <div>
              <div className="modal-label">장소</div>
              <div className="modal-value">{event.place} ({event.district})</div>
              {event.address && <div className="modal-subtext">{event.address}</div>}
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-icon">🗓️</div>
            <div>
              <div className="modal-label">진행 날짜</div>
              <div className="modal-value">
                {formatKoreanDate(event.start_date)} ~ {formatKoreanDate(event.end_date)}
              </div>
              {event.datetime_info && <div className="modal-subtext">{event.datetime_info}</div>}
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-icon">💡</div>
            <div>
              <div className="modal-label">프로그램 소개</div>
              <div className="modal-description">{event.description || '상세 소개 준비 중입니다.'}</div>
            </div>
          </div>

          {event.homepage && (
            <div className="modal-row border-top">
              <div className="modal-icon">🔗</div>
              <div>
                <div className="modal-label">공식 페이지</div>
                <a className="modal-link" href={event.homepage} target="_blank" rel="noreferrer">
                  {event.homepage}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="event-modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>닫기</button>

          {/* 상세 페이지로 이동하는 버튼 (외부이면 새탭, 내부이면 같은 탭 라우트) */}
          {isExternal ? (
            <a href={detailHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-link">
              상세 페이지 보기
            </a>
          ) : (
            <a href={detailHref} className="btn btn-primary btn-link">
              상세 페이지 보기
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EventDetailModal;
