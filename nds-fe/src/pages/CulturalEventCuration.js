import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import WeatherSection from '../components/features/WeatherSection';
import FilterPanel from '../components/features/FilterPanel';
import RecommendationButtons from '../components/features/RecommendationButtons';
import AdvancedFilters from '../components/features/AdvancedFilters';
import { getCurrentLocation, reverseGeocode } from '../utils/geolocation';
import { getSeoulAirQuality, getAirQualityColor } from '../utils/seoulApi';
import './CulturalEventCuration.css';

function CulturalEventCuration() {
  const [weatherData, setWeatherData] = useState({
    location: '위치 로딩 중...',
    pm10: 81,
    pm2_5: 45,
    o3: 0.035,
    airQuality: '나쁨',
    airQualityColor: '#F44336'
  });
  const [recommendationMessage, setRecommendationMessage] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    categories: [],
    distance: 5,
    age: 'all',
    timeRange: 'all'
  });

  useEffect(() => {
    fetchWeatherData();
  }, []);


  const fetchWeatherData = async () => {
    console.log('🚀 fetchWeatherData 함수 실행 시작');
    try {
      // 1. 사용자의 현재 위치 가져오기
      const { latitude, longitude } = await getCurrentLocation();
      console.log('📍 현재 위치:', latitude, longitude);

      // 2. 위치를 주소로 변환 (역지오코딩)
      const address = await reverseGeocode(latitude, longitude);
      console.log('🏠 변환된 주소:', address);

      // 3. 서울시 공공데이터 API에서 대기질 정보 가져오기
      let airQualityData;
      try {
        // 주소에서 권역명 추출 (예: "강남구 역삼동" -> 도심권)
        // 간단히 도심권으로 시도
        airQualityData = await getSeoulAirQuality('도심권');
        console.log('서울시 대기질 데이터:', airQualityData);
      } catch (error) {
        console.error('서울시 API 호출 실패, 기본값 사용:', error);
        // 기본값 설정
        airQualityData = {
          pm10: 81,
          pm25: 45,
          o3: 0.035,
          regionName: '도심권',
          stationName: address,
          airQualityGrade: '나쁨',
          airQualityIndex: 54
        };
      }
      
      const finalWeatherData = {
        location: address || '위치 확인 중',
        pm10: airQualityData.pm10,
        pm2_5: airQualityData.pm25,
        o3: airQualityData.o3,
        airQuality: airQualityData.airQualityGrade,
        airQualityColor: getAirQualityColor(airQualityData.airQualityGrade)
      };

      console.log('💾 최종 데이터 저장:', finalWeatherData);
      setWeatherData(finalWeatherData);

      // 미세먼지 농도에 따른 추천 메시지
      if (finalWeatherData.pm10 > 50) {
        setRecommendationMessage('현재 미세먼지 농도가 높아 실내 행사를 추천합니다.');
      } else {
        setRecommendationMessage('현재 대기질이 양호하여 실외 행사도 추천합니다.');
      }
    } catch (error) {
      console.error('위치 또는 날씨 데이터를 가져오는데 실패했습니다:', error);
      
      // 위치 정보 수집 실패 시 기본값 사용
      const defaultLocation = error.message?.includes('timeout') 
        ? '위치 권한 요청 시간 초과'
        : error.message?.includes('denied')
        ? '위치 권한이 거부되었습니다'
        : '강남구 역삼동'; // 기본값
      
      const errorWeatherData = {
        location: defaultLocation,
        pm10: 81,
        pm2_5: 45,
        o3: 0.035,
        airQuality: '나쁨',
        airQualityColor: '#F44336'
      };
      
      console.log('💾 에러 시 기본 데이터:', errorWeatherData);
      setWeatherData(errorWeatherData);
      
      setRecommendationMessage('현재 미세먼지 농도가 높아 실내 행사를 추천합니다.');
    }
  };



  const handleAdvancedFilterChange = (filters) => {
    setAdvancedFilters(filters);
  };

  const handleMapView = () => {
    console.log('지도 뷰로 전환');
  };

  const handleUserMenu = () => {
    console.log('사용자 메뉴 클릭');
  };

  const handleNotification = () => {
    console.log('알림 클릭');
  };

  const handleSettings = () => {
    console.log('설정 클릭');
  };

  return (
    <div className="cultural-event-page">
      <Header 
        onUserMenuClick={handleUserMenu}
        onNotificationClick={handleNotification}
        onSettingsClick={handleSettings}
      />
      
      <main className="main-content">
        <WeatherSection 
          location={weatherData.location}
          pm10={weatherData.pm10}
          pm2_5={weatherData.pm2_5}
          o3={weatherData.o3}
          airQuality={weatherData.airQuality}
          airQualityColor={weatherData.airQualityColor}
        />
        
        <RecommendationButtons />
      </main>

      <Footer />

      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFilterChange={handleAdvancedFilterChange}
        onApply={() => setShowAdvancedFilters(false)}
      />
    </div>
  );
}

export default CulturalEventCuration;

