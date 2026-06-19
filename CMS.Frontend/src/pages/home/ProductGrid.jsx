import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard.jsx';

const ProductGrid = ({ featuredProducts, loadingProducts, addToCart }) => {
  if (loadingProducts) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Đang lọc sản phẩm...</div>;
  }

  if (featuredProducts.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Không có sản phẩm nào trong danh mục này.</div>;
  }

  return (
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
  );
};

export default ProductGrid;
