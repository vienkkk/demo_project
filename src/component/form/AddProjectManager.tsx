import React, { useState } from 'react';

// --- ĐỊNH NGHĨA CÁC STYLE OBJECT (Không thay đổi) ---
const styles = {
  modalOverlay: {
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
    marginBlock: 0, // Xoá margin mặc định của thẻ <p>
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

// --- COMPONENT ---
function AddProjectModal({ onClose }) {
  // State cho dữ liệu form
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    projectImage: null,
  });

  // State cho lỗi (dùng object)
  const [errors, setErrors] = useState({});

  // Hàm xử lý khi người dùng nhập liệu
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    
    // Cập nhật dữ liệu vào state formData
    setFormData(prev => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
    
    // ✨ UX: Xóa lỗi của trường đang nhập để người dùng thấy phản hồi ngay lập tức
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  // Hàm kiểm tra lỗi
  const validateForm = () => {
    const newErrors = {};
    // Dùng .trim() để loại bỏ khoảng trắng thừa ở đầu và cuối
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Tên dự án không được để trống.';
    }
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Mô tả dự án không được để trống.';
    }
    // Bạn có thể thêm validation cho hình ảnh nếu cần
    // if (!formData.projectImage) {
    //   newErrors.projectImage = 'Vui lòng chọn hình ảnh.';
    // }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Bước 1: Kiểm tra lỗi
    const formErrors = validateForm();
    
    // Bước 2: Kiểm tra xem object lỗi có rỗng hay không
    if (Object.keys(formErrors).length > 0) {
      // Nếu có lỗi, cập nhật state errors và dừng lại
      setErrors(formErrors);
    } else {
      // Nếu không có lỗi, xử lý logic gửi form
      console.log('Form hợp lệ, đang gửi dữ liệu:', formData);
      // Đóng modal sau khi xử lý xong
      onClose();
    }
  };
  
  // Style linh hoạt cho các input
  const inputStyle = (fieldName) => ({
    ...styles.input,
    ...(errors[fieldName] && { borderColor: '#ef4444' }),
  });
  
  const textareaStyle = (fieldName) => ({
    ...styles.textarea,
    ...(errors[fieldName] && { borderColor: '#ef4444' }),
  });


  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <form onSubmit={handleSubmit} noValidate> {/* noValidate để tắt validation mặc định của trình duyệt */}
          {/* Header */}
          <div style={styles.modalHeader}>
            <h2 style={styles.h2}>Thêm/sửa dự án</h2>
            <button type="button" style={styles.closeButton} onClick={onClose}>&times;</button>
          </div>

          {/* Body */}
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
              <label htmlFor="projectImage" style={styles.label}>Hình ảnh dự án</label>
              <input 
                type="file" 
                id="projectImage" 
                onChange={handleChange} 
                style={inputStyle('projectImage')}
              />
               {errors.projectImage && <p style={styles.errorMessage}>{errors.projectImage}</p>}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="projectDescription" style={styles.label}>Mô tả dự án</label>
              <textarea
                id="projectDescription"
                rows="4"
                value={formData.projectDescription}
                onChange={handleChange}
                style={textareaStyle('projectDescription')}
              ></textarea>
              {errors.projectDescription && <p style={styles.errorMessage}>{errors.projectDescription}</p>}
            </div>
          </div>

          {/* Footer */}
          <div style={styles.modalFooter}>
            <button type="button" style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onClose}>
              Huỷ
            </button>
            <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProjectModal;