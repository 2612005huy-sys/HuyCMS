import React from 'react';

// Component: Thanh tìm kiếm nhanh và bộ đếm sản phẩm phía trên
const ShopHeader = ({ searchQuery, productCount }) => {
  return (
    <header style={{ marginBottom: '30px' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 700 }}>
        {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Cửa Hàng Công Nghệ'}
      </h1>
      <p style={{ color: 'var(--text-muted)' }}>
        {searchQuery
          ? `Tìm thấy ${productCount} sản phẩm phù hợp với yêu cầu của bạn.`
          : 'Khám phá danh sách các sản phẩm đỉnh cao được tuyển chọn tỉ mỉ.'}
      </p>
    </header>
  );
};

export default ShopHeader;
