# 백엔드 API 명세서

## 날씨 API

### 1. 현재 날씨 조회
**GET** `/api/weather/current`

#### 요청 파라미터
- `latitude` (number, required): 위도
- `longitude` (number, required): 경도

#### 응답 형식
```json
{
  "temperature": 18,
  "condition": "흐림",
  "humidity": 65
}
```

#### 응답 필드 설명
- `temperature` (number): 현재 온도 (섭씨)
- `condition` (string): 날씨 상태 (예: "맑음", "흐림", "비", "눈")
- `humidity` (number): 습도 (0-100)

---

### 2. 대기질 정보 조회
**GET** `/api/weather/air-quality`

#### 요청 파라미터
- `latitude` (number, required): 위도
- `longitude` (number, required): 경도

#### 응답 형식
```json
{
  "pm10": 81,
  "pm2_5": 45,
  "airQuality": "나쁨"
}
```

#### 응답 필드 설명
- `pm10` (number): 미세먼지 농도 (PM10)
- `pm2_5` (number): 초미세먼지 농도 (PM2.5)
- `airQuality` (string): 대기질 상태 ("좋음", "보통", "나쁨", "매우 나쁨")

---

## 문화행사 API

### 3. 필터링된 문화행사 조회
**GET** `/api/cultural-events/filter/{filter}`

#### 요청 파라미터
- `filter` (string, path): 필터 타입 ("indoor", "outdoor", "all")
- `page` (number, optional): 페이지 번호 (기본값: 1)
- `limit` (number, optional): 페이지당 항목 수 (기본값: 10)

#### 추가 필터 (쿼리 파라미터)
- `categories` (string[], optional): 카테고리 목록 (예: ["전시", "공연"])
- `distance` (number, optional): 거리 반경 (km)
- `age` (string, optional): 연령대 ("all", "child", "teen", "adult")
- `timeRange` (string, optional): 시간대 ("all", "morning", "afternoon", "evening")

#### 응답 형식
```json
[
  {
    "id": 1,
    "title": "디지털 아트 전시회",
    "category": "전시",
    "isIndoor": true,
    "location": "서울시립미술관",
    "date": "2025.10.27 - 11.30",
    "time": "10:00 - 18:00",
    "image": "https://example.com/image.jpg",
    "distance": "약 2.5km"
  },
  ...
]
```

#### 응답 필드 설명
- `id` (number): 행사 ID
- `title` (string): 행사 제목
- `category` (string): 카테고리 ("전시", "공연", "축제", "교육", "체험", "기타")
- `isIndoor` (boolean): 실내/실외 여부 (true: 실내, false: 실외)
- `location` (string): 장소명
- `date` (string): 날짜 (형식: "YYYY.MM.DD" 또는 "YYYY.MM.DD - MM.DD")
- `time` (string): 시간 (형식: "HH:MM - HH:MM")
- `image` (string): 이미지 URL
- `distance` (string): 현재 위치로부터의 거리

---

## 인증

현재는 인증 없이도 요청할 수 있도록 설정되어 있습니다.
추후 인증이 필요하면 JWT 토큰을 Header에 추가해야 합니다:

```
Authorization: Bearer <token>
```

---

## 환경 변수

프론트엔드 `.env` 파일:
```
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

백엔드에서 다음 엔드포인트를 구현해야 합니다:
- `GET /api/weather/current`
- `GET /api/weather/air-quality`
- `GET /api/cultural-events/filter/:filter`

---

## 에러 처리

### 에러 응답 형식
```json
{
  "message": "에러 메시지",
  "status": 400
}
```

### HTTP 상태 코드
- `200`: 성공
- `400`: 잘못된 요청
- `404`: 리소스를 찾을 수 없음
- `500`: 서버 내부 오류

