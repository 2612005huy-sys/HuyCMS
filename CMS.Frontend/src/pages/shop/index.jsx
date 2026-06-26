import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api.js';
import ShopHeader from './ShopHeader.jsx';
import ShopSidebar from './ShopSidebar.jsx';
import ProductList from './ProductList.jsx';
import LoadingOrEmpty from './LoadingOrEmpty.jsx';

function Shop({ addToCart }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Nhận keyword từ URL nếu có tìm kiếm
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';

  // Các state mới cho bộ lọc
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  // Đồng bộ search query từ URL với local state
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // 1. Fetch Categories Products
  useEffect(() => {
    api.get('/api/CategoriesProducts')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Lỗi lấy danh sách danh mục sản phẩm từ API:", error);
      });
  }, []);

  // 2. Fetch Products matching category, search query, and price range
  useEffect(() => {
    setLoading(true);
    let url = '/api/products';
    if (selectedCategoryId !== null) {
      url = `/api/products/category/${selectedCategoryId}`;
    }

    // Build query params
    const params = new URLSearchParams();
    if (localSearchQuery) params.append('keyword', localSearchQuery);
    if (selectedPriceRange && selectedPriceRange.min !== null) params.append('minPrice', selectedPriceRange.min);
    if (selectedPriceRange && selectedPriceRange.max !== null) params.append('maxPrice', selectedPriceRange.max);
    
    const queryString = params.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
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
  }, [selectedCategoryId, localSearchQuery, selectedPriceRange]);

  const isEmpty = !loading && products.length === 0;

  return (
    <div className="shop-layout-container">
      {/* Thanh tiêu đề + bộ đếm */}
      <ShopHeader searchQuery={localSearchQuery} productCount={products.length} />

      <div className="shop-layout">
        {/* Cột trái: Danh mục lọc */}
        <ShopSidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          selectedPriceRange={selectedPriceRange}
          onSelectPriceRange={setSelectedPriceRange}
        />

        {/* Cột phải: Lưới sản phẩm */}
        <div className="shop-products-main">
          {/* Smart Search Bar */}
          <div className="shop-search-bar" style={{ marginBottom: '30px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Tìm kiếm thông minh trong cửa hàng..." 
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                paddingLeft: '45px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                color: 'var(--text)',
                outline: 'none',
                fontSize: '1.05rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'var(--transition)'
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = 'var(--glow-accent)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; }}
            />
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>

          {(loading || isEmpty) ? (
            <LoadingOrEmpty loading={loading} empty={isEmpty} />
          ) : (
            <ProductList products={products} addToCart={addToCart} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
