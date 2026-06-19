import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag } from 'lucide-react';

// Hàm loại bỏ thẻ HTML
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// Hàm format ngày tháng
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Component: Tấm thẻ bài viết — layout nằm ngang (compact) dùng cho sidebar hoặc danh sách
const PostCard = ({ post }) => {
  if (!post) return null;

  const resolvedImageUrl = post.imageUrl
    ? (post.imageUrl.startsWith('http')
        ? post.imageUrl
        : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${post.imageUrl}`)
    : 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200&auto=format&fit=crop';

  const summary = stripHtml(post.content || post.summary || '');
  const displaySummary = summary.length > 90 ? summary.slice(0, 90) + '...' : summary;

  return (
    <article style={{
      display: 'flex',
      gap: '14px',
      padding: '14px 0',
      borderBottom: '1px solid var(--border)',
      alignItems: 'flex-start',
    }}>
      {/* Ảnh thu nhỏ bên trái */}
      <Link to={`/blog/${post.id}`} style={{ flexShrink: 0 }}>
        <img
          src={resolvedImageUrl}
          alt={post.title}
          style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px' }}
        />
      </Link>

      {/* Nội dung bên phải */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {post.categoryName && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.5px', color: 'var(--accent)', marginBottom: '4px'
          }}>
            <Tag size={10} /> {post.categoryName}
          </span>
        )}

        <h3 style={{
          fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.4,
          margin: '0 0 4px 0', color: 'var(--text)',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          <Link to={`/blog/${post.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {post.title}
          </Link>
        </h3>

        <div style={{
          fontSize: '0.78rem', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          <Calendar size={11} />
          {formatDate(post.createdDate || post.date)}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
