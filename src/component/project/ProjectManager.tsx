// src/component/project/ProjectManager.tsx

import React, { useState, useMemo, useEffect } from 'react';
import styles from '../style/ProjectManager.module.css';
// ✨ SỬA LỖI: Đổi tên import cho đúng
import FormProjectModal from '../form/FormAddProjectManager'; 
import ConfirmationModal from '../form/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ... (Component ActionButtons và các hằng số không thay đổi)
const PROJECTS_PER_PAGE = 5;

const ActionButtons = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.btnGroup}>
      <button onClick={() => onEdit(project)} className={`${styles.btnAction} ${styles.btnEdit}`}>
        Sửa
      </button>
      <button onClick={() => onDelete(project)} className={`${styles.btnAction} ${styles.btnDelete}`}>
        Xóa
      </button>
      <button onClick={() => navigate(`/project-detail/${project.id}`)} className={`${styles.btnAction} ${styles.btnDetail}`}>
        Chi tiết
      </button>
    </div>
  );
};


const ProjectManager = () => {
  // ... (Toàn bộ state và logic useEffect, handlers giữ nguyên)
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/projects');
      setProjects(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };
  
  const handleDeleteRequest = (project) => {
    setProjectToDelete(project);
  };
  
  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await axios.delete(`http://localhost:3001/projects/${projectToDelete.id}`);
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectToDelete.id));
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setProjectToDelete(null);
    }
  };

  const handleSaveProject = (savedProject) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => (p.id === savedProject.id ? savedProject : p)));
    } else {
      setProjects(prev => [...prev, savedProject]);
    }
  };


  if (isLoading) return <div className={styles.card}><p>Loading projects...</p></div>;
  if (error) return <div className={styles.card}><p>Error fetching data: {error}</p></div>;

  return (
    <>
      <div className={styles.card}>
        <h2 className={styles.pageTitle}>Quản Lý Dự Án Nhóm</h2>
        <div className={styles.controls}>
          <button onClick={handleOpenAddModal} className={styles.addButton}>
            + Thêm Dự Án
          </button>
          <input
            type="text"
            placeholder="Tìm kiếm dự án"
            value={searchTerm}
            // onChange={handleSearchChange} // Bạn có thể bỏ comment dòng này nếu muốn dùng lại chức năng search
            className={styles.searchInput}
          />
        </div>
        <h3>Danh Sách Dự Án</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Dự Án</th>
              <th className={styles.actionHeader}>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.projectName}</td>
                <td className={`${styles.tableTd} ${styles.actionCell}`}>
                  <ActionButtons 
                    project={project} 
                    onEdit={handleOpenEditModal} 
                    onDelete={handleDeleteRequest}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        // ✨ SỬA LỖI: Dùng đúng tên component đã import
        <FormProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveProject}
          project={editingProject} 
          existingProjects={projects} 
        />
      )}
      
      {projectToDelete && (
        <ConfirmationModal
          message={`Bạn có chắc chắn muốn xóa dự án "${projectToDelete.projectName}" không?`}
          onConfirm={confirmDelete}
          onClose={() => setProjectToDelete(null)}
        />
      )}
    </>
  );
};

export default ProjectManager;