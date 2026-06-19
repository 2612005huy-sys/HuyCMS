import React from 'react';

const CategoryMenu = ({ categories, selectedCategory, handleCategoryClick }) => {
  if (categories.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
      <button 
        onClick={() => handleCategoryClick(null)}
        style={{
          padding: '8px 20px',
          borderRadius: '30px',
          whiteSpace: 'nowrap',
          fontWeight: '600',
          fontSize: '0.95rem',
          cursor: 'pointer',
          border: selectedCategory === null ? 'none' : '1px solid var(--border)',
          background: selectedCategory === null ? 'var(--accent)' : 'var(--white)',
          color: selectedCategory === null ? '#fff' : 'var(--text)',
          transition: 'all 0.2s'
        }}>
        Tất cả sản phẩm
      </button>
      {categories.map(cat => (
        <button 
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id)}
          style={{
            padding: '8px 20px',
            borderRadius: '30px',
            whiteSpace: 'nowrap',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            border: selectedCategory === cat.id ? 'none' : '1px solid var(--border)',
            background: selectedCategory === cat.id ? 'var(--accent)' : 'var(--white)',
            color: selectedCategory === cat.id ? '#fff' : 'var(--text)',
            transition: 'all 0.2s'
          }}>
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
