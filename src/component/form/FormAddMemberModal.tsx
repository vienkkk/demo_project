// src/component/form/FormAddMemberModal.tsx
import React, { useState, useMemo } from 'react';
import axios from 'axios';

// --- STYLE OBJECTS (Sử dụng lại style từ các modal khác) ---
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
      padding: '20px',
      borderRadius: '8px',
      width: '480px',
      maxWidth: '95%',
      backgroundColor: 'white', // Thêm nền trắng
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '1px solid #e5e7eb',
    },
    h2: {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.75rem',
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
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9rem',
    },
    select: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9rem',
      backgroundColor: 'white',
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
      padding: '8px 20px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: 600,
      cursor: 'pointer',
    },
    buttonSecondary: {
      backgroundColor: '#6c757d',
      color: 'white',
    },
    buttonPrimary: {
      backgroundColor: '#0d6efd',
      color: 'white',
    },
};
// --- KẾT THÚC STYLE ---

interface FormAddMemberProps {
  onClose: () => void;
  onSave: (updatedProject: any) => void;
  project: any;
  allUsers: any[];
}

const FormAddMemberModal: React.FC<FormAddMemberProps> = ({ onClose, onSave, project, allUsers = [] }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState<any>({});

  // Lọc ra danh sách user chưa có trong dự án
  const availableUsers = useMemo(() => {
    const memberIds = new Set(project.members.map(m => m.userId.toString()));
    return allUsers.filter(user => !memberIds.has(user.id.toString()));
  }, [allUsers, project.members]);

  const validateForm = () => {
    const newErrors: any = {};
    if (!selectedUserId) {
      newErrors.selectedUserId = 'Vui lòng chọn thành viên.';
    }
    if (!role.trim()) {
      newErrors.role = 'Vai trò không được để trống.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const newMember = {
      userId: parseInt(selectedUserId),
      role: role,
    };

    const updatedMembers = [...project.members, newMember];
    const updatedProject = { ...project, members: updatedMembers };

    try {
      const response = await axios.put(`http://localhost:3001/projects/${project.id}`, updatedProject);
      onSave(response.data); // Gửi dự án đã cập nhật về component cha
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Failed to add member:", error);
      setErrors({ form: 'Không thể thêm thành viên. Vui lòng thử lại.' });
    }
  };
  
  const inputStyle = (fieldName) => ({
    ...styles.input,
    ...(errors[fieldName] && { borderColor: '#ef4444' }),
  });
  
  const selectStyle = (fieldName) => ({
    ...styles.select,
    ...(errors[fieldName] && { borderColor: '#ef4444' }),
  });

  return (
    <div style={styles.overlay}>
      <div style={styles.modalContent}>
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.modalHeader}>
            <h2 style={styles.h2}>Thêm thành viên</h2>
            <button type="button" style={styles.closeButton} onClick={onClose}>&times;</button>
          </div>

          <div style={styles.modalBody}>
            {/* Chọn thành viên */}
            <div style={styles.formGroup}>
              <label htmlFor="selectedUserId" style={styles.label}>Thành viên</label>
              <select
                id="selectedUserId"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                style={selectStyle('selectedUserId')}
              >
                <option value="">Chọn thành viên...</option>
                {availableUsers.length > 0 ? (
                  availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.fullName} ({user.email})</option>
                  ))
                ) : (
                  <option disabled>Không còn thành viên nào để thêm</option>
                )}
              </select>
              {errors.selectedUserId && <p style={styles.errorMessage}>{errors.selectedUserId}</p>}
            </div>

            {/* Vai trò */}
            <div style={styles.formGroup}>
              <label htmlFor="role" style={styles.label}>Vai trò</label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={inputStyle('role')}
                placeholder="VD: Frontend Developer, Tester..."
              />
              {errors.role && <p style={styles.errorMessage}>{errors.role}</p>}
            </div>
            
            {errors.form && <p style={styles.errorMessage}>{errors.form}</p>}
          </div>

          <div style={styles.modalFooter}>
            <button type="button" style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onClose}>Huỷ</button>
            <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>Thêm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddMemberModal;