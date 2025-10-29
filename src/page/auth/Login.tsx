// src/page/auth/Login.tsx
import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  // 1. Thay đổi state để chấp nhận JSX
  const [toast, setToast] = useState<React.ReactNode>("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setToast("");
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // (Validation logic giữ nguyên)
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.get("http://localhost:3001/users");
      const users = response.data;
      const foundUser = users.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      );

      if (foundUser) {
        // --- THAY ĐỔI: LƯU USER ID VÀO LOCALSTORAGE ---
        localStorage.setItem('loggedInUserId', foundUser.id);
        // ---------------------------------------------

        setToast(
          <>
            <img 
              src="https://cdn.pixabay.com/animation/2025/06/14/19/01/19-01-51-889_512.gif" 
              alt="Đăng nhập thành công" 
              style={{ width: '60px', height: '60px', display: 'block', margin: 'auto' }}
            />
          </>
        );

        setTimeout(() => {
          setToast("");
          navigate("/project-manager"); // Chuyển đến trang quản lý dự án
        }, 2000);
      } else {
        setErrors({
          form: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setErrors({
        form: "Đã xảy ra lỗi. Không thể kết nối đến máy chủ.",
      });
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>

        <label>Địa chỉ Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Địa chỉ email"
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Mật khẩu</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
        />
        {errors.password && <span className="error">{errors.password}</span>}
        
        {errors.form && <span className="error">{errors.form}</span>}


        <button type="submit">Đăng nhập</button>
        <p>
          Chưa có tài khoản?{" "}
          <span
            className="link"
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer" }} 
          >
            Đăng ký
          </span>
        </p>
      </form>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Login;