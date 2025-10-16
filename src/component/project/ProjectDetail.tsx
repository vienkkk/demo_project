// src/component/project/ProjectDetail.tsx

import React from 'react';
import styles from '../style/ProjectDetail.module.css'; // Sẽ tạo file CSS này ở bước sau

// Dữ liệu mẫu
const project = {
  name: 'Xây dựng website thương mại điện tử',
  description: 'Dự án nhằm phát triển một nền tảng thương mại điện tử với các tính năng như giỏ hàng, thanh toán và quản lý sản phẩm.',
  imageUrl: 'https://i.imgur.com/example.png' // Thay bằng URL ảnh của bạn
};

const members = [
  { name: 'An Nguyen', role: 'Project owner', avatar: 'AN' },
  { name: 'Bách Nguyễn', role: 'Frontend developer', avatar: 'BN' }
];

const tasks = {
  todo: [
    { name: 'Soạn thảo đề cương dự án', assigned: 'An Nguyễn', priority: 'Thấp', startDate: '02 - 24', endDate: '02 - 27', status: 'Đang tiến độ' },
    { name: 'Soạn thảo đề cương dự án', assigned: 'An Nguyễn', priority: 'Trung bình', startDate: '02 - 24', endDate: '02 - 27', status: 'Có rủi ro' },
    { name: 'Soạn thảo đề cương dự án', assigned: 'An Nguyễn', priority: 'Cao', startDate: '02 - 24', endDate: '02 - 27', status: 'Trễ hạn' },
  ],
  inProgress: [
    { name: 'Lên lịch họp kickoff', assigned: 'An Nguyễn', priority: 'Trung bình', startDate: '02 - 24', endDate: '02 - 27', status: 'Có rủi ro' },
  ]
};

const ProjectDetail = () => {
  return (
    <div className={styles.container}>
      {/* Project Header */}
      <div className={styles.projectHeader}>
        <div className={styles.projectInfo}>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <button className={styles.addTaskBtn}>+ Thêm nhiệm vụ</button>
        </div>
        <div className={styles.projectMeta}>
            <div className={styles.projectImage}>
                 {/* Bạn có thể dùng thẻ <img> ở đây */}
                 <p style={{textAlign: 'center', paddingTop: '40px'}}>Project Image</p>
            </div>
            <div className={styles.members}>
                <div className={styles.membersHeader}>
                    <span>Thành viên</span>
                    <button className={styles.addMemberBtn}>+ Thêm thành viên</button>
                </div>
                {members.map(member => (
                    <div key={member.name} className={styles.memberItem}>
                    <div className={styles.avatar}>{member.avatar}</div>
                    <div>
                        <div className={styles.memberName}>{member.name}</div>
                        <div className={styles.memberRole}>{member.role}</div>
                    </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Task List */}
      <div className={styles.taskListContainer}>
        <div className={styles.taskListHeader}>
          <h2>Danh Sách Nhiệm Vụ</h2>
          <div className={styles.taskControls}>
            <select>
              <option>Sắp xếp theo</option>
            </select>
            <input type="text" placeholder="Tìm kiếm nhiệm vụ" />
          </div>
        </div>
        
        <table className={styles.taskTable}>
            <thead>
                <tr>
                    <th>Tên Nhiệm Vụ</th>
                    <th>Người Phụ Trách</th>
                    <th>Ưu Tiên</th>
                    <th>Ngày Bắt Đầu</th>
                    <th>Hạn Chót</th>
                    <th>Tiến độ</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {/* To do */}
                <tr><td colSpan={7} className={styles.taskSection}>▼ To do</td></tr>
                {tasks.todo.map((task, index) => (
                    <tr key={index}>
                        <td>{task.name}</td>
                        <td>{task.assigned}</td>
                        <td><span className={`${styles.priority} ${styles[task.priority.toLowerCase().replace(' ', '')]}`}>{task.priority}</span></td>
                        <td>{task.startDate}</td>
                        <td>{task.endDate}</td>
                        <td><span className={`${styles.status} ${styles[task.status.toLowerCase().replace(/\s+/g, '')]}`}>{task.status}</span></td>
                        <td>
                            <button className={styles.editBtn}>Sửa</button>
                            <button className={styles.deleteBtn}>Xóa</button>
                        </td>
                    </tr>
                ))}
                 {/* In Progress */}
                 <tr><td colSpan={7} className={styles.taskSection}>▼ In Progress</td></tr>
                 {tasks.inProgress.map((task, index) => (
                    <tr key={index}>
                         <td>{task.name}</td>
                         <td>{task.assigned}</td>
                         <td><span className={`${styles.priority} ${styles[task.priority.toLowerCase().replace(' ', '')]}`}>{task.priority}</span></td>
                         <td>{task.startDate}</td>
                         <td>{task.endDate}</td>
                         <td><span className={`${styles.status} ${styles[task.status.toLowerCase().replace(/\s+/g, '')]}`}>{task.status}</span></td>
                         <td>
                            <button className={styles.editBtn}>Sửa</button>
                            <button className={styles.deleteBtn}>Xóa</button>
                         </td>
                    </tr>
                ))}
                 {/* Pending & Done */}
                 <tr><td colSpan={7} className={styles.taskSection}>► Pending</td></tr>
                 <tr><td colSpan={7} className={styles.taskSection}>► Done</td></tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectDetail;