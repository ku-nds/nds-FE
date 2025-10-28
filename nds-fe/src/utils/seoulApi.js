import axios from 'axios';

const SEOUL_API_KEY = '6668774c686a68793132344a51496172';

const xmlToJson = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  const parseNode = (node) => {
    if (node.nodeType === 3) return node.nodeValue.trim();
    if (node.children && node.children.length > 0) {
      const obj = {};
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const key = child.tagName;
        const value = parseNode(child);
        if (value !== '') {
          if (obj[key]) {
            if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
            obj[key].push(value);
          } else obj[key] = value;
        }
      }
      return obj;
    }
    return node.textContent.trim();
  };

  return parseNode(xmlDoc.documentElement);
};

export const getSeoulAirQuality = async (regionName = '', stationName = '') => {
  try {
    const url = `http://openAPI.seoul.go.kr:8088/${SEOUL_API_KEY}/xml/RealtimeCityAir/1/5${regionName ? `/${encodeURIComponent(regionName)}` : ''}${stationName ? `/${encodeURIComponent(stationName)}` : ''}`;
    console.log('서울시 API 호출:', url);

    const response = await axios.get(url, { timeout: 5000 });
    const jsonData = xmlToJson(response.data);

    if (jsonData.RESULT && jsonData.RESULT.CODE !== 'INFO-000')
      throw new Error(jsonData.RESULT.MESSAGE || '서울시 API 호출 실패');

    const data = Array.isArray(jsonData.row) ? jsonData.row[0] : jsonData.row;
    return {
      pm10: Number(data.PM10) || 0,
      pm25: Number(data.PM25) || 0,
      o3: Number(data.O3) || 0,
      regionName: data.MSRRGN_NM || '',
      stationName: data.MSRSTE_NM || '',
      airQualityGrade: data.IDEX_NM || '',
      airQualityIndex: Number(data.IDEX_MVL) || 0,
      measurementTime: data.MSRDT || ''
    };
  } catch (error) {
    console.error('서울시 대기질 API 호출 실패:', error);
    throw error;
  }
};

export const getAirQualityColor = (grade) => {
  switch (grade) {
    case '좋음': return '#4CAF50';
    case '보통': return '#8BC34A';
    case '나쁨': return '#FF9800';
    case '매우나쁨': return '#F44336';
    default: return '#757575';
  }
};
