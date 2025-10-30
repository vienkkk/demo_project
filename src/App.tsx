// src/App.tsx

import "./index.css";
import Register from "./page/auth/Register";
import Login from "./page/auth/Login";
import { Route, Routes, Navigate } from "react-router-dom"; // Thêm Navigate
import ProjectManagerGroup from "./page/manager/project/ProjectManagerGroup";
import ProjectDetailPage from "./page/manager/project/ProjectDetailPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/project-manager" />} />
        <Route path="*" element={<Navigate to="/project-manager" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/project-manager" element={<ProjectManagerGroup />} />
        <Route
          path="/project-detail/:projectId"
          element={<ProjectDetailPage />}
        />
      </Routes>
    </>
  );
}

export default App;
