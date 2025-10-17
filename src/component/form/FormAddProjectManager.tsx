// src/component/form/FormAddProjectManager.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- STYLE OBJECTS ---
const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
      width: '480px',
      maxWidth: '95%',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    h2: {
      margin: 0,
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '2rem',
      fontWeight: 300,
      lineHeight: 1,
      color: '#6b7280',
      cursor: 'pointer',
    },
    modalBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      marginBottom: '5px',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#374151',
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9rem',
    },
    textarea: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9rem',
      minHeight: '80px',
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '0.75rem',
      marginTop: '4px',
      marginBlock: 0,
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '25px',
      paddingTop: '15px',
      borderTop: '1px solid #e5e7eb',
    },
    button: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: 600,
      cursor: 'pointer',
      color: 'white',
    },
    buttonSecondary: {
      backgroundColor: '#6c757d',
    },
    buttonPrimary: {
      backgroundColor: '#0d6efd',
    },
};

function FormProjectModal({ onClose, onSave, project, existingProjects }) {
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        image: '',
      });
      const [errors, setErrors] = useState({});
      const isEditing = !!project;
    
      useEffect(() => {
        if (isEditing) {
          setFormData({
            projectName: project.projectName || '',
            description: project.description || '',
            image: project.image || '',
          });
        }
      }, [project, isEditing]);
    
      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
          setErrors(prev => ({ ...prev, [id]: null }));
        }
      };
    
      const validateForm = () => {
        const newErrors = {};
        const trimmedName = formData.projectName.trim();
    
        if (!trimmedName) {
            newErrors.projectName = 'Tên dự án không được để trống.';
        } 
        else {
            const isDuplicate = existingProjects.some(
                p => p.projectName.toLowerCase() === trimmedName.toLowerCase() && p.id !== (project?.id)
            );
            if (isDuplicate) {
                newErrors.projectName = 'Tên dự án này đã tồn tại.';
            }
        }
    
        if (!formData.description.trim()) newErrors.description = 'Mô tả không được để trống.';
        
        return newErrors;
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          return;
        }
    
        try {
          let response;
          const dataToSave = {
            projectName: formData.projectName,
            description: formData.description,
            image: formData.image,
            members: isEditing ? project.members : [],
          };
    
          if (isEditing) {
            response = await axios.put(`http://localhost:3001/projects/${project.id}`, dataToSave);
          } else {
            const numericIds = existingProjects
                .map(p => parseInt(p.id, 10))
                .filter(id => !isNaN(id));
            const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
            const newProject = { ...dataToSave, id: (maxId + 1).toString() };
            response = await axios.post('http://localhost:3001/projects', newProject);
          }
          onSave(response.data);
          onClose();
    
        } catch (error) {
          console.error("Failed to save project:", error);
        }
      };
      
      const inputStyle = (fieldName) => ({
        ...styles.input,
        ...(errors[fieldName] && { borderColor: '#ef4444' }),
      });
      
      const textareaStyle = (fieldName) => ({
        ...styles.textarea,
        ...(errors[fieldName] && { borderColor: '#ef4444' }),
      });
    
    return (
        <div style={styles.overlay}>
            <div style={styles.modalContent}>
                <form onSubmit={handleSubmit} noValidate>
                    <div style={styles.modalHeader}>
            <h2 style={styles.h2}>{isEditing ? 'Sửa Dự Án' : 'Thêm Dự Án Mới'}</h2>
            <button type="button" style={styles.closeButton} onClick={onClose}>&times;</button>
          </div>

          <div style={styles.modalBody}>
            <div style={styles.formGroup}>
              <label htmlFor="projectName" style={styles.label}>Tên dự án</label>
              <input
                type="text"
                id="projectName"
                value={formData.projectName}
                onChange={handleChange}
                style={inputStyle('projectName')}
              />
              {errors.projectName && <p style={styles.errorMessage}>{errors.projectName}</p>}
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="description" style={styles.label}>Mô tả</label>
              <textarea
                id="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                style={textareaStyle('description')}
              ></textarea>
              {errors.description && <p style={styles.errorMessage}>{errors.description}</p>}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="image" style={styles.label}>URL Hình ảnh</label>
              <input
                type="text"
                id="image"
                value={formData.image}
                onChange={handleChange}
                style={inputStyle('image')}
              />
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button type="button" style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onClose}>Huỷ</button>
            <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>Lưu</button>
          </div>
                </form>
            </div>
        </div>
    );
}

export default FormProjectModal;