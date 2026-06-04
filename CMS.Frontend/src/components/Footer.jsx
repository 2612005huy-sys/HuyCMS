import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi ưu đãi mới nhất đến email của bạn.');
  };

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>NEXUS<span>.</span>TECH</h3>
          <p>Hệ thống bán lẻ laptop, điện thoại và phụ kiện công nghệ chính hãng hàng đầu Việt Nam. Cam kết giá tốt — bảo hành chính hãng.</p>
          <p style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span><MapPin size={13} style={{ display: 'inline', marginRight: 5 }} />123 Nguyễn Văn Linh, Quận 7, TP. HCM</span>
            <span><Phone size={13} style={{ display: 'inline', marginRight: 5 }} />1800 6868 (Miễn phí)</span>
          </p>
        </div>

        <div className="footer-links">
          <h4>Sản Phẩm</h4>
          <ul>
            <li><a href="/shop">Laptop Gaming</a></li>
            <li><a href="/shop">Laptop Văn phòng</a></li>
            <li><a href="/shop">Điện thoại iPhone</a></li>
            <li><a href="/shop">Điện thoại Android</a></li>
            <li><a href="/shop">Phụ kiện & Linh kiện</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Hỗ Trợ</h4>
          <ul>
            <li><a href="#!">Tra cứu đơn hàng</a></li>
            <li><a href="#!">Chính sách bảo hành</a></li>
            <li><a href="#!">Hướng dẫn mua hàng</a></li>
            <li><a href="#!">Chính sách đổi trả</a></li>
            <li><a href="#!">Trung tâm bảo hành</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Nhận Ưu Đãi Độc Quyền</h4>
          <p>Đăng ký để nhận ngay voucher giảm giá 5% và cập nhật sản phẩm công nghệ mới nhất.</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input type="email" placeholder="Email của bạn..." required />
            <button type="submit"><Mail size={16} /></button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 NEXUS.TECH. All Rights Reserved.</p>
        <p>Hệ thống cửa hàng toàn quốc — Giao hàng nhanh 2H nội thành.</p>
      </div>
    </footer>
  );
}

export default Footer;
