# 서울 스마트시티 문화행사 큐레이션 프로젝트 구조

## 📁 프로젝트 구조

```
src/
├── api/                          # API 통신 모듈
│   ├── axiosClient.js           # Axios 인스턴스 설정
│   ├── userApi.js               # 사용자 API
│   ├── productApi.js            # 상품 API
│   ├── culturalEventApi.js      # 문화행사 API
│   ├── weatherApi.js            # 날씨 API
│   └── index.js                 # API 모듈 export
│
├── components/                   # 컴포넌트
│   ├── layout/                  # 레이아웃 컴포넌트
│   │   ├── Header.js           # 헤더 (로고, 사용자 메뉴)
│   │   ├── Header.css
│   │   ├── Footer.js           # 푸터 (정보 및 고객지원)
│   │   └── Footer.css
│   │
│   ├── features/               # 기능 컴포넌트
│   │   ├── WeatherSection.js   # 날씨 정보 섹션
│   │   ├── WeatherCard.js      # 날씨 카드
│   │   ├── FilterPanel.js      # 필터 패널
│   │   ├── AdvancedFilters.js  # 상세 필터 (사이드바)
│   │   ├── SmartRecommendation.js # 스마트 추천 배너
│   │   ├── EventCard.js        # 이벤트 카드
│   │   └── *.css               # 각 컴포넌트 스타일
│   │
│   └── common/                 # 공통 컴포넌트 (향후 확장)
│
├── pages/                       # 페이지
│   ├── CulturalEventCuration.js # 메인 페이지
│   ├── CulturalEventCuration.css
│   └── README.md
│
├── hooks/                       # 커스텀 훅 (향후 확장)
│
├── utils/                       # 유틸리티 함수 (향후 확장)
│
├── constants/                   # 상수 정의
│   └── index.js
│
├── styles/                      # 글로벌 스타일
│   └── MainPage.css
│
└── assets/                      # 정적 파일

```

## 🎯 주요 기능

### 1. 헤더 영역
- 서울 스마트시티 로고
- 알림, 설정, 사용자 프로필 버튼

### 2. 현재 위치 및 날씨 정보
- 현재 위치 표시
- 온도 및 날씨 상태
- 날씨 카드 (습도, 미세먼지, 초미세먼지, 대기질)

### 3. 날씨 기반 필터링
- 실내 행사 / 실외 행사 / 전체 필터
- 지도 보기 버튼
- 상세 필터 버튼

### 4. 스마트 추천 상태
- 대기질 기반 맞춤 추천 메시지

### 5. 문화행사 리스트
- 필터링된 추천 문화행사 카드
- 행사 정보 (이미지, 카테고리, 제목, 장소, 일시, 거리)
- 정렬 기능 (거리순)

### 6. 상세 필터
- 카테고리 선택 (전시, 공연, 축제, 교육, 체험, 기타)
- 거리 반경 설정 (1-20km)
- 시간대 필터 (오전/오후/저녁)
- 연령대 필터

### 7. 푸터
- 데이터 출처 정보
- 최종 업데이트 시간
- 고객지원 연락처

## 🚀 실행 방법

```bash
# 개발 서버 실행
npm start

# 빌드
npm run build

# 테스트
npm test
```

## 📡 API 연동

### 환경 변수 설정
`.env` 파일을 생성하여 API 기본 URL 설정:

```
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

### API 엔드포인트
- `GET /cultural-events` - 전체 문화행사 목록
- `GET /cultural-events/recommended` - 추천 문화행사
- `GET /cultural-events/filter/:filter` - 필터링된 문화행사
- `GET /weather/current` - 현재 날씨
- `GET /weather/air-quality` - 대기질 정보

## 🎨 스타일링

- 모든 컴포넌트는 각자의 CSS 파일을 가짐
- 반응형 디자인 적용 (모바일/태블릿/데스크탑)
- 일관된 디자인 시스템 사용

## 📝 주요 컴포넌트 설명

### Header
헤더 컴포넌트로, 좌측에 로고와 애플리케이션명, 우측에 사용자 메뉴를 표시합니다.

### WeatherSection
현재 위치와 날씨 정보를 카드 형태로 표시합니다.

### FilterPanel
날씨 기반 필터링 컨트롤과 지도 뷰 전환 버튼을 제공합니다.

### SmartRecommendation
대기질 상태에 따른 맞춤 추천 메시지를 표시합니다.

### EventCard
문화행사 정보를 카드 형태로 표시하며, 이미지, 제목, 장소, 일시, 거리 정보를 포함합니다.

### AdvancedFilters
사이드바 형태의 상세 필터로, 카테고리, 거리, 시간대, 연령대를 선택할 수 있습니다.

### Footer
데이터 출처, 업데이트 시간, 고객지원 정보를 표시합니다.

## 🔧 추가 개발 필요 사항

1. 실제 API 연동
2. 사용자 인증 기능
3. 지도 뷰 구현
4. 북마크/즐겨찾기 기능
5. 알림 기능
6. 반응형 모바일 최적화
7. 성능 최적화

## 📚 참고 문서

- [Axios 문서](https://axios-http.com/)
- [React 문서](https://react.dev/)
- [서울시 공공데이터](https://data.seoul.go.kr/)

