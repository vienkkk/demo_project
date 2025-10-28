// src/page/manager/project_detail/ProjectDetailPage.tsx

import React from 'react';
import Navbar from '../../../component/nav/Navbar';
import Footer from '../../../component/footer/Footer';
import ProjectDetail from '../../../component/project/ProjectDetail';
import styles from '../../../component/style/ProjectStyles.module.css';

function ProjectDetailPage() {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <ProjectDetail /> 
      <Footer />
    </div>
  );
}

export default ProjectDetailPage;