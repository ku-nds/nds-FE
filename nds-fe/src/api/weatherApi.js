import axios from 'axios';

// 서울시 공공데이터 API 인증키
const SEOUL_API_KEY = '6668774c686a68793132344a51496172';

// 날씨 관련 API
export const weatherApi = {
  // 서울시 실시간 대기질 정보 조회 (권역별)
  getSeoulAirQuality: async (regionName) => {
    const url = `http://openAPI.seoul.go.kr:8088/${SEOUL_API_KEY}/xml/RealtimeCityAir/1/5/${encodeURIComponent(regionName || '')}`;
    
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.error('서울시 대기질 API 호출 실패:', error);
      throw error;
    }
  },

  // 현재 날씨 조회 (백엔드 API)
  getCurrentWeather: (latitude, longitude) => {
    // 백엔드 API가 구현되면 사용
    // return axiosClient.get('/weather/current', {
    //   params: { latitude, longitude }
    // });
    
    // 임시 더미 데이터
    return Promise.resolve({
      data: {
        temperature: 18,
        condition: '흐림',
        humidity: 65
      }
    });
  },

  // 대기질 정보 조회 (백엔드 API)
  getAirQuality: (latitude, longitude) => {
    // 백엔드 API가 구현되면 사용
    // return axiosClient.get('/weather/air-quality', {
    //   params: { latitude, longitude }
    // });
    
    // 임시 더미 데이터
    return Promise.resolve({
      data: {
        pm10: 81,
        pm2_5: 45,
        airQuality: '나쁨'
      }
    });
  },
};

