import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../api.js';

function Orders({ currentUser }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const customerId = currentUser.id || currentUser.Id;
    if (!customerId) {
      console.error("Không tìm thấy ID người dùng:", currentUser);
      setLoading(false);
      return;
    }

    api.get(`/api/customers/${customerId}/orders`)
      .then(res => {
        setOrders(res.data);
      })
      .catch(err => {
        console.error("Lỗi khi tải lịch sử đơn hàng:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="status-badge pending"><Clock size={14} /> Chờ duyệt</span>;
      case 1:
        return <span className="status-badge processing"><Package size={14} /> Đang giao hàng</span>;
      case 2:
        return <span className="status-badge completed"><CheckCircle2 size={14} /> Đã hoàn thành</span>;
      case -1:
        return <span className="status-badge cancelled"><XCircle size={14} /> Đã hủy</span>;
      default:
        return <span className="status-badge pending">Chờ xử lý</span>;
    }
  };

  const resolveImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200&auto=format&fit=crop';
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${path}`;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 0' }}>Đang tải lịch sử đơn hàng...</div>;
  }

  return (
    <div className="orders-page-container">
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package size={32} color="var(--accent)" />
          Lịch Sử Đơn Hàng
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Xem lại các đơn hàng bạn đã đặt mua tại NEXUS.TECH
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <Package size={64} style={{ opacity: 0.2, marginBottom: '20px' }} />
          <h3>Bạn chưa có đơn hàng nào!</h3>
          <p>Hãy khám phá các sản phẩm công nghệ đỉnh cao ngay.</p>
          <Link to="/shop" className="cta-button" style={{ marginTop: '20px' }}>
            Khám phá Cửa Hàng
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <span>Mã đơn: <strong>#{order.id}</strong></span>
                  <span className="order-date">{order.orderDate}</span>
                </div>
                <div className="order-status">
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="order-body">
                <div className="order-products-preview">
                  {order.details.map((item, idx) => (
                    <div key={idx} className="order-preview-item" title={item.productName}>
                      <img src={resolveImageUrl(item.imageUrl)} alt={item.productName} />
                    </div>
                  ))}
                  <div className="order-products-text">
                    {order.details[0]?.productName} 
                    {order.itemCount > 1 ? ` và ${order.itemCount - 1} sản phẩm khác` : ''}
                  </div>
                </div>
                
                <div className="order-total-price">
                  Tổng tiền: <strong>{order.totalAmount.toLocaleString('vi-VN')} đ</strong>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
