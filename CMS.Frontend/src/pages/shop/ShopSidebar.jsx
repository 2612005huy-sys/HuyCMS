import React, { useState, useEffect } from 'react';

// Component: Bộ lọc danh mục và khoảng giá dọc bên trái
const ShopSidebar = ({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory,
  selectedPriceRange,
  onSelectPriceRange
}) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Cập nhật lại input nếu bộ lọc giá bị xóa từ bên ngoài
  useEffect(() => {
    if (!selectedPriceRange) {
      setMinPrice('');
      setMaxPrice('');
    }
  }, [selectedPriceRange]);

  const handleApplyPrice = () => {
    const min = minPrice ? parseInt(minPrice, 10) : null;
    const max = maxPrice ? parseInt(maxPrice, 10) : null;
    if (min === null && max === null) {
      onSelectPriceRange(null);
    } else {
      onSelectPriceRange({ min, max });
    }
  };

  const handleClearPrice = () => {
    setMinPrice('');
    setMaxPrice('');
    onSelectPriceRange(null);
  };

  return (
    <aside className="shop-sidebar">
      <h3 className="sidebar-title">Danh Mục</h3>
      <ul className="category-list" style={{ marginBottom: '30px' }}>
        <li
          className={`category-item ${selectedCategoryId === null ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          Tất cả sản phẩm
        </li>
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`category-item ${selectedCategoryId === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.name}
          </li>
        ))}
      </ul>

      <h3 className="sidebar-title">Mức Giá</h3>
      <div className="price-filter-custom">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <input 
            type="number" 
            placeholder="Từ..." 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--primary-light)',
              color: 'var(--text)',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <input 
            type="number" 
            placeholder="Đến..." 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--primary-light)',
              color: 'var(--text)',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleApplyPrice}
            style={{
              flex: 1,
              padding: '8px 0',
              background: 'var(--accent)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'var(--transition)'
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--accent-hover)'}
            onMouseOut={(e) => e.target.style.background = 'var(--accent)'}
          >
            Áp dụng
          </button>
          <button 
            onClick={handleClearPrice}
            style={{
              flex: 1,
              padding: '8px 0',
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'var(--transition)'
            }}
            onMouseOver={(e) => { e.target.style.color = 'var(--text)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseOut={(e) => { e.target.style.color = 'var(--text-muted)'; e.target.style.background = 'transparent'; }}
          >
            Xóa
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ShopSidebar;
