// src/component/project/ProjectManager.tsx

import React, { useState, useMemo, useEffect } from 'react';
import styles from '../style/ProjectManager.module.css';
import ProjectModal from '../form/FormAddProjectManager';
import ConfirmationModal from '../form/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ... (ActionButtons và các hằng số không đổi)
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
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchProjects = async () => {
    // ... (Hàm này giữ nguyên)
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ... (Các hàm CRUD và handler giữ nguyên)
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

  // ... (Các hàm và logic còn lại giữ nguyên)

  if (isLoading) return <div className={styles.card}><p>Loading projects...</p></div>;
  if (error) return <div className={styles.card}><p>Error fetching data: {error}</p></div>;

  return (
    <>
      <div className={styles.card}>
        {/* ... (Phần JSX của card giữ nguyên) */}
        <h2 className={styles.pageTitle}>Quản Lý Dự Án Nhóm</h2>
        <div className={styles.controls}>
          <button onClick={handleOpenAddModal} className={styles.addButton}>
            + Thêm Dự Án
          </button>
          <input
            type="text"
            placeholder="Tìm kiếm dự án"
            value={searchTerm}
            // onChange={handleSearchChange}
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
        {/* {filteredProjects.length > 0 && renderPagination()} */}
      </div>

      {isModalOpen && (
        <ProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveProject}
          project={editingProject} 
          // ✨ 3. Truyền danh sách dự án vào modal
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