// src/utils/regionMapper.js

/**
 * 구(자치구) -> 권역 매핑 (제공해주신 목록 기반)
 * 키는 "광진구" 형태(공백/대소문자 정규화 필요)
 */
const GU_TO_REGION = {
  '용산구': '도심권',
  '은평구': '서북권',
  '서대문구': '서북권',
  '마포구': '서북권',
  '광진구': '동북권',
  '성동구': '동북권',
  '중랑구': '동북권',
  '동대문구': '동북권',
  '성북구': '동북권',
  '도봉구': '동북권',
  '강북구': '동북권',
  '노원구': '동북권',
  '강서구': '서남권',
  '구로구': '서남권',
  '영등포구': '서남권',
  '동작구': '서남권',
  '관악구': '서남권',
  '금천구': '서남권',
  '양천구': '서남권',
  '강남구': '동남권',
  '서초구': '동남권',
  '송파구': '동남권',
  '강동구': '동남권'
};

/**
 * 주소 문자열에서 "구" 이름을 추출
 * - "서울특별시 광진구", "광진구", "서울 광진구 화양동" 등 다양한 포맷 처리
 * @param {string} address
 * @returns {string} 추출된 구 문자열 (예: "광진구") 또는 '' (없으면 빈 문자열)
 */
export const extractGuFromAddress = (address) => {
  if (!address || typeof address !== 'string') return '';

  // 정규화: 양쪽 공백 제거, 연속 공백을 한 칸으로
  const normalized = address.trim().replace(/\s+/g, ' ');

  // 1) "광진구" 같은 패턴 우선 탐색 (한글 끝에 '구' 포함)
  const match = normalized.match(/([가-힣]{2,}구)\b/);
  if (match && match[1]) {
    return match[1].trim();
  }

  // 2) 만약 '시' 또는 다른 포맷이면 토큰별로 찾아보기
  const tokens = normalized.split(/\s+/);
  for (const t of tokens) {
    if (/^[가-힣]{2,}구$/.test(t)) return t;
  }

  // 못 찾으면 빈 문자열 반환
  return '';
};

/**
 * 주소 문자열 -> { region, gu } 반환
 * - region: 매핑된 권역 (예: '동북권') 또는 '' (매핑 없으면 빈문자열)
 * - gu: 추출된 구 (예: '광진구') 또는 '' 
 * @param {string} address
 * @returns {{region: string, gu: string}}
 */
export const mapAddressToRegion = (address) => {
  const gu = extractGuFromAddress(address);
  if (!gu) return { region: '', gu: '' };

  // 매핑(대소문자/공백 정규화)
  const normGu = gu.trim();
  const region = GU_TO_REGION[normGu] || '';

  return { region, gu: normGu };
};
