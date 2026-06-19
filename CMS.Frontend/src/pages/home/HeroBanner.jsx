import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const heroImages = [
  "/banner1.png",
  "/banner2.jpg",
  "/banner3.jpg",
  "/banner4.jpg"
];

const HeroBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-badge">⚡ KHUYẾN MÃI THÁNG 6 — GIẢM ĐẾN 30%</span>
        <h1>Công Nghệ Đỉnh Cao — Giá Tốt Nhất Thị Trường</h1>
        <p>Laptop gaming, điện thoại flagship, phụ kiện chính hãng. Bảo hành toàn quốc — giao hàng 2 giờ nội thành TP.HCM.</p>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/shop" className="cta-button">Mua ngay →</Link>
          <Link to="/shop" className="cta-button"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', boxShadow: 'none' }}>
            Xem tất cả
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-image-wrapper">
          <img
            key={currentImageIndex}
            src={heroImages[currentImageIndex]}
            alt="Công nghệ đỉnh cao"
            className="fade-image"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
