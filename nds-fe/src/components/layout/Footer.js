import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4 className="footer-title">데이터 출처</h4>
          <p className="footer-text">서울시 공공데이터포털</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">최종 업데이트</h4>
          <p className="footer-text">2025년 10월 27일</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">클라우드 웹 서비스 8팀</h4>
          <p className="footer-text">010-5466-9471</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 서울 스마트시티. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

