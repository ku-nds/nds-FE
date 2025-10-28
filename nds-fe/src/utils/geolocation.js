const REST_API_KEY = '29da7fc58703ad7bef6aa7ca90b03deb';


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
 * 위도와 경도를 주소 (자치구 이름 포함)로 변환 (역지오코딩)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<string>} 주소 문자열 (자치구 이름 포함)
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    console.log('역지오코딩 시도:', latitude, longitude);
    
    if (!REST_API_KEY || REST_API_KEY === 'YOUR_KAKAO_REST_API_KEY') {
      console.warn('⚠️ Kakao REST API 키가 설정되지 않았습니다. 목업 주소를 사용합니다.');
      // API 키가 없으면 목업 데이터 반환
      return '서울특별시 강남구 역삼동 (Mock)'; 
    }

    // Kakao REST API 호출: 좌표를 행정 구역 코드로 변환 (coord2regioncode)
    const response = await fetch(
      // Kakao API는 경도(x)와 위도(y) 순서를 요구합니다.
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
      {
        headers: {
          Authorization: `KakaoAK ${REST_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    
    if (data.documents && data.documents.length > 0) {
      // 'H' (행정구역) 타입의 주소를 찾습니다.
      const regionH = data.documents.find(doc => doc.region_type === 'H'); 
      
      if (regionH) {
         // 시/도, 구/군 주소를 반환합니다. (예: 서울특별시 강남구)
         const address = `${regionH.region_1depth_name} ${regionH.region_2depth_name}`;
         console.log('역지오코딩 성공:', address);
         return address;
      }
    }

    // 결과가 없으면 좌표로 표시
    const location = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    console.warn('역지오코딩 결과 없음, 좌표로 표시:', location);
    return location;

  } catch (error) {
    console.error('역지오코딩 실패:', error);
    // 에러 발생 시 좌표 반환
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
};


