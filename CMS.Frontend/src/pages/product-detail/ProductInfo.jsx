import React from 'react';
import { ShoppingCart, CheckCircle2, AlertTriangle } from 'lucide-react';

// Component: Khối hiển thị thông tin: Tên, Giá, Mô tả và nút "Mua" (Không có Size/Slider)
const ProductInfo = ({
  product,
  selectedColor,
  setSelectedColor,
  quantity,
  handleQtyChange,
  handleAddToCart,
  isOutOfStock,
}) => {
  const categoryName = product.categoryName || 'Sản phẩm';

  return (
    <div className="detail-info">
      <span className="detail-category">{categoryName}</span>
      <h1 className="detail-title">{product.name}</h1>
      <div className="detail-price">{product.price.toLocaleString('vi-VN')} đ</div>

      <div className="detail-desc-title">Thông tin sản phẩm:</div>
      <p className="detail-desc">{product.description || 'Sản phẩm được sản xuất tỉ mỉ bằng chất liệu cao cấp.'}</p>

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

      {/* Color Selector */}
      {product.colors && product.colors.length > 0 && (
        <div className="color-selector" style={{ margin: '20px 0' }}>
          <span className="quantity-label" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Màu sắc tùy chọn:
          </span>
          <div style={{ display: 'flex', gap: '12px' }}>
            {product.colors.map(color => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                title={color.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: color.hexCode || '#ccc',
                  border: selectedColor === color.id ? '2px solid var(--text)' : '2px solid var(--border)',
                  outline: selectedColor === color.id ? '3px solid var(--white)' : 'none',
                  outlineOffset: '-5px',
                  cursor: 'pointer',
                  boxShadow: selectedColor === color.id ? '0 4px 10px rgba(0,0,0,0.15)' : '0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s',
                  transform: selectedColor === color.id ? 'scale(1.1)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>
      )}

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

      {/* Buy Button */}
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
  );
};

export default ProductInfo;
