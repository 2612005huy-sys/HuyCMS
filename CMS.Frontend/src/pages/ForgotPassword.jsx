import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft, CheckCircle2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import api from '../api.js';

function ForgotPassword() {
  // Luồng 2 bước: 'input' → 'success'
  const [step, setStep] = useState('input');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Địa chỉ email không đúng định dạng!');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/customers/forgot-password', { email: email.trim() });
      setNewPassword(res.data.newPassword);
      setCustomerName(res.data.customerName || 'Khách hàng');
      setStep('success');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Email này chưa được đăng ký trong hệ thống. Vui lòng kiểm tra lại!');
      } else {
        setError(err.response?.data?.message || 'Lỗi kết nối máy chủ. Vui lòng thử lại sau!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <Link to="/">NEXUS<span>.</span>TECH</Link>
        </div>

        {step === 'input' ? (
          <>
            {/* Header */}
            <div className="auth-header">
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '64px', height: '64px',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                borderRadius: '50%', margin: '0 auto 20px',
                boxShadow: 'var(--glow-accent)'
              }}>
                <KeyRound size={28} color="white" />
              </div>
              <h1>Quên Mật Khẩu</h1>
              <p style={{ lineHeight: '1.6' }}>
                Nhập địa chỉ email đã đăng ký. Hệ thống sẽ cấp lại mật khẩu mới ngay cho bạn.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="auth-error">
                  <span>⚠️ {error}</span>
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="forgot-email">
                  <Mail size={15} /> Địa chỉ Email đã đăng ký
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoFocus
                  required
                />
              </div>

              {/* Hướng dẫn */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: '1.6'
              }}>
                💡 Sau khi xác nhận, hệ thống sẽ tạo mật khẩu mới và hiển thị ngay trên màn hình này. Hãy ghi lại và đăng nhập lại để đổi mật khẩu theo ý muốn.
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <RefreshCw size={18} />
                    Cấp Lại Mật Khẩu
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch">
              Nhớ mật khẩu rồi?{' '}
              <Link to="/login">Đăng nhập ngay →</Link>
            </p>

            <p className="auth-switch" style={{ marginTop: '8px' }}>
              <Link
                to="/login"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem' }}
              >
                <ArrowLeft size={14} /> Quay lại đăng nhập
              </Link>
            </p>
          </>
        ) : (
          <>
            {/* Màn hình thành công */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '72px', height: '72px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%', margin: '0 auto 24px',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
              }}>
                <CheckCircle2 size={36} color="white" />
              </div>

              <h1 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Cấp Mật Khẩu Thành Công!</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '28px', lineHeight: '1.6' }}>
                Xin chào <strong style={{ color: 'var(--text)' }}>{customerName}</strong>! Mật khẩu mới của bạn là:
              </p>

              {/* Hiển thị mật khẩu mới */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '2px dashed var(--accent)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 24px',
                marginBottom: '20px',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em',
                  color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px'
                }}>
                  Mật khẩu mới của bạn
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <span style={{
                    fontSize: showPassword ? '1.6rem' : '1.2rem',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    color: 'var(--accent)',
                    letterSpacing: showPassword ? '0.2em' : '0.1em',
                    filter: showPassword ? 'none' : 'blur(5px)',
                    transition: 'all 0.3s ease',
                    userSelect: showPassword ? 'text' : 'none'
                  }}>
                    {newPassword}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', padding: '4px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center'
                    }}
                    title={showPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Nút Sao chép */}
              <button
                type="button"
                onClick={handleCopyPassword}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: copied
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${copied ? '#10b981' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  color: copied ? '#fff' : 'var(--text)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {copied ? (
                  <><CheckCircle2 size={18} /> Đã sao chép vào Clipboard!</>
                ) : (
                  <><KeyRound size={18} /> Sao chép mật khẩu</>
                )}
              </button>

              {/* Cảnh báo bảo mật */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontSize: '0.875rem',
                color: '#f87171',
                lineHeight: '1.6',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                ⚠️ <strong>Quan trọng:</strong> Hãy đăng nhập và <strong>đổi mật khẩu ngay</strong> trong phần Thông tin tài khoản để bảo vệ tài khoản của bạn!
              </div>

              {/* Nút điều hướng */}
              <Link
                to="/login"
                className="auth-submit-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
              >
                Đăng nhập với mật khẩu mới →
              </Link>

              <button
                type="button"
                onClick={() => { setStep('input'); setEmail(''); setError(''); }}
                style={{
                  width: '100%', marginTop: '12px', background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <ArrowLeft size={15} /> Thử email khác
              </button>
            </div>
          </>
        )}
      </div>

      {/* Background decoration */}
      <div className="auth-bg-decor" />
    </div>
  );
}

export default ForgotPassword;
