import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import WeatherSection from '../components/features/WeatherSection';
import RecommendationButtons from '../components/features/RecommendationButtons';
import AdvancedFilters from '../components/features/AdvancedFilters';
import { getCurrentLocation, reverseGeocode } from '../utils/geolocation';
import { getSeoulAirQuality, getAirQualityColor } from '../utils/seoulApi';
import { mapAddressToRegion } from '../utils/regionMapper';
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

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    categories: [],
    distance: 5,
    age: 'all',
    timeRange: 'all'
  });

  const [position, setPosition] = useState({ latitude: null, longitude: null, guName: null, region: null, gu: null });

  useEffect(() => {
    fetchWeatherData();
  }, []);


  const fetchWeatherData = async () => {
    console.log('fetchWeatherData 함수 실행 시작');
    try {
      // 사용자의 현재 위치 가져오기
      const { latitude, longitude } = await getCurrentLocation();
      console.log('현재 위치:', latitude, longitude);

      // 위경도로 주소 가져오기
      const guName = await reverseGeocode(latitude, longitude);
      
      //주소를 서울 api 용으로 변경
      const {region, gu} = mapAddressToRegion(guName);
      console.log('추출된 gu, region => ', gu, region);

      setPosition({ latitude, longitude, guName, region, gu });

      // 서울시 공공데이터 API에서 대기질 정보 가져오기
      console.log('서울시 API 호출 시작...');
      let airQualityData;
      try {
        // 추출된 값으로 대기질 정보 api 요청
        airQualityData = await getSeoulAirQuality(region, gu);
        console.log('서울시 대기질 데이터 수신:', airQualityData);
      } catch (error) {
        console.error('서울시 API 호출 실패:', error);
        // 기본값 설정
        airQualityData = {
          pm10: 81,
          pm25: 45,
          o3: 0.035,
          regionName: '도심권',
          airQualityGrade: '나쁨',
          airQualityIndex: 54
        };
        console.log('기본값 사용:', airQualityData);
      }
      
      const finalWeatherData = {
        location: guName,
        pm10: airQualityData.pm10,
        pm2_5: airQualityData.pm25,
        o3: airQualityData.o3,
        airQuality: airQualityData.airQualityGrade,
        airQualityColor: getAirQualityColor(airQualityData.airQualityGrade)
      };

      console.log('최종 데이터:', finalWeatherData);
      setWeatherData(finalWeatherData);
      console.log('setWeatherData 호출 완료');
    } catch (error) {
      console.error('위치 또는 날씨 데이터를 가져오는데 실패했습니다:', error);
      
      // 위치 정보 수집 실패 시 기본값 사용
      const defaultLocation = error.message?.includes('timeout') 
        ? '위치 권한 요청 시간 초과'
        : error.message?.includes('denied')
        ? '위치 권한이 거부되었습니다'
        : '서울특별시 강남구'; // 기본값
      
      const errorWeatherData = {
        location: defaultLocation,
        pm10: 81,
        pm2_5: 45,
        o3: 0.035,
        airQuality: '나쁨',
        airQualityColor: '#F44336'
      };
      
      console.log('에러 시 기본 데이터:', errorWeatherData);
      setWeatherData(errorWeatherData);
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
        currentLocation={weatherData.location}
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
        
        <RecommendationButtons
          weatherData={weatherData}
          guName={position.guName}
          latitude={position.latitude}
          longitude={position.longitude}
          region={position.region}
          gu={position.gu}
        />
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

