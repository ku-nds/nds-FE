import axios from 'axios';

// Axios 인스턴스 생성
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - 요청 전 처리
axiosClient.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - 응답 후 처리
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized - 토큰 만료 등
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
    
    // 403 Forbidden
    if (error.response?.status === 403) {
      console.error('접근 권한이 없습니다.');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

