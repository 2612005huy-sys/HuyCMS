import React from 'react';
import NewsCard from '../../components/NewsCard.jsx';

const LatestBlog = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <section className="news-section">
      <div className="section-header">
        <div>
          <h2>Tin Tức Công Nghệ</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Đánh giá, so sánh và xu hướng công nghệ mới nhất
          </p>
        </div>
      </div>
      <div className="news-grid">
        {posts.map(post => <NewsCard key={post.id} post={post} />)}
      </div>
    </section>
  );
};

export default LatestBlog;
