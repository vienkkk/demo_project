import React from 'react';
import styles from '../style/ProjectStyles.module.css'; // Import styles
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.headerBar}>
      <h2>Quan li du an nhom</h2>
      <div>
          <a href="" onClick={()=>navigate('project-manager')} className={styles.headerLink}>Dự Án</a>
          <a href="#tasks" className={styles.headerLink}>Nhiệm Vụ của tôi</a>
          <a href="" onClick={()=>navigate('/login')} className={styles.headerLink}>Đăng Xuất</a>
      </div>
    </div>
  );
};

export default Navbar;