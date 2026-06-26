import React, { useEffect, useState } from 'react';
import api from '../../api.js';
import ProductCard from '../../components/ProductCard.jsx';
import { Flame } from 'lucide-react';

function HotProducts({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products/hot')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="product-section" style={{ 
      padding: '80px 0', 
      background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.4) 0%, rgba(11, 15, 25, 1) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'rgba(236, 72, 153, 0.1)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '10%',
        width: '350px',
        height: '350px',
        background: 'rgba(99, 102, 241, 0.1)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div className="section-header" style={{ 
        textAlign: 'center', 
        marginBottom: '60px',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '12px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          <Flame size={38} color="#ff758c" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 117, 140, 0.6))' }} /> 
          Sản phẩm bán chạy
        </h2>
        <p style={{ 
          color: 'var(--text-muted)',
          fontSize: '1.1rem',
          marginTop: '15px',
          fontWeight: '500',
          maxWidth: '600px',
          margin: '15px auto 0'
        }}>
          Khám phá top những sản phẩm được yêu thích và săn đón nhiều nhất
        </p>
      </div>
      <div className="product-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '30px', 
          padding: '0 5%',
          position: 'relative',
          zIndex: 1
      }}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </section>
  );
}

export default HotProducts;
