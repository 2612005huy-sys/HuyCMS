import React from 'react';
import { Link } from 'react-router-dom';

// Hàm loại bỏ thẻ HTML khỏi chuỗi văn bản
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function NewsCard({ post }) {
  const resolvedImageUrl = post.imageUrl
    ? (post.imageUrl.startsWith('http')
        ? post.imageUrl
        : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${post.imageUrl}`)
    : 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop';

  // Strip HTML và cắt bớt văn bản để làm tóm tắt (20 từ đầu tiên)
  const plainSummary = stripHtml(post.summary || post.content || post.description || '');
  const words = plainSummary.split(/\s+/).filter(word => word.length > 0);
  
  let displaySummary = words.length > 20
    ? words.slice(0, 20).join(' ') + '...'
    : words.join(' ');
    
  if (!displaySummary) {
    displaySummary = 'Xem chi tiết bài viết...';
  }

  const displayTitle = post.title || 'Bài viết';

  return (
    <div className="news-card">
      <div className="news-image">
        <img src={resolvedImageUrl} alt={displayTitle} />
      </div>
      <div className="news-content">
        <span className="news-date">{post.date || post.createdDate}</span>
        <h3 className="news-title">{displayTitle}</h3>
        <p className="news-summary">{displaySummary || 'Xem chi tiết bài viết...'}</p>
        <Link to={`/blog/${post.id}`} className="news-link">
          Đọc thêm →
        </Link>
      </div>
    </div>
  );
}

export default NewsCard;
