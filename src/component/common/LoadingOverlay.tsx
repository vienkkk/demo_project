// src/component/common/LoadingOverlay.tsx
import React from 'react';

// Định nghĩa style cho overlay và GIF
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Nền trắng mờ
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9998, // Dưới overlay logout một chút
  backdropFilter: 'blur(5px)', // Hiệu ứng mờ nền
};

const gifStyle: React.CSSProperties = {
  maxWidth: '200px',
  width: '50%',
  height: 'auto',
};

const LoadingOverlay: React.FC = () => {
  return (
    <div style={overlayStyle}>
      <img 
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHVjZWs3Nm52M3ZnZmRuZDNhcTFldGp3azFxOXIxa3o1OW51a3Z2ayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FaAxdPWZ7HKGmlnku7/giphy.gif" 
        alt="Đang tải..." 
        style={gifStyle}
      />
    </div>
  );
};

export default LoadingOverlay;