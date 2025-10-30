// src/component/form/ManageMembersModal.tsx
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
    padding: '24px',
    borderRadius: '8px',
    width: '600px', // Làm modal rộng hơn
    maxWidth: '95%',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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
    maxHeight: '60vh', // Giới hạn chiều cao và cho phép cuộn
    overflowY: 'auto',
  },
  memberListHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 10px',
    marginBottom: '8px',
  },
  memberHeaderLabel: {
    fontWeight: 500,
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  memberRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  memberInfo: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#0d6efd',
    fontSize: '0.9rem',
  },
  nameEmail: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontWeight: 500,
  },
  email: {
    fontSize: '0.8rem',
    color: '#6b7280',
  },
  roleInput: {
    width: '180px',
    padding: '6px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  addSection: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #e5e7eb',
  },
  addMemberButtonHeader: {
    background: 'none',
    border: 'none',
    color: '#0d6efd',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
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

interface ManageMembersProps {
  onClose: () => void;
  onSave: (updatedProject: any) => void;
  project: any;
  allUsers: any[];
}

const ManageMembersModal: React.FC<ManageMembersProps> = ({ onClose, onSave, project, allUsers = [] }) => {
  // 1. State nội bộ để quản lý danh sách thành viên (bao gồm cả chỉnh sửa)
  const [members, setMembers] = useState(project.members);
  // 2. State cho form "Thêm mới"
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState('');
  const [error, setError] = useState('');

  // 3. Danh sách user CÓ THỂ thêm (chưa có trong dự án)
  const availableUsers = useMemo(() => {
    const memberIds = new Set(members.map(m => m.userId.toString()));
    return allUsers.filter(user => !memberIds.has(user.id.toString()));
  }, [allUsers, members]);

  // 4. Hàm xử lý khi thay đổi vai trò của thành viên HIỆN TẠI
  const handleRoleChange = (userId, newRole) => {
    setMembers(currentMembers =>
      currentMembers.map(m =>
        m.userId === userId ? { ...m, role: newRole } : m
      )
    );
  };

  // 5. Hàm xử lý XÓA
  const handleDelete = (userId) => {
    setMembers(currentMembers => currentMembers.filter(m => m.userId !== userId));
  };

  // 6. Hàm xử lý khi ấn nút "Thêm" từ form thêm mới
  const handleAddMember = () => {
    if (!newUserId || !newRole.trim()) {
      setError('Vui lòng chọn thành viên và nhập vai trò.');
      return;
    }
    const newMember = {
      userId: parseInt(newUserId),
      role: newRole.trim(),
    };
    setMembers(currentMembers => [...currentMembers, newMember]);
    // Reset form
    setNewUserId('');
    setNewRole('');
    setShowAddForm(false);
    setError('');
  };

  // 7. Hàm LƯU TẤT CẢ THAY ĐỔI
  const handleSave = async () => {
    const updatedProject = { ...project, members: members };
    try {
      const response = await axios.put(`http://localhost:3001/projects/${project.id}`, updatedProject);
      onSave(response.data); // Gửi project đã cập nhật về ProjectDetail
      onClose();
    } catch (error) {
      console.error("Failed to save members:", error);
      setError('Không thể lưu thay đổi. Vui lòng thử lại.');
    }
  };

  const getUser = (userId) => allUsers.find(u => u.id == userId);

  return (
    <div style={styles.overlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.h2}>Thành viên</h2>
          <button
            type="button"
            style={styles.addMemberButtonHeader}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Huỷ thêm' : '+ Thêm thành viên'}
          </button>
        </div>

        <div style={styles.modalBody}>
          {/* Form thêm mới (hiện khi bấm nút) */}
          {showAddForm && (
            <div style={{ ...styles.memberRow, background: '#f8f9fa' }}>
              <select
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                style={{ ...styles.roleInput, flex: 1 }}
              >
                <option value="">Chọn thành viên...</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Nhập vai trò"
                style={styles.roleInput}
              />
              <button
                style={{ ...styles.button, ...styles.buttonPrimary, padding: '6px 12px' }}
                onClick={handleAddMember}
              >
                Thêm
              </button>
            </div>
          )}

          {/* Tiêu đề danh sách */}
          <div style={styles.memberListHeader}>
            <span style={{...styles.memberHeaderLabel, flex: 1}}>Thành viên</span>
            <span style={{...styles.memberHeaderLabel, width: '180px'}}>Vai trò</span>
            <span style={{...styles.memberHeaderLabel, width: '30px'}}></span>
          </div>

          {/* Danh sách thành viên hiện tại */}
          {members.map(member => {
            const user = getUser(member.userId);
            if (!user) return null;
            const avatarInitials = user.fullName.split(" ").map((n) => n[0]).join("");

            return (
              <div key={user.id} style={styles.memberRow}>
                <div style={styles.memberInfo}>
                  <div style={styles.avatar}>{avatarInitials}</div>
                  <div style={styles.nameEmail}>
                    <span style={styles.name}>{user.fullName}</span>
                    <span style={styles.email}>{user.email}</span>
                  </div>
                </div>
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                  style={styles.roleInput}
                />
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(member.userId)}
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
        
        {error && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

        <div style={styles.modalFooter}>
          <button type="button" style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onClose}>
            Đóng
          </button>
          <button type="button" style={{ ...styles.button, ...styles.buttonPrimary }} onClick={handleSave}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageMembersModal;