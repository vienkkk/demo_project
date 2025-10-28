import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  // 1. Thay đổi state để có thể chứa JSX
  const [success, setSuccess] = useState<React.ReactNode>(""); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); 
    setSuccess(""); // Xóa thông báo thành công
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // (Validation logic giữ nguyên)
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "Không được để trống";
      }
    });
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userCheckResponse = await axios.get(
        `http://localhost:3001/users?email=${formData.email}`
      );

      if (userCheckResponse.data.length > 0) {
        setErrors({ ...newErrors, email: "Email này đã được đăng ký." });
        return;
      }

      const newUser = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      await axios.post("http://localhost:3001/users", newUser);
      setSuccess(
        <>
          <img 
            src="https://cdn.pixabay.com/animation/2025/06/14/19/01/19-01-51-889_512.gif" 
            alt="Đăng ký thành công" 
            style={{ width: '60px', height: '60px', display: 'block', margin: 'auto' }}
          />
        </>
      );

      // Chờ 2 giây rồi chuyển hướng
      setTimeout(() => {
        navigate("/project-manager");
      }, 2000);
      
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setErrors({
        form: "Đã xảy ra lỗi. Không thể kết nối đến máy chủ.",
      });
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Họ và tên"
        />
        {errors.fullName && <span className="error">{errors.fullName}</span>}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Địa chỉ email"
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Xác nhận mật khẩu"
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}

        {errors.form && <span className="error">{errors.form}</span>}

        {/* 3. Vẫn render state 'success' (giờ là JSX) */}
        {success && <div className="success">{success}</div>}

        <button type="submit">Đăng ký</button>
        <p>
          Đã có tài khoản?{" "}
          <span
            className="link"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            Đăng nhập
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;