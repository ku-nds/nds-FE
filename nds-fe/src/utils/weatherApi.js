import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

/**
 * OpenWeatherMap API를 사용해서 실제 날씨 데이터 가져오기
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {Promise<{temperature: number, condition: string, humidity: number}>}
 */
export const getOpenWeatherData = async (latitude, longitude) => {
  try {
    // OpenWeatherMap Current Weather Data API
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;
    
    console.log('🌤️ OpenWeatherMap API 호출 시작');
    console.log('위치:', latitude, longitude);
    console.log('URL (API 키 제외):', `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=***&units=metric&lang=kr`);
    
    const response = await axios.get(url);
    console.log('✅ OpenWeatherMap 응답 성공:', response.data);
    const data = response.data;
    
    // 날씨 아이콘 코드를 한글 상태로 변환
    const weatherConditionMap = {
      '01d': '맑음', '01n': '맑음',
      '02d': '약한 구름', '02n': '약한 구름',
      '03d': '구름', '03n': '구름',
      '04d': '흐림', '04n': '흐림',
      '09d': '비', '09n': '비',
      '10d': '비', '10n': '비',
      '11d': '천둥번개', '11n': '천둥번개',
      '13d': '눈', '13n': '눈',
      '50d': '안개', '50n': '안개'
    };
    
    const condition = weatherConditionMap[data.weather[0].icon] || data.weather[0].main;
    
    const result = {
      temperature: Math.round(data.main.temp),
      condition: condition,
      humidity: Math.round(data.main.humidity)
    };
    
    console.log('📊 파싱된 날씨 데이터:', result);
    return result;
  } catch (error) {
    console.error('❌ OpenWeatherMap API 호출 실패:', error);
    console.error('에러 상세:', error.response?.data || error.message);
    throw error;
  }
};

