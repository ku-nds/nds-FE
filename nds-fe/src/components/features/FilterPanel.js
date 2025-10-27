import React from 'react';
import './FilterPanel.css';

function FilterPanel({ selectedFilter, onFilterChange, onShowFilters, onMapView }) {
  const getFilterMessage = () => {
    if (selectedFilter === 'indoor') {
      return '실내 행사 추천';
    } else if (selectedFilter === 'outdoor') {
      return '실외 행사 추천';
    }
    return '전체 행사';
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">추천 필터</h3>
      </div>
      
      <div className="filter-buttons-row">
        <button
          className={`filter-btn ${selectedFilter === 'indoor' ? 'active' : ''}`}
          onClick={() => onFilterChange('indoor')}
        >
          <span className="filter-icon">🏠</span>
          <span>실내 행사</span>
        </button>
        
        <button
          className={`filter-btn ${selectedFilter === 'outdoor' ? 'active' : ''}`}
          onClick={() => onFilterChange('outdoor')}
        >
          <span className="filter-icon">🌳</span>
          <span>실외 행사</span>
        </button>
        
        <button
          className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          <span className="filter-icon">📋</span>
          <span>전체</span>
        </button>
        
        <button
          className="map-view-btn"
          onClick={onMapView}
        >
          <span className="map-icon">🗺️</span>
          <span>지도 보기</span>
        </button>
        
        <button
          className="advanced-filter-btn"
          onClick={onShowFilters}
        >
          <span className="filter-icon">🔍</span>
          <span>상세 필터</span>
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;

