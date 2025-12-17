import React from 'react';
import './ShortestPathPlanner.css';

const ShortestPathPlanner = ({ selectedCount, onFindPath, distance, isLoading, error }) => (
  <div className="shortest-path-planner">
    <div className="planner-content">
      <p>선택된 축제: {selectedCount}개</p>
      <button onClick={onFindPath} disabled={selectedCount < 2 || isLoading}>
        {isLoading ? '계산 중...' : '최단 경로 찾기'}
      </button>
    </div>
    {distance && (
      <div className="path-info">
        <p>총 예상 거리: {distance.toFixed(2)}km</p>
      </div>
    )}
    {error && <div className="path-error">{error}</div>}
  </div>
);

export default ShortestPathPlanner;
