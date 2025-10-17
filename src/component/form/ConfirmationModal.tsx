// src/component/modal/ConfirmationModal.tsx
import React from 'react';

// --- STYLE OBJECTS ---
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Nền mờ hơn một chút
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1010, // z-index cao hơn modal chính
  },
  modal: {
    background: 'white',
    padding: '24px',
    borderRadius: '8px',
    margin:"10px 0",
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    width: '400px',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6b7280',
  },
  message: {
    fontSize: '1rem',
    color: '#374151',
    marginBottom: '24px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  button: {
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
  },
  confirmButton: {
    backgroundColor: '#dc3545', // Màu đỏ cho nút xóa
    color: 'white',
  },
};

function ConfirmationModal({ message, onConfirm, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Xác nhận xóa</h3>
          <button style={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <p style={styles.message}>{message}</p>
        <div style={styles.footer}>
          <button style={{ ...styles.button, ...styles.cancelButton }} onClick={onClose}>
            Hủy
          </button>
          <button style={{ ...styles.button, ...styles.confirmButton }} onClick={onConfirm}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;