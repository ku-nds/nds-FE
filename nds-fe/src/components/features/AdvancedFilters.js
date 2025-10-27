import React, { useState } from 'react';
import './AdvancedFilters.css';

function AdvancedFilters({ isOpen, onClose, filters, onFilterChange, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleCategoryToggle = (category) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleReset = () => {
    setLocalFilters({
      categories: [],
      distance: 5,
      age: 'all',
      timeRange: 'all'
    });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
  };

  const categories = ['전시', '공연', '축제', '교육', '체험', '기타'];

  return (
    <>
      {isOpen && <div className="filter-overlay" onClick={onClose}></div>}
      <div className={`advanced-filters ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>상세 필터</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="filter-content">
          <div className="filter-section">
            <h4 className="filter-label">행사 카테고리</h4>
            <div className="category-grid">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-chip ${localFilters.categories.includes(category) ? 'active' : ''}`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4 className="filter-label">거리 반경</h4>
            <div className="distance-input">
              <input
                type="range"
                min="1"
                max="20"
                value={localFilters.distance}
                onChange={(e) => setLocalFilters({ ...localFilters, distance: e.target.value })}
                className="slider"
              />
              <div className="distance-value">{localFilters.distance}km</div>
            </div>
          </div>

          <div className="filter-section">
            <h4 className="filter-label">시간대</h4>
            <div className="radio-buttons">
              {[
                { value: 'all', label: '전체' },
                { value: 'morning', label: '오전 (09:00-12:00)' },
                { value: 'afternoon', label: '오후 (12:00-18:00)' },
                { value: 'evening', label: '저녁 (18:00-24:00)' }
              ].map(option => (
                <label key={option.value} className="radio-label">
                  <input
                    type="radio"
                    name="timeRange"
                    value={option.value}
                    checked={localFilters.timeRange === option.value}
                    onChange={(e) => setLocalFilters({ ...localFilters, timeRange: e.target.value })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4 className="filter-label">연령대</h4>
            <div className="radio-buttons">
              {[
                { value: 'all', label: '전체' },
                { value: 'child', label: '어린이 (5-12세)' },
                { value: 'teen', label: '청소년 (13-19세)' },
                { value: 'adult', label: '성인 (20세 이상)' }
              ].map(option => (
                <label key={option.value} className="radio-label">
                  <input
                    type="radio"
                    name="age"
                    value={option.value}
                    checked={localFilters.age === option.value}
                    onChange={(e) => setLocalFilters({ ...localFilters, age: e.target.value })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button className="reset-btn" onClick={handleReset}>초기화</button>
          <button className="apply-btn" onClick={handleApply}>적용하기</button>
        </div>
      </div>
    </>
  );
}

export default AdvancedFilters;

