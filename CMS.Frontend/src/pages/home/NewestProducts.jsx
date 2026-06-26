import React, { useEffect, useState } from 'react';
import api from '../../api.js';
import ProductCard from '../../components/ProductCard.jsx';
import { Sparkles } from 'lucide-react';

function NewestProducts({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products/newest')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="product-section" style={{ padding: '60px 0' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Sparkles size={32} color="#0984e3" /> SẢN PHẨM MỚI NHẤT
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Cập nhật những xu hướng thời trang mới nhất</p>
      </div>
      <div className="product-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '30px', 
          padding: '0 5%' 
      }}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </section>
  );
}

export default NewestProducts;
