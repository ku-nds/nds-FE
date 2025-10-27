import axiosClient from './axiosClient';

// 상품 관련 API
export const productApi = {
  // 상품 목록 조회
  getProducts: (params) => {
    return axiosClient.get('/products', { params });
  },

  // 상품 상세 조회
  getProduct: (productId) => {
    return axiosClient.get(`/products/${productId}`);
  },

  // 상품 생성
  createProduct: (productData) => {
    return axiosClient.post('/products', productData);
  },

  // 상품 수정
  updateProduct: (productId, productData) => {
    return axiosClient.put(`/products/${productId}`, productData);
  },

  // 상품 삭제
  deleteProduct: (productId) => {
    return axiosClient.delete(`/products/${productId}`);
  },
};

