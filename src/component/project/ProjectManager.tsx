// src/component/project/ProjectManager.tsx

import React, { useState, useMemo, useEffect } from 'react';
import styles from '../style/ProjectManager.module.css';
import FormProjectModal from '../form/FormAddProjectManager'; 
import ConfirmationModal from '../form/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- THAY ĐỔI: Hằng số đã có ---
const PROJECTS_PER_PAGE = 5;

// Component ActionButtons (Không đổi)
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

// --- THAY ĐỔI: Thêm component Pagination ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Logic hiển thị đơn giản (có thể cải tiến thêm "...")
  const visiblePages = pageNumbers.filter(number => {
    if (totalPages <= 7) return true;
    if (currentPage <= 4) return number <= 5 || number === totalPages;
    if (currentPage >= totalPages - 3) return number >= totalPages - 4 || number === 1;
    return Math.abs(number - currentPage) <= 1 || number === 1 || number === totalPages;
  });

  const pageButtons = [];
  let lastAddedPage = 0;

  visiblePages.forEach((number) => {
    if (lastAddedPage !== 0 && number - lastAddedPage > 1) {
      pageButtons.push(
        <span key={`ellipsis-${lastAddedPage}`} className={styles.pageEllipsis}>...</span>
      );
    }
    pageButtons.push(
      <button
        key={number}
        onClick={() => onPageChange(number)}
        className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
      >
        {number}
      </button>
    );
    lastAddedPage = number;
  });


  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
      >
        &lt;
      </button>
      
      {pageButtons}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
      >
        &gt;
      </button>
    </div>
  );
};


const ProjectManager = () => {
  // State (Không đổi)
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  const navigate = useNavigate();

  // Logic fetch (Không đổi từ lần trước)
  const fetchProjects = async () => {
    try {
      const loggedInUserId = localStorage.getItem('loggedInUserId');
      if (!loggedInUserId) {
        navigate('/login');
        return; 
      }
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/projects');
      const allProjects = response.data;

      const userIsProjectOwner = (project) => {
        return project.members.some(member => 
          member.userId == loggedInUserId && member.role === 'Project owner'
        );
      };
      
      const filteredProjects = allProjects.filter(userIsProjectOwner);
      setProjects(filteredProjects);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [navigate]);

  // Handlers (Không đổi)
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
      // Tải lại dữ liệu sau khi xóa
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setProjectToDelete(null);
    }
  };
  const handleSaveProject = (savedProject) => {
    // Tải lại dữ liệu sau khi lưu
    fetchProjects();
  };

  // --- THAY ĐỔI: Thêm handler cho tìm kiếm và phân trang ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Quay về trang 1 khi tìm kiếm
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // --- THAY ĐỔI: Tính toán dữ liệu hiển thị bằng useMemo ---
  const filteredProjects = useMemo(() => {
    return projects.filter(project =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, currentPage]);
  // --- KẾT THÚC THAY ĐỔI ---


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
            // --- THAY ĐỔI: Kích hoạt onChange ---
            onChange={handleSearchChange} 
            className={styles.searchInput}
          />
        </div>
        <h3>Danh Sách Dự Án (Các dự án bạn làm chủ)</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Dự Án</th>
              <th className={styles.actionHeader}>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {/* --- THAY ĐỔI: Map qua 'currentProjects' --- */}
            {currentProjects.map((project) => (
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
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                  {projects.length === 0 
                    ? 'Bạn không phải là "Project owner" của bất kỳ dự án nào.'
                    : 'Không tìm thấy dự án nào phù hợp.'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}

      </div>

      {isModalOpen && (
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