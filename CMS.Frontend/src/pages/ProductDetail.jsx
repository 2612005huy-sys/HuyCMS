import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../api.js';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /api/products/{id}
    api.get(`/api/products/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải thông tin sản phẩm...</div>;
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ marginBottom: '16px' }}>Không tìm thấy sản phẩm!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Sản phẩm có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/shop" className="cta-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const categoryName = product.categoryName || 'Thời trang';
  const isOutOfStock = product.stockQuantity <= 0;

  // Resolve relative database image URL
  const resolvedImageUrl = product.imageUrl 
    ? (product.imageUrl.startsWith('http') 
        ? product.imageUrl 
        : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${product.imageUrl}`)
    : 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=500&auto=format&fit=crop';

  const handleQtyChange = (type) => {
    if (type === 'dec' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'inc' && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    alert(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="product-detail-container">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 500 }}
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="detail-layout">
        {/* Left Column - Product Image */}
        <div className="detail-gallery">
          <img src={resolvedImageUrl} alt={product.name} />
        </div>

        {/* Right Column - Product details */}
        <div className="detail-info">
          <span className="detail-category">{categoryName}</span>
          <h1 className="detail-title">{product.name}</h1>
          <div className="detail-price">{product.price.toLocaleString('vi-VN')} đ</div>
          
          <div className="detail-desc-title">Thông tin sản phẩm:</div>
          <p className="detail-desc">{product.description || "Sản phẩm được may gia công tỉ mỉ bằng chất liệu cao cấp."}</p>

          <ul className="detail-meta-list">
            <li className="detail-meta-item">
              <span className="detail-meta-label">Mã sản phẩm:</span>
              <span className="detail-meta-value">AR-{product.id}</span>
            </li>
            <li className="detail-meta-item">
              <span className="detail-meta-label">Trạng thái:</span>
              <span className="detail-meta-value">
                {isOutOfStock ? (
                  <span className="stock-status out-of-stock">
                    <AlertTriangle size={16} /> Hết hàng
                  </span>
                ) : (
                  <span className="stock-status in-stock">
                    <CheckCircle2 size={16} /> Còn hàng ({product.stockQuantity} sản phẩm trong kho)
                  </span>
                )}
              </span>
            </li>
          </ul>

          {/* Quantity selector */}
          {!isOutOfStock && (
            <div className="quantity-selector">
              <span className="quantity-label">Số lượng:</span>
              <div className="quantity-controls">
                <button className="qty-btn" onClick={() => handleQtyChange('dec')}>-</button>
                <span className="qty-val">{quantity}</span>
                <button className="qty-btn" onClick={() => handleQtyChange('inc')}>+</button>
              </div>
            </div>
          )}

          {/* Buy Buttons */}
          <div className="buy-actions">
            <button 
              className="btn-primary-action"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart size={20} />
              {isOutOfStock ? 'Hết hàng tạm thời' : 'Thêm vào giỏ hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
