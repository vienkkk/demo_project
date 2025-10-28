import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../style/ProjectDetail.module.css";
import FormAddTask from "../form/FormAddMissonProjectDetail";
import imgHeader from "../img/projectDetail/img.png";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskSearchTerm, setTaskSearchTerm] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setProject(null);
        setTasks([]);

        const [projectRes, tasksRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:3001/projects/${projectId}`),
          axios.get(`http://localhost:3001/tasks?projectId=${projectId}`),
          axios.get(`http://localhost:3001/users`),
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
  }, [projectId]);

  const filteredTasks = useMemo(() => {
    if (!taskSearchTerm) {
      return tasks;
    }
    return tasks.filter((task) =>
      task.taskName.toLowerCase().includes(taskSearchTerm.toLowerCase())
    );
  }, [tasks, taskSearchTerm]);
  const getUserById = (id) => users.find((user) => user.id == id);
  const handleSaveTask = (savedTask) => {
    let updatedTasks;
    if (editingTask) {
      updatedTasks = tasks.map((task) =>
        task.id === savedTask.id ? savedTask : task
      );
    } else {
      updatedTasks = [...tasks, savedTask];
    }
    setTasks(updatedTasks);
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };
  const handleOpenAddTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };
  const handleOpenEditTaskModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };
  const handleTaskSearchChange = (event) => {
    setTaskSearchTerm(event.target.value);
  };
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
  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "To do"),
    inProgress: filteredTasks.filter((t) => t.status === "In Progress"),
    pending: filteredTasks.filter((t) => t.status === "Pending"),
    done: filteredTasks.filter((t) => t.status === "Done"),
  };
  return (
    <div className={styles.container}>
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
              <button className={styles.addMemberBtn}>+ Thêm thành viên</button>
            </div>
            {project.members.map((member) => {
              const user = getUserById(member.userId);
              if (!user) return null;
              const avatarInitials = user.fullName
                .split(" ")
                .map((n) => n[0])
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
              onChange={handleTaskSearchChange}
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
            <tr>
              <td colSpan={7} className={styles.taskSection}>
                ▼ To do ({tasksByStatus.todo.length})
              </td>
            </tr>
            {tasksByStatus.todo.map((task) => {
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
            {/* In Progress */}
            <tr>
              <td colSpan={7} className={styles.taskSection}>
                ▼ In Progress ({tasksByStatus.inProgress.length})
              </td>
            </tr>
            {tasksByStatus.inProgress.map((task) => {
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
            {/* Pending */}
            <tr>
              <td colSpan={7} className={styles.taskSection}>
                ► Pending ({tasksByStatus.pending.length})
              </td>
            </tr>
            {tasksByStatus.pending.map((task) => {
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
            {/* Done */}
            <tr>
              <td colSpan={7} className={styles.taskSection}>
                ► Done ({tasksByStatus.done.length})
              </td>
            </tr>
            {tasksByStatus.done.map((task) => {
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
          </tbody>
        </table>
      </div>

      {/* Modal Render */}
      {isTaskModalOpen && (
        <FormAddTask
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          taskToEdit={editingTask}
          users={users}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default ProjectDetail;