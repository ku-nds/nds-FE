import axiosClient from './axiosClient';

// 문화행사 관련 API
export const culturalEventApi = {
  // 전체 문화행사 목록 조회
  getEvents: (params) => {
    return axiosClient.get('/cultural-events', { params });
  },

  // 추천 문화행사 조회 (날씨 기반)
  getRecommendedEvents: (params) => {
    return axiosClient.get('/cultural-events/recommended', { params });
  },

  // 위치 기반 문화행사 조회
  getEventsByLocation: (latitude, longitude, params) => {
    return axiosClient.get('/cultural-events/by-location', {
      params: { latitude, longitude, ...params }
    });
  },

  // 필터링된 문화행사 조회 (실내/실외/전체)
  getFilteredEvents: (filter, params) => {
    return axiosClient.get(`/cultural-events/filter/${filter}`, { params });
  },

  // 문화행사 상세 조회
  getEventDetail: (eventId) => {
    return axiosClient.get(`/cultural-events/${eventId}`);
  },
};

