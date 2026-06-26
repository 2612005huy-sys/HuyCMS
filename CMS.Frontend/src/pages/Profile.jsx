import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Save, Eye, EyeOff } from 'lucide-react';
import api from '../api.js';

function Profile({ currentUser, onLogin }) {
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
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Fetch current user data from the API to get full info
    api.get(`/api/customers/${currentUser.id}`)
      .then(res => {
        setForm(prev => ({
          ...prev,
          fullName: res.data.fullName || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
        }));
      })
      .catch(err => {
        console.error("Lỗi lấy thông tin cá nhân:", err);
        // Fallback to basic info from currentUser if API fails (e.g. backend not restarted)
        setForm(prev => ({
          ...prev,
          fullName: currentUser.name || currentUser.fullName || '',
          email: currentUser.email || '',
        }));
        setError("Không thể tải thông tin mới nhất. Vui lòng đảm bảo Backend đã được khởi động lại.");
      })
      .finally(() => {
        setFetching(false);
      });
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName) {
      setError('Họ và tên không được để trống!');
      return;
    }

    if (form.password && form.password.length < 3) {
      setError('Mật khẩu mới phải có ít nhất 3 ký tự!');
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }

    setLoading(true);

    api.put(`/api/customers/${currentUser.id}`, {
      fullName: form.fullName,
      phone: form.phone,
      address: form.address,
      password: form.password || null
    })
      .then(res => {
        setSuccess('Cập nhật thông tin thành công!');
        setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
        
        // Update global user state (so header updates)
        if (onLogin) {
            onLogin({
                ...currentUser,
                name: res.data.name,
                fullName: res.data.name
            });
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Lỗi cập nhật thông tin. Vui lòng thử lại.');
      })
      .finally(() => setLoading(false));
  };

  if (fetching) {
    return (
      <div className="auth-page">
        <div className="spinner" style={{ margin: 'auto' }}></div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-header">
          <h1>Thông Tin Khách Hàng</h1>
          <p>Quản lý và cập nhật thông tin cá nhân của bạn.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error" style={{ color: '#ff4d4f', background: 'rgba(255, 77, 79, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 77, 79, 0.3)' }}>⚠️ {error}</div>}
          {success && <div className="auth-success" style={{ color: '#52c41a', background: 'rgba(82, 196, 26, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(82, 196, 26, 0.3)' }}>✅ {success}</div>}

          <div className="auth-grid">
            <div className="auth-field">
              <label htmlFor="profile-name">
                <User size={15} /> Họ và tên *
              </label>
              <input
                id="profile-name"
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="profile-email">
                <Mail size={15} /> Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={form.email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                title="Không thể thay đổi email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="profile-phone">
                <Phone size={15} /> Số điện thoại
              </label>
              <input
                id="profile-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="profile-address">
                <MapPin size={15} /> Địa chỉ nhận hàng
              </label>
              <input
                id="profile-address"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }}/>
              <h4 style={{ color: 'var(--text)', marginTop: '10px' }}>Đổi mật khẩu (Không bắt buộc)</h4>
            </div>

            <div className="auth-field">
              <label htmlFor="profile-password">
                <Lock size={15} /> Mật khẩu mới
              </label>
              <div className="password-wrapper">
                <input
                  id="profile-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Để trống nếu không muốn đổi"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="profile-confirm">
                <Lock size={15} /> Nhập lại mật khẩu mới
              </label>
              <div className="password-wrapper">
                <input
                  id="profile-confirm"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading} style={{ 
              background: 'var(--accent)', 
              color: '#ffffff', 
              padding: '14px', 
              borderRadius: 'var(--radius-sm)', 
              fontWeight: 600, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '10px'
          }}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <Save size={18} />
                Lưu Thay Đổi
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
