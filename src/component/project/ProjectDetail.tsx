import React, { useState, useMemo } from "react";
import styles from "../style/ProjectDetail.module.css";
import imgHeader from "../img/projectDetail/img.png";
import FormAddTask from "../form/FormAddMissonProjectDetail";
import ManageMembersModal from "../form/ManageMembersModal"; 
import { useProjectDetails } from "../../hooks/useProjectDetails"; 

const ProjectDetail = () => {
  const {
    projectId,
    project,
    tasks,
    users,
    isLoading,
    error,
    setProject, // Lấy hàm setProject để cập nhật
    setTasks,   // Lấy hàm setTasks để cập nhật
  } = useProjectDetails();

  // --- State quản lý UI (Modal, Search) ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isManageMemberModalOpen, setIsManageMemberModalOpen] = useState(false); 
  const [editingTask, setEditingTask] = useState(null);
  const [taskSearchTerm, setTaskSearchTerm] = useState("");
  const filteredTasks = useMemo(() => {
    if (!taskSearchTerm) return tasks;
    return tasks.filter((task) =>
      task.taskName.toLowerCase().includes(taskSearchTerm.toLowerCase())
    );
  }, [tasks, taskSearchTerm]);

  const tasksByStatus = useMemo(() => ({
    todo: filteredTasks.filter((t) => t.status === "To do"),
    inProgress: filteredTasks.filter((t) => t.status === "In Progress"),
    pending: filteredTasks.filter((t) => t.status === "Pending"),
    done: filteredTasks.filter((t) => t.status === "Done"),
  }), [filteredTasks]);

  const getUserById = (id) => users.find((user) => user.id == id);
  const handleSaveTask = (savedTask: any) => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === savedTask.id ? savedTask : task)));
    } else {
      setTasks([...tasks, savedTask]);
    }
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const handleOpenAddTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };
  
  const handleOpenEditTaskModal = (task: any) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };
  const handleOpenManageMemberModal = () => { // Đổi tên hàm cho khớp
    setIsManageMemberModalOpen(true);
  };

  const handleSaveMember = (updatedProject: any) => {
    setProject(updatedProject); // Cập nhật project state từ hook
    setIsManageMemberModalOpen(false);
  };

  // --- Render ---
  if (isLoading)
    return (
      <div className={styles.container}>
        <p>Loading project details...</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.container}>
        <p>Error: {error}</p>
      </div>
    );
  if (!project)
    return (
      <div className={styles.container}>
        <p>Project not found.</p>
      </div>
    );

  return (
    <div className={styles.container}>
      {/* --- Project Header --- */}
      <div className={styles.projectHeader}>
        <div className={styles.projectInfo}>
          <h1>{project.projectName}</h1>
          <p>{project.description}</p>
          <button
            className={styles.addTaskBtn}
            onClick={handleOpenAddTaskModal}
          >
            + Thêm nhiệm vụ
          </button>
        </div>
        
        <div className={styles.projectMeta}>
          <div className={styles.projectImage}>
            <img
              src={imgHeader}
              alt={project.projectName}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
          </div>
          <div className={styles.members}>
            <div className={styles.membersHeader}>
              <span>Thành viên</span>
              <button 
                className={styles.addMemberBtn}
                onClick={handleOpenManageMemberModal}
              >
                + Thêm thành viên
              </button>
            </div>
            {project.members.map((member: any) => {
              const user = getUserById(member.userId);
              if (!user) return null;
              const avatarInitials = user.fullName
                .split(" ")
                .map((n: string) => n[0])
                .join("");
              return (
                <div key={member.userId} className={styles.memberItem}>
                  <div className={styles.avatar}>{avatarInitials}</div>
                  <div>
                    <div className={styles.memberName}>{user.fullName}</div>
                    <div className={styles.memberRole}>{member.role}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- Task List --- */}
      <div className={styles.taskListContainer}>
        <div className={styles.taskListHeader}>
          <h2>Danh Sách Nhiệm Vụ</h2>
          <div className={styles.taskControls}>
            <select>
              <option>Sắp xếp theo</option>
            </select>
            <input
              type="text"
              placeholder="Tìm kiếm nhiệm vụ..."
              value={taskSearchTerm}
              onChange={(e) => setTaskSearchTerm(e.target.value)}
            />
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
            {Object.entries(tasksByStatus).map(([status, tasksInSection]) => (
              <React.Fragment key={status}>
                <tr>
                  <td colSpan={7} className={styles.taskSection}>
                    ▼ {status} ({tasksInSection.length})
                  </td>
                </tr>
                {tasksInSection.map((task: any) => {
                  const assignee = getUserById(task.assigneeId);
                  return (
                    <tr key={task.id}>
                      <td>{task.taskName}</td>
                      <td>{assignee ? assignee.fullName : "N/A"}</td>
                      <td>
                        <span
                          className={`${styles.priority} ${
                            styles[task.priority?.toLowerCase().replace(" ", "")]
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td>{task.assignDate}</td>
                      <td>{task.dueDate}</td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            styles[task.progress?.toLowerCase().replace(/\s+/g, "")]
                          }`}
                        >
                          {task.progress}
                        </span>
                      </td>
                      <td>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleOpenEditTaskModal(task)}
                        >
                          Sửa
                        </button>
                        <button className={styles.deleteBtn}>Xóa</button>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Modals Render --- */}
      {isTaskModalOpen && (
        <FormAddTask
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          taskToEdit={editingTask}
          users={users}
          projectId={projectId!}
        />
      )}

      {/* 4. Render modal quản lý thành viên */}
      {isManageMemberModalOpen && (
        <ManageMembersModal
          onClose={() => setIsManageMemberModalOpen(false)}
          onSave={handleSaveMember}
          project={project}
          allUsers={users}
        />
      )}
    </div>
  );
};

export default ProjectDetail;