import React from 'react';

// Component: Bộ lọc danh mục và khoảng giá dọc bên trái
const ShopSidebar = ({ categories, selectedCategoryId, onSelectCategory }) => {
  return (
    <aside className="shop-sidebar">
      <h3 className="sidebar-title">Danh Mục</h3>
      <ul className="category-list">
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
    </aside>
  );
};

export default ShopSidebar;
