import React, { useEffect, useState } from 'react';
import { Shield, Truck, Headphones, RotateCcw } from 'lucide-react';
import api from '../../api.js';
import { mockPosts } from '../../mockData.js';
import HeroBanner from './HeroBanner.jsx';
import CategoryMenu from './CategoryMenu.jsx';
import ProductGrid from './ProductGrid.jsx';
import LatestBlog from './LatestBlog.jsx';

function Home({ addToCart }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postsRes] = await Promise.all([
          api.get('/api/CategoriesProducts'),
          api.get('/api/posts'),
        ]);

        if (catRes && catRes.data) {
          setCategories(catRes.data);
        }

        // Lấy toàn bộ sản phẩm
        try {
          const allProducts = await api.get('/Product/GetJsonAll');
          setFeaturedProducts(allProducts.data); // Hiển thị tất cả
        } catch (prodErr) {
          console.error("Lỗi tải tất cả sản phẩm:", prodErr);
          // Thử lấy category đầu tiên nếu API /Product/GetJsonAll lỗi
          if (catRes.data.length > 0) {
            const prodRes = await api.get(`/api/products/category/${catRes.data[0].id}`);
            setFeaturedProducts(prodRes.data);
          }
        }
        
        setPosts(postsRes.data.slice(0, 3));
      } catch (error) {
        console.error('Lỗi tải dữ liệu trang chủ:', error);
        try {
          const all = await api.get('/Product/GetJsonAll');
          setFeaturedProducts(all.data); // Hiển thị tất cả
        } catch { }
        // Dùng dữ liệu mẫu nếu API bị lỗi để hiển thị bài viết
        setPosts(mockPosts.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    try {
      setLoadingProducts(true);
      setSelectedCategory(categoryId);
      if (!categoryId) {
        const res = await api.get('/Product/GetJsonAll');
        setFeaturedProducts(res.data);
      } else {
        const res = await api.get(`/api/products/category/${categoryId}`);
        setFeaturedProducts(res.data);
      }
    } catch (err) {
      console.error("Lỗi lọc sản phẩm:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <HeroBanner />

      {/* Trust Badges */}
      <section className="trust-badges">
        {[
          { icon: <Shield size={24} />, title: 'Hàng Chính Hãng 100%', sub: 'Tem nhập khẩu đầy đủ' },
          { icon: <Truck size={24} />, title: 'Giao Hàng 2H', sub: 'Nội thành TP.HCM & HN' },
          { icon: <Headphones size={24} />, title: 'Hỗ Trợ 24/7', sub: 'Hotline: 1800 6868' },
          { icon: <RotateCcw size={24} />, title: 'Đổi Trả 30 Ngày', sub: 'Không cần lý do' },
        ].map((item, i) => (
          <div key={i} className="trust-badge-item">
            <div className="trust-icon">{item.icon}</div>
            <div>
              <div className="trust-title">{item.title}</div>
              <div className="trust-sub">{item.sub}</div>
            </div>
          </div>
        ))}
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Đang tải sản phẩm...
        </div>
      ) : (
        <>
          <CategoryMenu 
            categories={categories} 
            selectedCategory={selectedCategory} 
            handleCategoryClick={handleCategoryClick} 
          />

          <ProductGrid 
            featuredProducts={featuredProducts} 
            loadingProducts={loadingProducts} 
            addToCart={addToCart} 
          />

          <LatestBlog posts={posts} />
        </>
      )}
    </div>
  );
}

export default Home;
