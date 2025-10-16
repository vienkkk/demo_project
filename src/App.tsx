import { useState } from 'react'
import'./index.css'
import Register from './page/auth/Register'
import Login from './page/auth/Login'
import { Route, Routes } from 'react-router-dom'
import ProjectManager from './page/manager/project_manager/ProjectManagerGroup'
import ProjectManagerGroup from './page/manager/project_manager/ProjectManagerGroup'


function App() {


  return (
    <>
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/project-manager' element = {<ProjectManagerGroup/>}/>
    </Routes>
    </>
  )
}

export default App
