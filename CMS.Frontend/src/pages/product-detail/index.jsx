import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api.js';
import ProductInfo from './ProductInfo.jsx';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);

  // Tự động chọn màu đầu tiên khi sản phẩm tải xong
  useEffect(() => {
    if (product?.colors?.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].id);
    }
  }, [product, selectedColor]);

  // Lấy thông tin chi tiết sản phẩm từ API
  useEffect(() => {
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

  const isOutOfStock = product.stockQuantity <= 0;

  // Tìm đối tượng màu đang chọn để lấy ảnh riêng (nếu có)
  const chosenColorForImage = product.colors?.find(c => c.id === selectedColor);
  const baseImageUrl = (chosenColorForImage && chosenColorForImage.imageUrl)
    ? chosenColorForImage.imageUrl
    : product.imageUrl;

  // Xử lý URL ảnh tương đối hay tuyệt đối
  const resolvedImageUrl = baseImageUrl
    ? (baseImageUrl.startsWith('http')
        ? baseImageUrl
        : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${baseImageUrl}`)
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
    const chosenColor = product.colors?.find(c => c.id === selectedColor);
    const productToCart = { ...product, selectedColor: chosenColor };
    addToCart(productToCart, quantity);
    const colorText = chosenColor ? ` (Màu: ${chosenColor.name})` : '';
    alert(`Đã thêm ${quantity} sản phẩm "${product.name}"${colorText} vào giỏ hàng!`);
  };

  return (
    <div className="product-detail-container">
      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 500 }}
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="detail-layout">
        {/* Cột trái: Ảnh sản phẩm — đổi theo màu khi click */}
        <div className="detail-gallery">
          <img src={resolvedImageUrl} alt={product.name} />
        </div>

        {/* Cột phải: Thông tin sản phẩm — dùng ProductInfo component */}
        <ProductInfo
          product={product}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          quantity={quantity}
          handleQtyChange={handleQtyChange}
          handleAddToCart={handleAddToCart}
          isOutOfStock={isOutOfStock}
        />
      </div>
    </div>
  );
}

export default ProductDetail;
