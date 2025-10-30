// src/hooks/useProjectDetails.ts
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Hook này sẽ chịu trách nhiệm tải tất cả dữ liệu cho trang Project Detail
export const useProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>(); // Lấy projectId từ URL
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      setError("Không tìm thấy Project ID.");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Sử dụng Promise.all để tải đồng thời
        const [projectRes, tasksRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:3001/projects/${projectId}`),
          axios.get(`http://localhost:3001/tasks?projectId=${projectId}`),
          axios.get(`http://localhost:3001/users`),
        ]);

        setProject(projectRes.data);
        setTasks(tasksRes.data);
        setUsers(usersRes.data);
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]); // Chỉ fetch lại khi projectId thay đổi

  // Trả về state và các hàm cập nhật state
  return {
    projectId,
    project,
    tasks,
    users,
    isLoading,
    error,
    setProject, // Cần thiết để modal thành viên cập nhật lại project
    setTasks,   // Cần thiết để modal task cập nhật lại danh sách task
  };
};