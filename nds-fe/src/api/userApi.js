import axiosClient from './axiosClient';

// 사용자 관련 API
export const userApi = {
  // 로그인
  login: (credentials) => {
    return axiosClient.post('/auth/login', credentials);
  },

  // 로그아웃
  logout: () => {
    return axiosClient.post('/auth/logout');
  },

  // 회원가입
  signup: (userData) => {
    return axiosClient.post('/auth/signup', userData);
  },

  // 사용자 정보 조회
  getUserInfo: (userId) => {
    return axiosClient.get(`/users/${userId}`);
  },

  // 사용자 정보 수정
  updateUserInfo: (userId, userData) => {
    return axiosClient.put(`/users/${userId}`, userData);
  },
};

