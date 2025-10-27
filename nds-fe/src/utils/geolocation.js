/**
 * 사용자의 현재 위치를 가져오는 유틸리티 함수
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * 위도와 경도를 주소로 변환 (역지오코딩)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<string>} 주소 문자열
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    console.log('🌍 역지오코딩 시도:', latitude, longitude);
    
    // Kakao Maps API 사용 (무료)
    const REST_API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY;
    
    if (!REST_API_KEY) {
      // API 키가 없으면 위도/경도를 간단히 표시
      const location = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      console.log('📍 API 키 없음, 좌표로 표시:', location);
      return location;
    }

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
      {
        headers: {
          Authorization: `KakaoAK ${REST_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    
    if (data.documents && data.documents.length > 0) {
      const region = data.documents[0];
      const address = `${region.region_2depth_name} ${region.region_3depth_name || ''}`.trim();
      console.log('✅ 역지오코딩 성공:', address);
      return address;
    }

    // API 호출은 성공했지만 결과가 없으면 좌표 반환
    const location = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    console.log('⚠️ 역지오코딩 결과 없음, 좌표로 표시:', location);
    return location;
  } catch (error) {
    console.error('❌ 역지오코딩 실패:', error);
    // 위도/경도로 표시
    const location = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    console.log('📍 좌표로 표시:', location);
    return location;
  }
};

/**
 * Geocoding - 주소를 위도/경도로 변환
 * @param {string} address 
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const geocode = async (address) => {
  try {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY;
    
    if (!REST_API_KEY) {
      throw new Error('Kakao Maps API key is not set');
    }

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      {
        headers: {
          Authorization: `KakaoAK ${REST_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    
    if (data.documents && data.documents.length > 0) {
      const location = data.documents[0];
      return {
        latitude: parseFloat(location.y),
        longitude: parseFloat(location.x),
      };
    }

    throw new Error('주소를 찾을 수 없습니다');
  } catch (error) {
    console.error('지오코딩 실패:', error);
    throw error;
  }
};

