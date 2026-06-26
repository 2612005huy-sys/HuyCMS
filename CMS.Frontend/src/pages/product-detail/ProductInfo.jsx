import React from 'react';
import { ShoppingCart, CheckCircle2, AlertTriangle } from 'lucide-react';

// Component: Khối hiển thị thông tin: Tên, Giá, Mô tả và nút "Mua"
const ProductInfo = ({
  product,
  selectedColor,
  setSelectedColor,
  selectedStorage,
  setSelectedStorage,
  uniqueStorages,
  displayPrice,
  displayStock,
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
      <div className="detail-price">{displayPrice.toLocaleString('vi-VN')} đ</div>

      <div className="detail-desc-title">Thông tin sản phẩm:</div>
      <p className="detail-desc">{product.description || 'Sản phẩm được sản xuất tỉ mỉ bằng chất liệu cao cấp.'}</p>

      <ul className="detail-meta-list">
        <li className="detail-meta-item">
          <span className="detail-meta-label">Mã sản phẩm:</span>
          <span className="detail-meta-value">AR-{product.id}</span>
        </li>
        <li className="detail-meta-item">
          <span className="detail-meta-label">Đã bán:</span>
          <span className="detail-meta-value" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{product.soldCount || 0} sản phẩm</span>
        </li>
        <li className="detail-meta-item">
          <span className="detail-meta-label">Trạng thái:</span>
          <span className="detail-meta-value">
            {isOutOfStock ? (
              <span className="stock-status out-of-stock" style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                <AlertTriangle size={16} /> Hết hàng cấu hình này
              </span>
            ) : (
              <span className="stock-status in-stock" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                <CheckCircle2 size={16} /> Còn hàng ({displayStock} sản phẩm trong kho)
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
                  outline: selectedColor === color.id ? '3px solid #ffffff' : 'none',
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

      {/* Storage Selector (GB) */}
      {uniqueStorages && uniqueStorages.length > 0 && (
        <div className="storage-selector" style={{ margin: '20px 0' }}>
          <span className="quantity-label" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Dung lượng bộ nhớ:
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {uniqueStorages.map(storage => (
              <button
                key={storage}
                onClick={() => setSelectedStorage(storage)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: selectedStorage === storage ? '2px solid var(--accent)' : '1px solid var(--border)',
                  backgroundColor: selectedStorage === storage ? 'var(--accent-light)' : 'transparent',
                  color: selectedStorage === storage ? 'var(--accent)' : 'var(--text)',
                  fontWeight: selectedStorage === storage ? 'bold' : 'normal',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {storage}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity selector */}
      {!isOutOfStock && (
        <div className="quantity-selector" style={{ marginTop: '20px' }}>
          <span className="quantity-label" style={{ fontWeight: 'bold' }}>Số lượng mua:</span>
          <div className="quantity-controls">
            <button className="qty-btn" onClick={() => handleQtyChange('dec')}>-</button>
            <span className="qty-val">{quantity}</span>
            <button className="qty-btn" onClick={() => handleQtyChange('inc')}>+</button>
          </div>
        </div>
      )}

      {/* Buy Button */}
      <div className="buy-actions" style={{ marginTop: '24px' }}>
        <button
          className="btn-primary-action"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          style={{
            opacity: isOutOfStock ? 0.6 : 1,
            cursor: isOutOfStock ? 'not-allowed' : 'pointer'
          }}
        >
          <ShoppingCart size={20} />
          {isOutOfStock ? 'Cấu hình này đã hết hàng' : 'Thêm vào giỏ hàng'}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
