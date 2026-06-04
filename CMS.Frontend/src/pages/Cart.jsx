import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

function Cart({ cart, updateQuantity, removeFromCart }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 1000000 ? 0 : 35000; // Free shipping above 1 million VND
  const total = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <span className="cart-empty-icon">🛍️</span>
        <h2>Giỏ hàng trống!</h2>
        <p>Hiện chưa có mẫu quần áo nào được thêm vào giỏ hàng của bạn.</p>
        <Link to="/shop" className="cta-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          Khám phá cửa hàng ngay <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700 }}>Giỏ Hàng Của Bạn</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Xem lại danh sách sản phẩm và chuẩn bị thanh toán.
        </p>
      </div>

      <div className="cart-layout">
        {/* Left Side - Cart Items */}
        <div className="cart-items-list">
          {cart.map((item) => {
            const categoryName = item.categoryName || 'Thời trang';
            const resolvedImageUrl = item.imageUrl 
              ? (item.imageUrl.startsWith('http') 
                  ? item.imageUrl 
                  : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${item.imageUrl}`)
              : 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=500&auto=format&fit=crop';

            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={resolvedImageUrl} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <span className="cart-item-category">{categoryName}</span>
                  <Link to={`/product/${item.id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  
                  <div className="cart-item-pricing">
                    <span className="cart-item-price">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </span>
                    
                    {/* Quantity controls */}
                    <div className="quantity-controls" style={{ height: '36px' }}>
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ height: '34px', width: '34px' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-val" style={{ width: '34px' }}>{item.quantity}</span>
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ height: '34px', width: '34px' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button 
                  className="cart-item-remove"
                  onClick={() => {
                    removeFromCart(item.id);
                    alert(`Đã xóa "${item.name}" khỏi giỏ hàng.`);
                  }}
                  title="Xóa sản phẩm"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Side - Summary block */}
        <div className="cart-summary">
          <h3 className="summary-title">Tạm tính</h3>
          <div className="summary-row">
            <span>Tiền hàng:</span>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
              {subtotal.toLocaleString('vi-VN')} đ
            </span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
              {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} đ`}
            </span>
          </div>
          {shippingFee > 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-8px', marginBottom: '16px' }}>
              * Miễn phí vận chuyển cho đơn hàng trên 1.000.000 đ
            </p>
          )}
          
          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString('vi-VN')} đ</span>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Tiến hành đặt hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
