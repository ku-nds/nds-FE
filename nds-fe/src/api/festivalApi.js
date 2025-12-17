import axiosClient from './axiosClient';

/**
 * 선택된 축제들의 최단 경로를 가져옵니다.
 * @param {number[]} festival_ids - 선택된 축제 ID의 배열
 * @returns {Promise<object>} 최적 경로와 총 거리를 포함하는 객체
 */
export const findShortestPath = async (festival_ids) => {
  if (!Array.isArray(festival_ids) || festival_ids.length < 2) {
    throw new Error('최소 2개 이상의 축제를 선택해야 합니다.');
  }

  try {
    const response = await axiosClient.post('/api/festivals/route', { festival_ids });
    return response.data;
  } catch (error) {
    console.error('최단 경로를 가져오는 데 실패했습니다:', error);
    throw error;
  }
};
