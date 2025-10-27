import axios from 'axios';

// 서울시 공공데이터 API 인증키
const SEOUL_API_KEY = '6668774c686a68793132344a51496172';

/**
 * XML 응답을 JSON으로 변환
 * @param {string} xmlText 
 * @returns {Object}
 */
const xmlToJson = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const result = {};

  const parseNode = (node) => {
    if (node.children && node.children.length > 0) {
      const obj = {};
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const key = child.tagName;
        const value = parseNode(child);
        
        if (obj[key]) {
          if (!Array.isArray(obj[key])) {
            obj[key] = [obj[key]];
          }
          obj[key].push(value);
        } else {
          obj[key] = value;
        }
      }
      return Object.keys(obj).length > 0 ? obj : node.textContent;
    }
    return node.textContent;
  };

  return parseNode(xmlDoc.documentElement);
};

/**
 * 서울시 실시간 대기질 정보 조회
 * @param rozwiązstring} regionName - 권역명 (예: '동북권', '도심권')
 * @returns {Promise<{pm10: number, pm25: number, o3: number, regionName: string, stationName: string}>}
 */
export const getSeoulAirQuality = async (regionName = '') => {
  try {
    const url = `http://openAPI.seoul.go.kr:8088/${SEOUL_API_KEY}/xml/RealtimeCityAir/1/5${regionName ? `/${encodeURIComponent(regionName)}` : ''}`;
    
    console.log('서울시 API 호출:', url);
    
    const response = await axios.get(url);
    const jsonData = xmlToJson(response.data);
    
    // 응답 데이터 확인
    if (jsonData.RESULT && jsonData.RESULT.CODE !== 'INFO-000') {
      throw new Error(jsonData.RESULT.MESSAGE || '서울시 API 호출 실패');
    }

    // row 데이터 추출
    if (jsonData.row) {
      const data = Array.isArray(jsonData.row) ? jsonData.row[0] : jsonData.row;
      
      return {
        pm10: parseInt(data.PM10) || 0,
        pm25: parseInt(data.PM25) || 0,
        o3: parseFloat(data.O3) || 0,
        regionName: data.MSRRGN_NM || '',
        stationName: data.MSRSTE_NM || '',
        airQualityGrade: data.IDEX_NM || '',
        airQualityIndex: parseInt(data.IDEX_MVL) || 0,
        measurementTime: data.MSRDT || ''
      };
    }
    
    throw new Error('데이터가 없습니다');
  } catch (error) {
    console.error('서울시 대기질 API 호출 실패:', error);
    throw error;
  }
};

/**
 * 대기질 등급에 따른 색상 반환
 * @param {string} grade 
 * @returns {string}
 */
export const getAirQualityColor = (grade) => {
  switch (grade) {
    case '좋음': return '#4CAF50';
    case '보통': return '#8BC34A';
    case '나쁨': return '#FF9800';
    case '매우나쁨': return '#F44336';
    default: return '#757575';
  }
};

