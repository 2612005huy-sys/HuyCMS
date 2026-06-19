import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CartTable from './CartTable.jsx';

function Cart({ cart, updateQuantity, removeFromCart }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 1000000 ? 0 : 35000; // Miễn phí vận chuyển cho đơn trên 1 triệu
  const total = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <span className="cart-empty-icon">🛍️</span>
        <h2>Giỏ hàng trống!</h2>
        <p>Hiện chưa có sản phẩm nào được thêm vào giỏ hàng của bạn.</p>
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
        {/* Cột trái: Danh sách sản phẩm — dùng CartTable component */}
        <CartTable
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />

        {/* Cột phải: Tóm tắt tổng tiền */}
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
