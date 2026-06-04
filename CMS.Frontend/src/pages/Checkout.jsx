import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ArrowRight, ShoppingBag, Truck, User, Phone, MapPin, FileText } from 'lucide-react';
import api from '../api.js';

function Checkout({ cart, clearCart, currentUser }) {
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setShippingInfo({
        fullName: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        notes: '',
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 1000000 ? 0 : 35000;
  const total = subtotal + shippingFee;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);

    const orderPayload = {
      customerId: currentUser ? (currentUser.id || currentUser.Id) : null,
      customerName: shippingInfo.fullName,
      phone: shippingInfo.phone,
      address: shippingInfo.address,
      notes: shippingInfo.notes,
      orderDetails: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    api.post('/api/orders', orderPayload)
      .then(response => {
        setPlacedOrderInfo(response.data);
        setOrderPlaced(true);
        clearCart();
      })
      .catch(error => {
        console.error("Lỗi đặt hàng:", error);
        alert("Lỗi lưu đơn hàng vào hệ thống. Vui lòng kiểm tra lại kết nối API!");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Màn hình thông báo đặt hàng thành công
  if (orderPlaced) {
    return (
      <div className="order-success-container" style={{ maxW: '600px', margin: '80px auto', padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: '#e6f4ea', borderRadius: '50%', marginBottom: '24px' }}>
          <CheckCircle2 size={48} color="#137333" />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Đặt hàng thành công!</h2>
        <p style={{ color: '#4b5563', marginBottom: '32px' }}>Cám ơn bạn đã lựa chọn mua sắm tại <strong>NEXUS . TECH</strong>.</p>

        {placedOrderInfo && (
          <div className="order-details-box" style={{ textAlign: 'left', backgroundColor: '#f9fafb', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', color: '#111827' }}>
              Mã đơn hàng: <span style={{ color: '#2563eb' }}>#{placedOrderInfo.id}</span>
            </h3>
            <p style={{ margin: '8px 0', color: '#374151' }}><strong>Người nhận:</strong> {shippingInfo.fullName}</p>
            <p style={{ margin: '8px 0', color: '#374151' }}><strong>Số điện thoại:</strong> {shippingInfo.phone}</p>
            <p style={{ margin: '8px 0', color: '#374151' }}><strong>Địa chỉ giao:</strong> {shippingInfo.address}</p>
            <p style={{ margin: '8px 0', color: '#374151' }}><strong>Thời gian:</strong> {new Date().toLocaleString('vi-VN')}</p>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#111827' }}>Tổng thanh toán:</span>
              <span style={{ fontSize: '1.4rem', color: '#ef4444', fontWeight: 700 }}>{total.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        )}

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#111827', color: '#fff', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#1f2937'} onMouseLeave={(e) => e.target.style.backgroundColor = '#111827'}>
          Tiếp tục mua sắm <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Tiêu đề trang gọn gàng */}
      <div style={{ marginBottom: '40px', borderBottom: '1px solid #f3f4f6', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '-0.5px' }}>Thanh Toán</h1>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '1rem' }}>
          Vui lòng kiểm tra lại giỏ hàng và điền thông tin nhận hàng chuẩn xác.
        </p>
      </div>

      {/* Bố cục Layout Flexbox / Grid */}
      <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '40px', alignItems: 'start' }}>

        {/* CỘT TRÁI - FORM NHẬP THÔNG TIN KHÁCH HÀNG */}
        <div className="checkout-form-container" style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={20} className="text-primary" /> Thông tin giao hàng
          </h3>

          <form onSubmit={handleSubmitOrder} className="checkout-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="fullName" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={15} /> Họ và tên khách hàng *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                placeholder="Nhập đầy đủ họ tên người nhận"
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="phone" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={15} /> Số điện thoại liên lạc *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={shippingInfo.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại nhận hàng"
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="address" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} /> Địa chỉ nhận hàng *</label>
              <textarea
                id="address"
                name="address"
                required
                rows={3}
                value={shippingInfo.address}
                onChange={handleInputChange}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', resize: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="notes" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={15} /> Ghi chú vận chuyển (nếu có)</label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={shippingInfo.notes}
                onChange={handleInputChange}
                placeholder="Ví dụ: Giao ngoài giờ hành chính, gọi trước khi đến 15 phút..."
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', resize: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Nút thanh toán lớn cực kỳ nổi bật */}
            <button
              type="submit"
              className="submit-order-btn"
              disabled={submitting || cart.length === 0}
              style={{ marginTop: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              {submitting ? "Đang xử lý đơn hàng..." : `Xác nhận & Đặt hàng liền — ${total.toLocaleString('vi-VN')} đ`}
            </button>
          </form>
        </div>

        {/* CỘT PHẢI - TOÀN BỘ DANH SÁCH TÓM TẮT ĐƠN HÀNG */}
        <div className="checkout-summary" style={{ backgroundColor: '#f9fafb', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', position: 'sticky', top: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={20} /> Đơn hàng của bạn
            </h3>
            <Link to="/cart" style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sửa giỏ hàng</Link>
          </div>

          {/* Khung hiển thị danh sách sản phẩm cuộn gọn gàng */}
          <div className="checkout-items-preview" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '240px', overflowY: 'auto', marginBottom: '24px', paddingRight: '4px' }}>
            {cart.map(item => (
              <div key={item.id} className="preview-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                  <span className="item-qty-tag" style={{ backgroundColor: '#e5e7eb', color: '#374151', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>{item.quantity}x</span>
                  <span className="item-name-preview" title={item.name} style={{ fontWeight: 500, fontSize: '0.95rem', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                </div>
                <span className="item-price-preview" style={{ fontWeight: 600, fontSize: '0.95rem', color: '#4b5563', marginLeft: '10px', flexShrink: 0 }}>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
              </div>
            ))}
          </div>

          {/* Phần tính tiền minh bạch */}
          <div className="checkout-totals" style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.95rem' }}>
              <span>Tạm tính tiền hàng:</span>
              <span style={{ fontWeight: 500 }}>{subtotal.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.95rem' }}>
              <span>Phí vận chuyển:</span>
              <span style={{ fontWeight: 500, color: shippingFee === 0 ? '#10b981' : '#4b5563' }}>
                {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} đ`}
              </span>
            </div>

            <div className="summary-row total" style={{ marginTop: '8px', paddingTop: '16px', borderTop: '2px dashed #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111827' }}>Tổng cộng:</span>
              <span style={{ fontSize: '1.5rem', color: '#ef4444', fontWeight: 800 }}>{total.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;