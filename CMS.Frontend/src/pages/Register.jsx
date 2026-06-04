import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import api from '../api.js';

function Register({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setError('Vui lòng điền đầy đủ họ tên, email và mật khẩu!');
      return;
    }
    if (form.password.length < 3) {
      setError('Mật khẩu phải có ít nhất 3 ký tự!');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }
    setLoading(true);

    api.post('/api/customers/register', {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      password: form.password,
    })
      .then(res => {
        // Tự động đăng nhập sau khi đăng ký thành công
        onLogin(res.data);
        setSuccess('Đăng ký thành công! Đang chuyển hướng...');
        setTimeout(() => navigate('/'), 1200);
      })
      .catch(err => {
        if (err.response?.status === 409) {
          setError('Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập!');
        } else {
          setError(err.response?.data?.message || 'Lỗi kết nối máy chủ. Vui lòng thử lại.');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        {/* Logo */}
        <div className="auth-logo">
          <Link to="/">AURA<span>.</span>FASHION</Link>
        </div>

        <div className="auth-header">
          <h1>Tạo Tài Khoản</h1>
          <p>Đăng ký để theo dõi đơn hàng và nhận ưu đãi độc quyền.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">⚠️ {error}</div>}
          {success && <div className="auth-success">✅ {success}</div>}

          <div className="auth-grid">
            {/* Full Name */}
            <div className="auth-field">
              <label htmlFor="reg-name">
                <User size={15} /> Họ và tên *
              </label>
              <input
                id="reg-name"
                type="text"
                name="fullName"
                placeholder="Nguyễn Văn A"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="auth-field">
              <label htmlFor="reg-email">
                <Mail size={15} /> Email *
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            {/* Phone */}
            <div className="auth-field">
              <label htmlFor="reg-phone">
                <Phone size={15} /> Số điện thoại
              </label>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                placeholder="0901234567"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="auth-field">
              <label htmlFor="reg-address">
                <MapPin size={15} /> Địa chỉ nhận hàng
              </label>
              <input
                id="reg-address"
                type="text"
                name="address"
                placeholder="Số nhà, đường, quận, thành phố..."
                value={form.address}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="reg-password">
                <Lock size={15} /> Mật khẩu *
              </label>
              <div className="password-wrapper">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Tối thiểu 3 ký tự"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label htmlFor="reg-confirm">
                <Lock size={15} /> Nhập lại mật khẩu *
              </label>
              <div className="password-wrapper">
                <input
                  id="reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu ở trên"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <UserPlus size={18} />
                Tạo Tài Khoản
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản?{' '}
          <Link to="/login">Đăng nhập →</Link>
        </p>
      </div>

      <div className="auth-bg-decor" />
    </div>
  );
}

export default Register;
