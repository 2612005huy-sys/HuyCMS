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

  // 2. Fetch Products matching category and search query
  useEffect(() => {
    setLoading(true);
    let url = '/api/products';
    if (selectedCategoryId !== null) {
      url = `/api/products/category/${selectedCategoryId}`;
    }

    api.get(url)
      .then(response => {
        let data = response.data;

        // Lọc theo từ khóa tìm kiếm (nếu có)
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          data = data.filter(p =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
          );
        }

        setProducts(data);
      })
      .catch(error => {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategoryId, searchQuery]);

  const isEmpty = !loading && products.length === 0;

  return (
    <div className="shop-layout-container">
      {/* Thanh tiêu đề + bộ đếm */}
      <ShopHeader searchQuery={searchQuery} productCount={products.length} />

      <div className="shop-layout">
        {/* Cột trái: Danh mục lọc */}
        <ShopSidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        {/* Cột phải: Lưới sản phẩm */}
        <div className="shop-products-main">
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
