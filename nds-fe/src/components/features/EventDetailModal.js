import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './EventDetailModal.css';

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
