import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

// Component: Bảng danh sách sản phẩm đã chọn, nút tăng/giảm số lượng
const CartTable = ({ cart, updateQuantity, removeFromCart }) => {
  return (
    <div className="cart-items-list">
      {cart.map((item) => {
        const categoryName = item.categoryName || 'Sản phẩm';
        const resolvedImageUrl = item.imageUrl
          ? (item.imageUrl.startsWith('http')
              ? item.imageUrl
              : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${item.imageUrl}`)
          : 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=500&auto=format&fit=crop';

        return (
          <div key={`${item.id}-${item.selectedColor?.id || 'nocolor'}`} className="cart-item">
            <div className="cart-item-image">
              <img src={resolvedImageUrl} alt={item.name} />
            </div>
            <div className="cart-item-details">
              <span className="cart-item-category">{categoryName}</span>
              <Link to={`/product/${item.id}`} className="cart-item-name">
                {item.name}
              </Link>
              {item.selectedColor && (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                  Màu: <strong>{item.selectedColor.name}</strong>
                </span>
              )}

              <div className="cart-item-pricing">
                <span className="cart-item-price">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </span>

                {/* Nút tăng / giảm số lượng */}
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

            {/* Nút xóa sản phẩm */}
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
  );
};

export default CartTable;
