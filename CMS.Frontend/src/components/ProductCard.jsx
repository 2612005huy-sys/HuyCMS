import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

function ProductCard({ product, addToCart }) {
  const categoryName = product.categoryName || 'Thời trang';

  // Prepend backend URL if the image path is relative (e.g., /uploads/...)
  const resolvedImageUrl = product.imageUrl 
    ? (product.imageUrl.startsWith('http') 
        ? product.imageUrl 
        : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${product.imageUrl}`)
    : 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=500&auto=format&fit=crop';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image-container">
          <span className="category-tag">{categoryName}</span>
          <img src={resolvedImageUrl} alt={product.name} />
        </div>
      </Link>

      <div className="product-info">
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>
        </Link>
        <div className="product-meta">
          <span className="product-price">
            {product.price.toLocaleString('vi-VN')} đ
          </span>
          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart}
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
