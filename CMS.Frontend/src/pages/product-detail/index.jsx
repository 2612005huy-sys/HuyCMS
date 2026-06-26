import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api.js';
import ProductInfo from './ProductInfo.jsx';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // ──── TẤT CẢ HOOKS PHẢI KHAI BÁO Ở ĐÂY, TRƯỚC MỌI RETURN ────
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  // Phân tích ma trận tồn kho biến thể (xử lý cả dạng string JSON lẫn mảng)
  const variantInventories = useMemo(() => {
    if (!product || !product.variantInventories) return [];
    if (typeof product.variantInventories === 'string') {
      try {
        return JSON.parse(product.variantInventories);
      } catch (e) {
        console.error("Lỗi parse variantInventories:", e);
        return [];
      }
    }
    if (Array.isArray(product.variantInventories)) {
      return product.variantInventories;
    }
    return [];
  }, [product]);

  const uniqueStorages = useMemo(
    () => [...new Set(variantInventories.map(v => v.Storage))],
    [variantInventories]
  );

  // Tự động chọn màu và dung lượng đầu tiên khi sản phẩm tải xong
  useEffect(() => {
    if (product?.colors?.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].id);
    }
    if (uniqueStorages.length > 0 && !selectedStorage) {
      setSelectedStorage(uniqueStorages[0]);
    }
  }, [product, selectedColor, selectedStorage, uniqueStorages]);

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

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // ──── SAU KHI ĐÃ KHAI BÁO HẾT HOOKS MỚI ĐƯỢC DÙNG RETURN SỚM ────
  if (loading) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
        Đang tải thông tin sản phẩm...
      </div>
    );
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

  // Tìm biến thể đang chọn (kết hợp màu sắc + dung lượng)
  const currentVariant = variantInventories.find(
    v => v.ColorId === selectedColor && v.Storage === selectedStorage
  );

  // Xác định tồn kho, giá bán và trạng thái hết hàng
  const hasVariants = variantInventories.length > 0;
  const variantStock = currentVariant ? currentVariant.Stock : 0;
  const displayPrice = product.price + (currentVariant ? currentVariant.PriceDifference : 0);
  const isOutOfStock = hasVariants ? (variantStock <= 0) : (product.stockQuantity <= 0);
  const displayStock = hasVariants ? variantStock : product.stockQuantity;

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
    } else if (type === 'inc' && quantity < displayStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    try {
      // Validate with API for latest stock
      const res = await api.get(`/api/products/${product.id}`);
      const latestProduct = res.data;
      const latestVariantInventories = Array.isArray(latestProduct.variantInventories)
        ? latestProduct.variantInventories
        : (typeof latestProduct.variantInventories === 'string' ? JSON.parse(latestProduct.variantInventories || '[]') : []);
      const latestVariant = latestVariantInventories.find(
        v => v.ColorId === selectedColor && v.Storage === selectedStorage
      );
      const latestStock = hasVariants ? (latestVariant ? latestVariant.Stock : 0) : latestProduct.stockQuantity;

      if (quantity > latestStock) {
        showToast(`Lỗi: Số lượng sản phẩm tồn kho chỉ còn ${latestStock}.`, 'error');
        return;
      }

      const chosenColor = product.colors?.find(c => c.id === selectedColor);
      const chosenStorage = selectedStorage;
      const productToCart = { 
        ...product, 
        price: displayPrice, 
        selectedColor: chosenColor, 
        selectedStorage: chosenStorage 
      };
      
      addToCart(productToCart, quantity);
      const colorText = chosenColor ? ` (${chosenColor.name})` : '';
      const storageText = chosenStorage ? ` [${chosenStorage}]` : '';
      showToast(`Đã thêm ${quantity} sản phẩm "${product.name}"${colorText}${storageText} vào giỏ hàng!`, 'success');
    } catch (error) {
      showToast('Lỗi kết nối máy chủ khi kiểm tra tồn kho.', 'error');
    }
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
          selectedStorage={selectedStorage}
          setSelectedStorage={setSelectedStorage}
          uniqueStorages={uniqueStorages}
          displayPrice={displayPrice}
          displayStock={displayStock}
          quantity={quantity}
          handleQtyChange={handleQtyChange}
          handleAddToCart={handleAddToCart}
          isOutOfStock={isOutOfStock}
        />
      </div>

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: toastType === 'error' ? '#ff4757' : '#2ed573',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontWeight: 'bold',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
