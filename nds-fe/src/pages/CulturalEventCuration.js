import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import WeatherSection from '../components/features/WeatherSection';
import RecommendationButtons from '../components/features/RecommendationButtons';
import AdvancedFilters from '../components/features/AdvancedFilters';
import { getCurrentLocation, reverseGeocode } from '../utils/geolocation';
import { getSeoulAirQuality, getAirQualityColor } from '../utils/seoulApi';
import { mapAddressToRegion } from '../utils/regionMapper';
import './CulturalEventCuration.css';
import { useAppContext } from '../context/AppContext'; // ✅ Context import

function CulturalEventCuration() {
  // ✅ Context 사용: weatherData, position을 전역 상태로 관리
  const { weatherData, setWeatherData, position, setPosition } = useAppContext();

  // 로컬 필터링 상태만 유지
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    categories: [],
    distance: 5,
    age: 'all',
    timeRange: 'all',
  });

  // ✅ 첫 렌더링 시 위치/날씨 데이터가 없으면 fetch 실행
  useEffect(() => {
    if (!position || !weatherData) {
      fetchWeatherData();
    }
  }, []);

  // ✅ 위치 + 대기질 정보 가져오기
  const fetchWeatherData = async () => {
    console.log('🌍 fetchWeatherData 함수 실행 시작');
    try {
      // 1️⃣ 현재 위치 가져오기
      const { latitude, longitude } = await getCurrentLocation();
      console.log('📍 현재 위치:', latitude, longitude);

      // 2️⃣ 위경도로 행정구역명 얻기
      const guName = await reverseGeocode(latitude, longitude);
      const { region, gu } = mapAddressToRegion(guName);
      console.log('🗺️ 추출된 지역 =>', region, gu);

      // 3️⃣ 위치 정보 Context에 저장
      setPosition({ latitude, longitude, guName, region, gu });

      // 4️⃣ 대기질 API 요청
      let airQualityData;
      try {
        airQualityData = await getSeoulAirQuality(region, gu);
        console.log('✅ 서울시 대기질 데이터:', airQualityData);
      } catch (error) {
        console.error('⚠️ 서울시 API 호출 실패:', error);
        // 기본값 사용
        airQualityData = {
          pm10: 81,
          pm25: 45,
          o3: 0.035,
          regionName: '도심권',
          airQualityGrade: '나쁨',
          airQualityIndex: 54,
        };
      }

      // 5️⃣ 최종 날씨 데이터 구성 및 Context 저장
      const finalWeatherData = {
        location: guName,
        pm10: airQualityData.pm10,
        pm2_5: airQualityData.pm25,
        o3: airQualityData.o3,
        airQuality: airQualityData.airQualityGrade,
        airQualityColor: getAirQualityColor(airQualityData.airQualityGrade),
      };

      setWeatherData(finalWeatherData);
      console.log('🌤️ setWeatherData 완료:', finalWeatherData);
    } catch (error) {
      console.error('❌ 위치 또는 날씨 데이터를 가져오는데 실패했습니다:', error);

      // 기본값 (광진구)
      const fallbackWeather = {
        location: '서울특별시 광진구',
        pm10: 81,
        pm2_5: 45,
        o3: 0.035,
        airQuality: '나쁨',
        airQualityColor: '#F44336',
      };

      setWeatherData(fallbackWeather);
      setPosition({
        latitude: 37.5407,
        longitude: 127.0702,
        guName: '서울특별시 광진구',
        region: '서울특별시',
        gu: '광진구',
      });
    }
  };

  const handleAdvancedFilterChange = (filters) => {
    setAdvancedFilters(filters);
  };

  const handleUserMenu = () => console.log('사용자 메뉴 클릭');
  const handleNotification = () => console.log('알림 클릭');
  const handleSettings = () => console.log('설정 클릭');

  return (
    <div className="cultural-event-page">
      {/* ✅ Header: Context의 weatherData 사용 */}
      <Header
        onUserMenuClick={handleUserMenu}
        onNotificationClick={handleNotification}
        onSettingsClick={handleSettings}
        currentLocation={weatherData?.location || '서울특별시 광진구'}
      />

      <main className="main-content">
        {/* ✅ WeatherSection: Context의 weatherData 사용 */}
        <WeatherSection
          location={weatherData?.location || '서울특별시 광진구'}
          pm10={weatherData?.pm10 || 81}
          pm2_5={weatherData?.pm2_5 || 45}
          o3={weatherData?.o3 || 0.035}
          airQuality={weatherData?.airQuality || '나쁨'}
          airQualityColor={weatherData?.airQualityColor || '#F44336'}
        />

        {/* ✅ RecommendationButtons: Context의 position 전달 */}
        <RecommendationButtons
          weatherData={weatherData}
          guName={position?.guName}
          latitude={position?.latitude}
          longitude={position?.longitude}
          region={position?.region}
          gu={position?.gu}
        />
      </main>

      <Footer />

      {/* 고급 필터 모달 */}
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
