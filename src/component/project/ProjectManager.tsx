import React, { useState, useMemo } from 'react';
import styles from '../style/ProjectManager.module.css';
import AddProjectModal from '../form/AddProjectManager';
const initialProjects = [
  { id: 1, name: 'Xây dựng website thương mại điện tử' },
  { id: 2, name: 'Phát triển ứng dụng di động' },
  { id: 3, name: 'Quản lý dữ liệu khách hàng' },
  { id: 4, name: 'Xây dựng website thương mại điện tử' },
  { id: 5, name: 'Phát triển ứng dụng di động' },
  { id: 6, name: 'Quản lý dữ liệu khách hàng' },
  { id: 7, name: 'Xây dựng website thương mại điện tử' },
  { id: 8, name: 'Phát triển ứng dụng di động' },
  { id: 9, name: 'Quản lý dữ liệu khách hàng' },
];

const PROJECTS_PER_PAGE = 5;
const ActionButtons = ({ projectId }) => {
  const handleAction = (action) => console.log(`${action} project ${projectId}`);
  
  return (
    <div className={styles.btnGroup}>
      <button 
        onClick={() => handleAction('Sửa')} 
        className={`${styles.btnAction} ${styles.btnEdit}`}
      >
        Sửa
      </button>
      <button 
        onClick={() => handleAction('Xóa')} 
        className={`${styles.btnAction} ${styles.btnDelete}`}
      >
        Xóa
      </button>
      <button 
        onClick={() => handleAction('Chi tiết')} 
        className={`${styles.btnAction} ${styles.btnDetail}`}
      >
        Chi tiết
      </button>
    </div>
  );
};

const ProjectManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Logic lọc và phân trang
  const filteredProjects = useMemo(() => {
    return initialProjects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const indexOfLastProject = currentPage * PROJECTS_PER_PAGE;
  const indexOfFirstProject = indexOfLastProject - PROJECTS_PER_PAGE;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  
  // Pagination Renderer
  const renderPagination = () => {
    const pagesToShow = Math.min(totalPages, 3);
    const pageButtons = [];
    for (let i = 1; i <= pagesToShow; i++) pageButtons.push(i);

    return (
        <div className={styles.paginationContainer}>
            {pageButtons.map(page => (
                <button 
                    key={page} 
                    onClick={() => handlePageChange(page)} 
                    className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
                >
                    {page}
                </button>
            ))}
            {totalPages > pagesToShow && <span className={styles.pageEllipsis}>...</span>}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
            >
                &gt;
            </button>
        </div>
    );
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.pageTitle}>Quản Lý Dự Án Nhóm</h2>
      
      {/* Controls Section */}
      <div className={styles.controls}>
        <button 
          onClick={AddProjectModal} 
          className={styles.addButton}
        >
          + Thêm Dự Án
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm dự án"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <h3>Danh Sách Dự Án</h3>
      
      {/* Table Section */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableTh}>ID</th>
            <th className={styles.tableTh}>Tên Dự Án</th>
            <th className={`${styles.tableTh} ${styles.actionHeader}`}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.length > 0 ? (
            currentProjects.map((project) => (
              <tr key={project.id}>
                <td className={styles.tableTd}>{project.id}</td>
                <td className={styles.tableTd}>{project.name}</td>
                <td className={`${styles.tableTd} ${styles.actionCell}`}>
                  <ActionButtons projectId={project.id} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className={styles.tableTd} style={{ textAlign: 'center' }}>
                Không tìm thấy dự án nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Section */}
      {filteredProjects.length > 0 && renderPagination()}
    </div>
  );
};

export default ProjectManager;