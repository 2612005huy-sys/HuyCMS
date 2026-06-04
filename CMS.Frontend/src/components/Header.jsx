import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, LogIn, Cpu, Package } from 'lucide-react';

function Header({ cartCount, currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <Cpu size={22} style={{ color: 'var(--accent)' }} />
            NEXUS<span>.</span>TECH
          </Link>
        </div>

        <nav>
          <ul className="nav-links">
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Trang chủ</NavLink></li>
            <li><NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>Cửa hàng</NavLink></li>
            <li><NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>Giỏ hàng</NavLink></li>
          </ul>
        </nav>

        <div className="header-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
                Hi, {currentUser.name}
              </span>
              <Link to="/orders" className="user-profile-btn" title="Lịch sử đơn hàng">
                <Package size={20} />
              </Link>
              <button onClick={handleLogout} className="user-profile-btn" title="Đăng xuất">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="user-profile-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
              <LogIn size={20} />
              <span>Đăng nhập</span>
            </Link>
          )}
          <Link to="/cart" className="cart-icon-btn">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
