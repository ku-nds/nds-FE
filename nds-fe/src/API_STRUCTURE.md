# API 구조 가이드

이 프로젝트는 axios를 사용한 체계적인 API 관리 구조를 가지고 있습니다.

## 📁 폴더 구조

```
src/
├── api/                      # API 관련 파일
│   ├── axiosClient.js        # axios 인스턴스 및 인터셉터 설정
│   ├── userApi.js            # 사용자 관련 API 호출 함수
│   ├── productApi.js         # 상품 관련 API 호출 함수
│   └── index.js              # API 모듈 export
│
├── components/               # 재사용 가능한 컴포넌트
│   ├── common/               # 공통 컴포넌트
│   ├── layout/               # 레이아웃 컴포넌트
│   └── features/             # 기능별 컴포넌트
│
├── pages/                    # 페이지 컴포넌트
│
├── hooks/                    # 커스텀 훅
│   ├── useApi.js             # API 호출 관리 훅
│   └── ...
│
├── utils/                    # 유틸리티 함수
│   ├── apiHelper.js          # API 에러 처리 헬퍼
│   └── ...
│
├── constants/                # 상수 정의
│   └── index.js              # API 엔드포인트, 에러 메시지 등
│
└── assets/                   # 정적 파일
```

## 🔧 API 사용 방법

### 1. 기본 API 호출

```javascript
import { userApi, productApi } from './api';

// GET 요청
const getUserInfo = async (userId) => {
  try {
    const response = await userApi.getUserInfo(userId);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// POST 요청
const login = async (credentials) => {
  try {
    const response = await userApi.login(credentials);
    localStorage.setItem('token', response.data.token);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 2. 커스텀 훅 사용 (권장)

```javascript
import { useApi } from './hooks/useApi';
import { productApi } from './api';

function ProductList() {
  const { data, loading, error, refetch } = useApi(productApi.getProducts);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      {data.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      <button onClick={refetch}>새로고침</button>
    </div>
  );
}
```

### 3. React 컴포넌트에서 직접 사용

```javascript
import { useState, useEffect } from 'react';
import { userApi } from './api';
import { handleApiError } from './utils/apiHelper';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await userApi.getUserInfo(userId);
        setUser(response.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!user) return null;

  return <div>{user.name}</div>;
}
```

## ⚙️ 환경 변수 설정

`.env` 파일을 생성하여 API 기본 URL을 설정합니다.

```
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

## 🔐 인증 처리

`axiosClient.js`의 인터셉터가 자동으로:
- 요청 전: localStorage의 token을 헤더에 추가
- 응답 후: 401 에러 발생 시 자동 로그아웃 처리

## 🎯 새로운 API 추가 방법

1. `api/` 폴더에 새로운 파일 생성 (예: `orderApi.js`)
2. `axiosClient`를 사용하여 함수 작성
3. `api/index.js`에 export 추가
4. 필요한 곳에서 import하여 사용

```javascript
// api/orderApi.js
import axiosClient from './axiosClient';

export const orderApi = {
  getOrders: () => {
    return axiosClient.get('/orders');
  },
  createOrder: (orderData) => {
    return axiosClient.post('/orders', orderData);
  },
};
```

## 💡 Best Practices

1. **API 함수는 api/ 폴더에 집중**: 비즈니스 로직과 API 호출 분리
2. **커스텀 훅 활용**: 반복적인 로딩/에러 상태 관리 간소화
3. **에러 처리 통일**: `handleApiError` 사용
4. **상수 활용**: 엔드포인트는 `constants`에서 관리
5. **인터셉터 활용**: 공통 로직은 인터셉터에서 처리

