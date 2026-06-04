import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import NewsCard from '../components/NewsCard.jsx';
import { ArrowRight, Shield, Truck, Headphones, RotateCcw } from 'lucide-react';
import api from '../api.js';

function Home({ addToCart }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postsRes] = await Promise.all([
          api.get('/api/CategoriesProducts'),
          api.get('/api/posts'),
        ]);

        // Lấy sản phẩm từ category đầu tiên có trong DB
        const cats = catRes.data;
        if (cats.length > 0) {
          const prodRes = await api.get(`/api/products/category/${cats[0].id}`);
          setFeaturedProducts(prodRes.data.slice(0, 4));
        } else {
          const all = await api.get('/Product/GetJsonAll');
          setFeaturedProducts(all.data.slice(0, 4));
        }
        setPosts(postsRes.data.slice(0, 3));
      } catch (error) {
        console.error('Lỗi tải dữ liệu trang chủ:', error);
        try {
          const all = await api.get('/Product/GetJsonAll');
          setFeaturedProducts(all.data.slice(0, 4));
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">⚡ KHUYẾN MÃI THÁNG 6 — GIẢM ĐẾN 30%</span>
          <h1>Công Nghệ Đỉnh Cao — Giá Tốt Nhất Thị Trường</h1>
          <p>Laptop gaming, điện thoại flagship, phụ kiện chính hãng. Bảo hành toàn quốc — giao hàng 2 giờ nội thành TP.HCM.</p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/shop" className="cta-button">Mua ngay →</Link>
            <Link to="/shop" className="cta-button"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', boxShadow: 'none' }}>
              Xem tất cả
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop"
              alt="Laptop công nghệ cao"
            />
          </div>
        </div>
      </section>

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
          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section style={{ marginBottom: '60px' }}>
              <div className="section-header">
                <div>
                  <h2>Sản Phẩm Nổi Bật</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                    Laptop & điện thoại được mua nhiều nhất tuần này
                  </p>
                </div>
                <Link to="/shop" className="view-all-link">Xem tất cả <ArrowRight size={16} /></Link>
              </div>
              <div className="products-grid">
                {featuredProducts.map(p => (
                  <ProductCard key={p.id} product={p} addToCart={addToCart} />
                ))}
              </div>
            </section>
          )}

          {/* Blog Section */}
          {posts.length > 0 && (
            <section className="news-section">
              <div className="section-header">
                <div>
                  <h2>Tin Tức Công Nghệ</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                    Đánh giá, so sánh và xu hướng công nghệ mới nhất
                  </p>
                </div>
              </div>
              <div className="news-grid">
                {posts.map(post => <NewsCard key={post.id} post={post} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
