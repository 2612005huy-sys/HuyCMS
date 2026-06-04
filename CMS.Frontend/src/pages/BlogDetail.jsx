import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import api from '../api.js';

// Hàm strip HTML lấy plain text
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => {
        console.error('Lỗi tải bài viết:', err);
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        Đang tải bài viết...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ marginBottom: '16px' }}>Không tìm thấy bài viết!</h2>
        <Link to="/" className="cta-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Về trang chủ
        </Link>
      </div>
    );
  }

  const resolvedImageUrl = post.imageUrl
    ? (post.imageUrl.startsWith('http')
        ? post.imageUrl
        : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${post.imageUrl}`)
    : 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop';

  // Nội dung: nếu có HTML thì render nguyên, nếu không thì wrap bằng <p>
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(post.content || '');

  return (
    <div className="blog-detail-container">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          color: 'var(--text-muted)', marginBottom: '32px',
          fontWeight: 500, fontSize: '0.95rem'
        }}
      >
        <ArrowLeft size={18} /> Quay lại
      </button>

      {/* Hero image */}
      <div className="blog-hero-image">
        <img src={resolvedImageUrl} alt={post.title} />
      </div>

      {/* Post metadata */}
      <div className="blog-meta">
        <span className="blog-meta-item">
          <Calendar size={16} />
          {post.createdDate}
        </span>
        {post.categoryName && (
          <span className="blog-meta-item blog-category-tag">
            <Tag size={14} />
            {post.categoryName}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="blog-title">{post.title}</h1>

      {/* Content */}
      <div className="blog-content">
        {hasHtmlTags ? (
          // Render HTML từ trình soạn thảo của Admin
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          // Plain text — chia theo xuống dòng
          (post.content || '').split('\n').map((line, i) => (
            <p key={i}>{line || <br />}</p>
          ))
        )}
      </div>

      {/* Back to home */}
      <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
        <Link to="/" className="view-all-link" style={{ fontSize: '1rem' }}>
          ← Xem các bài viết khác
        </Link>
      </div>
    </div>
  );
}

export default BlogDetail;
