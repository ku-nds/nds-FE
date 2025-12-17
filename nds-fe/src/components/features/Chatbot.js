import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: '안녕하세요! 궁금한 점이 있으신가요?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessages = [...messages, { text: inputValue, sender: 'user' }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { 
        text: (
        <>
          고객님이 선호하시는 공연이 있는 축제 추천드리겠습니다.  
          현재 위치와 인접한 축제를 추천드리겠습니다.
          <br /><br />

          <strong>
            축제명 : [광진문화재단] 제22회 한국을 빛내는 해외무용스타 초청공연
          </strong>
          <br />

          <strong>일시 :</strong> 2025.08.02(토) ~ 2025.08.03(일)
          <br />

          <strong>링크 :{" "}</strong>
          <a
            href="https://www.naruart.or.kr/exhibition/program_view.php?page=1&sch_tab=date&sch_year=2025&sch_month=06&sch_notice=Y&idx=10152"
            target="_blank"
            rel="noopener noreferrer"
          >
            바로가기
          </a>

          <br /><br />

          <strong>
            축제명 : [광진문화재단] 2025 나루 동요제
          </strong>
          <br />

          <strong>일시 :</strong> [광진문화재단] 2025 나루 동요제
          <br />

          <strong>링크 :{" "}</strong>
          <a
            href="https://www.naruart.or.kr/exhibition/program_view.php?idx=10127"
            target="_blank"
            rel="noopener noreferrer"
          >
            바로가기
          </a>

          <br /><br />
          더 추천해드릴 축제가 있을까요? 😊
        </>
      ),
      sender: 'bot'

       }]);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle-button" onClick={toggleChatbot}>
        💬
      </button>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h2>축제 추천 챗봇</h2>
            <button className="chatbot-close-button" onClick={toggleChatbot}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input-area">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="메시지를 입력하세요..."
            />
            <button onClick={handleSendMessage}>전송</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
