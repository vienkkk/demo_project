// src/component/project/ProjectDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 1. Import useParams để lấy ID từ URL
import axios from 'axios'; // 2. Import axios
import styles from '../style/ProjectDetail.module.css';

// --- XÓA BỎ TOÀN BỘ DỮ LIỆU CŨ ---

const ProjectDetail = () => {
  // --- 3. Lấy projectId từ URL ---
  const { projectId } = useParams();

  // --- 4. Tạo các state để lưu dữ liệu từ API ---
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dùng Promise.all để gọi nhiều API cùng lúc cho hiệu quả
        const [projectRes, tasksRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:3001/projects/${projectId}`),
          axios.get(`http://localhost:3001/tasks?projectId=${projectId}`),
          axios.get(`http://localhost:3001/users`)
        ]);

        setProject(projectRes.data);
        setTasks(tasksRes.data);
        setUsers(usersRes.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]); // Dependency là projectId, nếu ID thay đổi, sẽ gọi lại API

  // Hàm tiện ích để lấy thông tin user từ id
  const getUserById = (id) => users.find(user => user.id === id);

  // --- 5. Xử lý trạng thái loading và lỗi ---
  if (isLoading) return <div className={styles.container}><p>Loading project details...</p></div>;
  if (error) return <div className={styles.container}><p>Error: {error}</p></div>;
  if (!project) return <div className={styles.container}><p>Project not found.</p></div>;

  // Nhóm tasks theo status
  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'To do'),
    inProgress: tasks.filter(t => t.status === 'In Progress'),
  };

  return (
    <div className={styles.container}>
      {/* Project Header */}
      <div className={styles.projectHeader}>
        <div className={styles.projectInfo}>
          <h1>{project.projectName}</h1>
          <p>{project.description}</p>
          <button className={styles.addTaskBtn}>+ Thêm nhiệm vụ</button>
        </div>
        <div className={styles.projectMeta}>
            <div className={styles.projectImage}>
                 <img src={project.image} alt={project.projectName} style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '5px' }} />
            </div>
            <div className={styles.members}>
                <div className={styles.membersHeader}>
                    <span>Thành viên</span>
                    <button className={styles.addMemberBtn}>+ Thêm thành viên</button>
                </div>
                {project.members.map(member => {
                    const user = getUserById(member.userId);
                    if (!user) return null; // Bỏ qua nếu không tìm thấy user
                    const avatarInitials = user.fullName.split(' ').map(n => n[0]).join('');
                    return (
                        <div key={member.userId} className={styles.memberItem}>
                        <div className={styles.avatar}>{avatarInitials}</div>
                        <div>
                            <div className={styles.memberName}>{user.fullName}</div>
                            <div className={styles.memberRole}>{member.role}</div>
                        </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>

      {/* Task List */}
      <div className={styles.taskListContainer}>
        <div className={styles.taskListHeader}>
          <h2>Danh Sách Nhiệm Vụ</h2>
          <div className={styles.taskControls}>
            <select><option>Sắp xếp theo</option></select>
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
                {tasksByStatus.todo.map((task) => {
                    const assignee = getUserById(task.assigneeId);
                    return (
                        <tr key={task.id}>
                            <td>{task.taskName}</td>
                            <td>{assignee ? assignee.fullName : 'N/A'}</td>
                            <td><span className={`${styles.priority} ${styles[task.priority.toLowerCase().replace(' ', '')]}`}>{task.priority}</span></td>
                            <td>{task.assignDate}</td>
                            <td>{task.dueDate}</td>
                            <td><span className={`${styles.status} ${styles[task.progress.toLowerCase().replace(/\s+/g, '')]}`}>{task.progress}</span></td>
                            <td>
                                <button className={styles.editBtn}>Sửa</button>
                                <button className={styles.deleteBtn}>Xóa</button>
                            </td>
                        </tr>
                    )
                })}
                 {/* In Progress */}
                 <tr><td colSpan={7} className={styles.taskSection}>▼ In Progress</td></tr>
                 {tasksByStatus.inProgress.map((task) => {
                    const assignee = getUserById(task.assigneeId);
                    return (
                        <tr key={task.id}>
                             <td>{task.taskName}</td>
                             <td>{assignee ? assignee.fullName : 'N/A'}</td>
                             <td><span className={`${styles.priority} ${styles[task.priority.toLowerCase().replace(' ', '')]}`}>{task.priority}</span></td>
                             <td>{task.assignDate}</td>
                             <td>{task.dueDate}</td>
                             <td><span className={`${styles.status} ${styles[task.progress.toLowerCase().replace(/\s+/g, '')]}`}>{task.progress}</span></td>
                             <td>
                                <button className={styles.editBtn}>Sửa</button>
                                <button className={styles.deleteBtn}>Xóa</button>
                             </td>
                        </tr>
                    )
                })}
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