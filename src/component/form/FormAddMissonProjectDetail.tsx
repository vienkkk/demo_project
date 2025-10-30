// src/component/form/FormAddMissonProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- STYLE OBJECTS (Giống với các modal khác của bạn) ---
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

// Định nghĩa kiểu dữ liệu cho props
interface FormAddTaskProps {
  onClose: () => void;
  onSave: (task: any) => void;
  taskToEdit?: any;
  users: any[];
  projectId: string;
}

const FormAddTask: React.FC<FormAddTaskProps> = ({ onClose, onSave, taskToEdit, users = [], projectId }) => {
  const [formData, setFormData] = useState({
    taskName: '',
    assigneeId: '',
    status: 'To do',
    assignDate: '',
    dueDate: '',
    priority: '',
    progress: '',
  });
  const [errors, setErrors] = useState<any>({});
  const isEditing = !!taskToEdit;

  useEffect(() => {
    if (isEditing) {
      // Nếu là chỉnh sửa, điền dữ liệu của task vào form
      setFormData({
        taskName: taskToEdit.taskName || '',
        assigneeId: taskToEdit.assigneeId || '',
        status: taskToEdit.status || 'To do',
        assignDate: taskToEdit.assignDate || '',
        dueDate: taskToEdit.dueDate || '',
        priority: taskToEdit.priority || '',
        progress: taskToEdit.progress || '',
      });
    }
  }, [taskToEdit, isEditing]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.taskName.trim()) {
      newErrors.taskName = 'Tên nhiệm vụ không được để trống.';
    }
    // Bạn có thể thêm các validation khác ở đây
    
    // Giả lập lỗi "đã tồn tại" như trong hình
    if (formData.taskName === "Soạn thảo đề cương dự án" && !isEditing) {
        newErrors.taskName = 'Tên nhiệm vụ đã tồn tại';
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

    const taskData = {
      ...formData,
      projectId: parseInt(projectId), // Đảm bảo projectId là số
      assigneeId: parseInt(formData.assigneeId) || null, // Đảm bảo assigneeId là số
    };

    try {
      let response;
      if (isEditing) {
        // Gọi API PUT để cập nhật
        response = await axios.put(`http://localhost:3001/tasks/${taskToEdit.id}`, taskData);
      } else {
        // Gọi API POST để tạo mới
        response = await axios.post('http://localhost:3001/tasks', taskData);
      }
      onSave(response.data); // Gửi task đã lưu về cho component cha
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Failed to save task:", error);
      setErrors({ form: 'Không thể lưu nhiệm vụ. Vui lòng thử lại.' });
    }
  };

  // Hàm helper để style cho input lỗi
  const inputStyle = (fieldName) => ({
    ...styles.input,
    ...(errors[fieldName] && { borderColor: '#ef4444' }),
  });
  
  return (
    <div style={styles.overlay}>
      <div style={styles.modalContent}>
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.modalHeader}>
            <h2 style={styles.h2}>{isEditing ? 'Sửa nhiệm vụ' : 'Thêm nhiệm vụ'}</h2>
            <button type="button" style={styles.closeButton} onClick={onClose}>&times;</button>
          </div>

          <div style={styles.modalBody}>
            {/* Tên nhiệm vụ */}
            <div style={styles.formGroup}>
              <label htmlFor="taskName" style={styles.label}>Tên nhiệm vụ</label>
              <input
                type="text"
                id="taskName"
                value={formData.taskName}
                onChange={handleChange}
                style={inputStyle('taskName')} // Áp dụng style lỗi
              />
              {errors.taskName && <p style={styles.errorMessage}>{errors.taskName}</p>}
            </div>
            
            {/* Người phụ trách */}
            <div style={styles.formGroup}>
              <label htmlFor="assigneeId" style={styles.label}>Người phụ trách</label>
              <select
                id="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Chọn người phụ trách</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.fullName}</option>
                ))}
              </select>
            </div>

            {/* Trạng thái */}
            <div style={styles.formGroup}>
              <label htmlFor="status" style={styles.label}>Trạng thái</label>
              <select id="status" value={formData.status} onChange={handleChange} style={styles.select}>
                <option value="To do">To do</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Ngày bắt đầu */}
            <div style={styles.formGroup}>
              <label htmlFor="assignDate" style={styles.label}>Ngày bắt đầu</label>
              <input
                type="date" // Dùng type="date" để cóปฏิทิน
                id="assignDate"
                value={formData.assignDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Hạn cuối */}
            <div style={styles.formGroup}>
              <label htmlFor="dueDate" style={styles.label}>Hạn cuối</label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Độ ưu tiên */}
            <div style={styles.formGroup}>
              <label htmlFor="priority" style={styles.label}>Độ ưu tiên</label>
              <select id="priority" value={formData.priority} onChange={handleChange} style={styles.select}>
                <option value="">Chọn độ ưu tiên</option>
                <option value="Thấp">Thấp</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Cao">Cao</option>
              </select>
            </div>

            {/* Tiến độ */}
            <div style={styles.formGroup}>
              <label htmlFor="progress" style={styles.label}>Tiến độ</label>
              <select id="progress" value={formData.progress} onChange={handleChange} style={styles.select}>
                <option value="">Chọn tiến độ</option>
                <option value="Đúng tiến độ">Đúng tiến độ</option>
                <option value="Có rủi ro">Có rủi ro</option>
                <option value="Trễ hạn">Trễ hạn</option>
              </select>
            </div>

            {errors.form && <p style={styles.errorMessage}>{errors.form}</p>}
          </div>

          <div style={styles.modalFooter}>
            <button type="button" style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onClose}>Huỷ</button>
            <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddTask;