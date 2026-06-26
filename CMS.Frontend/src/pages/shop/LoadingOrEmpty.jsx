import React from 'react';

// Component: Xử lý UX/UI trạng thái tải mạng hoặc trống kết quả
const LoadingOrEmpty = ({ loading, empty, emptyMessage }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <div style={{
          width: '40px', height: '40px', border: '4px solid var(--border)',
          borderTop: '4px solid var(--accent)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
        }} />
        Đang tải danh sách sản phẩm...
      </div>
    );
  }

  if (empty) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <img 
          src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" 
          alt="Không có sản phẩm" 
          style={{ width: '200px', opacity: '0.6', marginBottom: '20px' }} 
        />
        <p style={{ fontSize: '1.1rem' }}>{emptyMessage || 'Không có sản phẩm nào phù hợp với tìm kiếm của bạn.'}</p>
      </div>
    );
  }

  return null;
};

export default LoadingOrEmpty;
