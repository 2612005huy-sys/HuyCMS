import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../api.js';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu!');
      return;
    }
    setLoading(true);

    api.post('/api/customers/login', { email: form.email, password: form.password })
      .then(res => {
        onLogin(res.data);
        navigate('/');
      })
      .catch(err => {
        if (err.response?.status === 401) {
          setError('Email hoặc mật khẩu không chính xác!');
        } else {
          setError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <Link to="/">NEXUS<span>.</span>TECH</Link>
        </div>

        <div className="auth-header">
          <h1>Đăng Nhập</h1>
          <p>Chào mừng trở lại! Nhập thông tin để tiếp tục mua sắm.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="login-email">
              <Mail size={15} /> Email
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">
              <Lock size={15} /> Mật khẩu
            </label>
            <div className="password-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
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

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <LogIn size={18} />
                Đăng Nhập
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Chưa có tài khoản?{' '}
          <Link to="/register">Đăng ký ngay →</Link>
        </p>
      </div>

      {/* Background decoration */}
      <div className="auth-bg-decor" />
    </div>
  );
}

export default Login;
