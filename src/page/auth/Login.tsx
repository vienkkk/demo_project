import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Kiểm tra bỏ trống
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

    // Đăng nhập thành công
    console.log("Thông tin đăng nhập:", formData);
    setToast("Đăng nhập thành công!");

    setTimeout(() => {
      setToast("");
    }, 2000);
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

        <button type="submit">Đăng nhập</button>
        <p>
          Chưa có tài khoản?{" "}
          <span className="link" onClick={() => navigate("/register")}>
            Đăng ký
          </span>
        </p>
      </form>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Login;
