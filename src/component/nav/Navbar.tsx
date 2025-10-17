import React from 'react';
import styles from '../style/ProjectStyles.module.css'; // Import styles

const Navbar = () => {
  return (
    <div className={styles.headerBar}>
      <h2>Quan li du an nhom</h2>
      <div>
          <a href="#projects" className={styles.headerLink}>Dự Án</a>
      <a href="#tasks" className={styles.headerLink}>Nhiệm Vụ của tôi</a>
      <a href="#logout" className={styles.headerLink}>Đăng Xuất</a>
      </div>
    </div>
  );
};

export default Navbar;