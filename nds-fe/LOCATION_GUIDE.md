# 위치 정보 가져오기 가이드

## 개요
웹 애플리케이션에서 사용자의 현재 위치를 가져오는 방법은 **Geolocation API**를 사용합니다.

## 기능

### 1. 사용자의 현재 위치 가져오기
브라우저의 `navigator.geolocation.getCurrentPosition()` API를 사용합니다.

### 2. 주소 변환 (역지오코딩)
위도/경도를 실제 주소로 변환합니다. Kakao Maps API를 사용합니다.

## 사용 방법

### 기본 설정 (무료)
Kakao Maps API 없이도 사용자의 위치(위도/경도)를 가져올 수 있습니다.
- 위치 권한 요청 팝업이 표시됩니다.
- 사용자가 허용하면 위치 정보가 가져와집니다.

### Kakao Maps API 설정 (추천)
더 정확한 주소를 위해 Kakao Maps API를 사용할 수 있습니다:

1. **[Kakao Developers](https://developers.kakao.com/)**에서 회원가입
2. **내 애플리케이션**에서 앱 만들기
3. **JavaScript 키** 발급받기
4. 환경 변수 설정:

```env
REACT_APP_KAKAO_MAP_API_KEY=your_api_key_here
```

## 구현된 파일

- `src/utils/geolocation.js` - 위치 관련 유틸리티 함수
  - `getCurrentLocation()` - 현재 위치 가져오기
  - `reverseGeocode()` - 위도/경도 → 주소 변환
  - `geocode()` - 주소 → 위도/경도 변환

## 브라우저 권한

### 위치 권한 요청
페이지 로드 시 브라우저가 위치 권한을 요청합니다:
- **허용**: 현재 위치 정보 사용
- **차단**: 기본값 사용 (위치 정보 수집 실패)

### 모바일 브라우저
- iOS Safari: 위치 권한 필요
- Android Chrome: 위치 권한 필요
- 위치 서비스 활성화 필요

## 보안 주의사항

1. **HTTPS 필수**: 프로덕션 환경에서는 HTTPS가 필요합니다
2. **권한 처리**: 사용자가 위치 권한을 차단할 경우를 대비한 fallback 필요
3. **정확도**: 정확도 설정 (`enableHighAccuracy`)으로 더 정확한 위치 가져오기

## 예제 코드

```javascript
import { getCurrentLocation, reverseGeocode } from './utils/geolocation';

// 위치 가져오기
const { latitude, longitude } = await getCurrentLocation();

// 주소로 변환
const address = await reverseGeocode(latitude, longitude);
console.log('현재 위치:', address);
```

## 테스트

### 로컬 개발 환경
- `http://localhost:3000`로 접속하면 위치 권한이 요청됩니다
- 개발 중에는 위치 서비스가 활성화된 환경에서 테스트해야 합니다

### 프로덕션
- HTTPS가 필요한 Geolocation API입니다
- SSL 인증서가 있는 서버에서만 작동합니다

## 대안 방법

### 1. IP 기반 위치 (무료)
```javascript
// ipapi.co 사용 예시
const response = await fetch('https://ipapi.co/json/');
const data = await response.json();
console.log(data.city, data.region);
```

### 2. 사용자 입력
위치 정보 수집 실패 시 사용자에게 주소 입력 받기

## 참고 자료
- [MDN Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Kakao Maps API](https://developers.kakao.com/docs/latest/ko/local/dev-guide)

