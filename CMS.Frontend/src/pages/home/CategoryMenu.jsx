import React from 'react';

const CategoryMenu = ({ categories, selectedCategory, handleCategoryClick }) => {
  if (categories.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
      <div 
        onClick={() => handleCategoryClick(null)}
        style={{
          padding: '12px 28px',
          borderRadius: '30px',
          background: selectedCategory === null ? 'var(--accent)' : 'var(--card-bg)',
          border: `1px solid ${selectedCategory === null ? 'var(--accent)' : 'var(--card-border)'}`,
          color: selectedCategory === null ? '#fff' : 'var(--text)',
          cursor: 'pointer',
          transition: 'var(--transition)',
          fontWeight: '600',
          fontSize: '15px',
          boxShadow: selectedCategory === null ? 'var(--glow-accent)' : 'var(--shadow-sm)',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(10px)'
        }}>
        Tất cả
      </div>
      {categories.map(cat => (
        <div 
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id)}
          style={{
            padding: '12px 28px',
            borderRadius: '30px',
            background: selectedCategory === cat.id ? 'var(--accent)' : 'var(--card-bg)',
            border: `1px solid ${selectedCategory === cat.id ? 'var(--accent)' : 'var(--card-border)'}`,
            color: selectedCategory === cat.id ? '#fff' : 'var(--text)',
            cursor: 'pointer',
            transition: 'var(--transition)',
            fontWeight: '600',
            fontSize: '15px',
            boxShadow: selectedCategory === cat.id ? 'var(--glow-accent)' : 'var(--shadow-sm)',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)'
          }}>
          {cat.name}
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
