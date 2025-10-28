// src/utils/seoulApi.js
import axios from 'axios';

const SEOUL_API_KEY = '6668774c686a68793132344a51496172';

/**
 * 서울시 실시간 대기질 정보 조회 (견고한 XML 파싱)
 * regionName, stationName 둘 다 없으면 전체(최대 5개) 반환됨
 */
export const getSeoulAirQuality = async (regionName = '', stationName = '') => {
  try {
    const url = `http://openAPI.seoul.go.kr:8088/${SEOUL_API_KEY}/xml/RealtimeCityAir/1/5${regionName ? `/${encodeURIComponent(regionName)}` : ''}${stationName ? `/${encodeURIComponent(stationName)}` : ''}`;
    console.log('서울시 API 호출:', url);

    // responseType: 'text'로 명시해서 항상 문자열로 받게 함
    const response = await axios.get(url, { timeout: 5000, responseType: 'text' });
    const xmlText = response.data;
    console.log('응답(raw):', typeof xmlText === 'string' ? xmlText.slice(0, 800) : xmlText);

    if (!xmlText || typeof xmlText !== 'string') {
      throw new Error('응답이 비어있거나 문자열이 아닙니다');
    }

    // DOMParser로 파싱
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // 서버가 반환한 RESULT 코드 체크 (에러 메시지 있으면 던짐)
    const resultNode = xmlDoc.getElementsByTagName('RESULT')[0];
    if (resultNode) {
      const codeNode = resultNode.getElementsByTagName('CODE')[0];
      const msgNode = resultNode.getElementsByTagName('MESSAGE')[0];
      const code = codeNode?.textContent?.trim();
      const message = msgNode?.textContent?.trim();
      console.log('API RESULT:', code, message);
      if (code && code !== 'INFO-000') {
        throw new Error(`API 에러 코드: ${code} - ${message}`);
      }
    }

    // row 노드 찾기
    const rows = xmlDoc.getElementsByTagName('row');
    if (!rows || rows.length === 0) {
      console.error('row 노드가 없습니다. 응답 확인 필요.');
      console.error(xmlText);
      throw new Error('데이터가 없습니다 (row 없음)');
    }

    const firstRow = rows[0];
    const getText = (tag) => {
      const el = firstRow.getElementsByTagName(tag)[0];
      return el ? el.textContent.trim() : '';
    };

    const pm10 = Number(getText('PM10')) || 0;
    const pm25 = Number(getText('PM25')) || 0;
    const o3 = Number(getText('O3')) || 0;
    const regionNameResp = getText('MSRRGN_NM') || '';
    const stationNameResp = getText('MSRSTE_NM') || '';
    const grade = getText('IDEX_NM') || '';
    const indexVal = Number(getText('IDEX_MVL')) || 0;
    const msrdt = getText('MSRDT') || '';

    return {
      pm10,
      pm25,
      o3,
      regionName: regionNameResp,
      stationName: stationNameResp,
      airQualityGrade: grade,
      airQualityIndex: indexVal,
      measurementTime: msrdt
    };
  } catch (error) {
    console.error('서울시 대기질 API 호출 실패:', error);
    if (error.response) {
      console.error('서버 응답:', error.response.status, error.response.data);
    }
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
