import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import api from '../api.js';

function Shop({ addToCart }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Categories Products: GET /api/CategoriesProducts
  useEffect(() => {
    api.get('/api/CategoriesProducts')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Lỗi lấy danh sách danh mục sản phẩm từ API:", error);
      });
  }, []);

  // 2. Fetch Products matching category
  useEffect(() => {
    setLoading(true);
    let url = '/Product/GetJsonAll'; // Default fallback for all products
    if (selectedCategoryId !== null) {
      url = `/api/products/category/${selectedCategoryId}`;
    }

    api.get(url)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategoryId]);

  return (
    <div className="shop-layout-container">
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700 }}>Cửa Hàng Thời Trang</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Khám phá danh sách các thiết kế cao cấp được tuyển chọn tỉ mỉ.
        </p>
      </div>

      <div className="shop-layout">
        {/* Left Sidebar - Categories Filter */}
        <aside className="shop-sidebar">
          <h3 className="sidebar-title">Danh Mục</h3>
          <ul className="category-list">
            <li 
              className={`category-item ${selectedCategoryId === null ? 'active' : ''}`}
              onClick={() => setSelectedCategoryId(null)}
            >
              Tất cả sản phẩm
            </li>
            {categories.map((cat) => (
              <li 
                key={cat.id} 
                className={`category-item ${selectedCategoryId === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Main Grid - Products */}
        <div className="shop-products-main">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>Đang tải danh sách quần áo...</div>
          ) : products.length > 0 ? (
            <div className="products-grid" style={{ marginBottom: 0 }}>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  addToCart={addToCart} 
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Không có sản phẩm nào thuộc danh mục này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
