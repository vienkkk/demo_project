// src/component/nav/Navbar.tsx
import React, { useState } from 'react'; // --- SỬA ĐỔI: Thêm useState ---
import styles from '../style/ProjectStyles.module.css'; 
import { useNavigate } from 'react-router-dom';

// --- THÊM MỚI: Định nghĩa style cho overlay và GIF ---
const gifOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Nền mờ
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999, // Đảm bảo luôn ở trên cùng
};

const gifStyle: React.CSSProperties = {
  maxWidth: '300px',
  width: '80%',
  height: 'auto',
  borderRadius: '8px',
};
// --- KẾT THÚC THÊM MỚI ---

const Navbar = () => {
  const navigate = useNavigate();
  // --- THÊM MỚI: State để quản lý hiển thị GIF ---
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // --- SỬA ĐỔI: Thêm setTimeout vào hàm logout ---
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    
    setIsLoggingOut(true); // 1. Hiển thị GIF
    
    // 2. Đặt hẹn giờ 2 giây (2000ms)
    setTimeout(() => {
      localStorage.removeItem('loggedInUserId'); // 3. Xóa localStorage
      navigate('/login'); // 4. Chuyển trang
      // Không cần setIsLoggingOut(false) vì trang đã chuyển
    }, 2000); 
  };

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };
  
  return (
    // --- SỬA ĐỔI: Thêm React.Fragment <>...</> ---
    <>
      <div className={styles.headerBar}>
        <h2>Quan li du an nhom</h2>
        <div>
            <a href="/project-manager" onClick={(e) => handleNavigate(e, '/project-manager')} className={styles.headerLink}>Dự Án</a>
            <a href="#tasks" className={styles.headerLink}>Nhiệm Vụ của tôi</a>
            <a href="/login" onClick={handleLogout} className={styles.headerLink}>Đăng Xuất</a>
        </div>
      </div>

      {/* --- THÊM MỚI: Hiển thị overlay GIF khi isLoggingOut là true --- */}
      {isLoggingOut && (
        <div style={gifOverlayStyle}>
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d2czOGc4cTltbHI4MGVyd3plcWw4dDhuMnFsNnphZm03NXdhZWVxMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3otOKQnXCr85pILu8M/giphy.gif" 
            alt="Đang đăng xuất..." 
            style={gifStyle}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;