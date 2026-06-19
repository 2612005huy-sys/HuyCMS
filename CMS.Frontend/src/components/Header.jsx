import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Search, X } from 'lucide-react';
import api from '../api.js';

const Header = ({ cartCount, currentUser, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // State cho Smart Search
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);

    // Ẩn dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Lấy toàn bộ sản phẩm 1 lần để lọc siêu tốc
    useEffect(() => {
        api.get('/api/products')
            .then(res => setAllProducts(res.data))
            .catch(err => console.error("Lỗi lấy sản phẩm tìm kiếm:", err));
    }, []);

    // Lọc sản phẩm realtime khi user gõ
    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            const query = searchQuery.toLowerCase();
            const filtered = allProducts.filter(p => 
                (p.name && p.name.toLowerCase().includes(query)) || 
                (p.categoryName && p.categoryName.toLowerCase().includes(query))
            ).slice(0, 5); // Tối đa 5 kết quả
            setSearchResults(filtered);
            setShowDropdown(true);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    }, [searchQuery, allProducts]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowDropdown(false);
            navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const resolveImageUrl = (path) => {
        if (!path) return 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=100&auto=format&fit=crop';
        return path.startsWith('http') ? path : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${path}`;
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">NEXUS <span>TECH</span></Link>
                </div>
                
                {/* Khu vực Smart Search */}
                <div className="header-search-wrapper" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit} className="header-search-form">
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm sản phẩm công nghệ..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                        />
                        {searchQuery && (
                            <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                                <X size={16} />
                            </button>
                        )}
                        <button type="submit" className="submit-search-btn">
                            <Search size={18} />
                        </button>
                    </form>

                    {/* Dropdown Kết Quả */}
                    {showDropdown && (
                        <div className="search-dropdown">
                            {searchResults.length > 0 ? (
                                <ul className="search-results-list">
                                    {searchResults.map(product => (
                                        <li key={product.id}>
                                            <Link to={`/product/${product.id}`} onClick={() => { setShowDropdown(false); setSearchQuery(''); }}>
                                                <img src={resolveImageUrl(product.imageUrl)} alt={product.name} />
                                                <div className="search-item-info">
                                                    <span className="search-item-name">{product.name}</span>
                                                    <span className="search-item-price">{product.price.toLocaleString('vi-VN')} đ</span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="search-no-results">
                                    Không tìm thấy sản phẩm "{searchQuery}"
                                </div>
                            )}
                            {searchResults.length > 0 && (
                                <Link to={`/shop?q=${encodeURIComponent(searchQuery.trim())}`} 
                                      className="search-view-all"
                                      onClick={() => setShowDropdown(false)}>
                                    Xem tất cả kết quả
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                <ul className="nav-links">
                    <li>
                        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Trang Chủ</Link>
                    </li>
                    <li>
                        <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Sản Phẩm</Link>
                    </li>
                    <li>
                        <Link to="/blog" className={location.pathname.includes('/blog') ? 'active' : ''}>Tin Tức</Link>
                    </li>
                </ul>
                
                <div className="header-actions">
                    <Link to="/cart" className="cart-icon-btn" title="Giỏ hàng">
                        <ShoppingBag size={22} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                    
                    {currentUser ? (
                        <div className="user-menu-container" ref={userMenuRef} style={{ position: 'relative' }}>
                            <button 
                                className="user-profile-btn" 
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                            >
                                <User size={22} />
                            </button>
                            
                            {showUserDropdown && (
                                <div className="user-dropdown-menu">
                                    <div className="user-dropdown-header">
                                        <div className="user-name">{currentUser.name || currentUser.username || "Khách hàng"}</div>
                                        <div className="user-email">{currentUser.email || currentUser.phone || ""}</div>
                                    </div>
                                    <Link to="/orders" onClick={() => setShowUserDropdown(false)} className="user-dropdown-item">
                                        <LogOut size={16} style={{ transform: 'rotate(180deg)', opacity: 0 }} /> Lịch sử đơn hàng
                                    </Link>
                                    <button onClick={() => { onLogout(); setShowUserDropdown(false); }} className="user-dropdown-item logout-btn">
                                        <LogOut size={16} /> Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="user-profile-btn" title="Đăng nhập">
                            <User size={22} />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
