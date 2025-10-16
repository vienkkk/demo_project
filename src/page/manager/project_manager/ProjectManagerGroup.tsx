import React from 'react'
import ProjectManager from '../../../component/project/ProjectManager'
import'../../../component/style/ProjectStyles.module.css'
import Navbar from '../../../component/nav/Navbar'
import Footer from '../../../component/footer/Footer'

function ProjectManagerGroup() {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <ProjectManager /> 
      <Footer/>
    </div>
  )
}

export default ProjectManagerGroup
