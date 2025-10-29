// src/component/nav/Navbar.tsx
import React from 'react';
import styles from '../style/ProjectStyles.module.css'; // Import styles
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // --- THAY ĐỔI: THÊM HÀM LOGOUT ---
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Ngăn thẻ <a> tải lại trang
    localStorage.removeItem('loggedInUserId');
    navigate('/login');
  };

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };
  // ---------------------------------
  
  return (
    <div className={styles.headerBar}>
      <h2>Quan li du an nhom</h2>
      <div>
          {/* --- THAY ĐỔI: SỬ DỤNG HANDLER --- */}
          <a href="/project-manager" onClick={(e) => handleNavigate(e, '/project-manager')} className={styles.headerLink}>Dự Án</a>
          <a href="#tasks" className={styles.headerLink}>Nhiệm Vụ của tôi</a>
          <a href="/login" onClick={handleLogout} className={styles.headerLink}>Đăng Xuất</a>
          {/* --------------------------------- */}
      </div>
    </div>
  );
};

export default Navbar;