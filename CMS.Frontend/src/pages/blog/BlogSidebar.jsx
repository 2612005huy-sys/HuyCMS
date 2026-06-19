import React from 'react';

// Component: Cột bên phải hiển thị danh mục bài viết (Category) để click lọc
const BlogSidebar = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="blog-categories">
      {categories.map(cat => (
        <button
          key={cat}
          className={`blog-cat-btn${activeCategory === cat ? ' active' : ''}`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default BlogSidebar;
