// src/App.tsx

import './index.css';
import Register from './page/auth/Register';
import Login from './page/auth/Login';
import { Route, Routes } from 'react-router-dom';
import ProjectManagerGroup from './page/manager/project/ProjectManagerGroup';
import ProjectDetailPage from './page/manager/project/ProjectDetailPage'; // <-- Import trang mới

function App() {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/project-manager' element={<ProjectManagerGroup />} />
        <Route path='/project-detail' element={<ProjectDetailPage />} /> {/* <-- Thêm route mới */}
      </Routes>
    </>
  );
}

export default App;