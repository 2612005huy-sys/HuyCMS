import React, { useEffect, useState } from 'react';
import { Search, Newspaper } from 'lucide-react';
import api from '../../api.js';
import { mockPosts } from '../../mockData.js';
import BlogSidebar from './BlogSidebar.jsx';
import BlogDetail from './BlogDetail.jsx';

// Strip HTML tags
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function Blog() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [categories, setCategories] = useState(['Tất cả']);

  useEffect(() => {
    api.get('/api/posts')
      .then(res => {
        const data = res.data;
        setPosts(data);
        setFiltered(data);
        // Build unique category list
        const cats = ['Tất cả', ...new Set(data.map(p => p.categoryName).filter(Boolean))];
        setCategories(cats);
      })
      .catch(() => {
        setPosts(mockPosts);
        setFiltered(mockPosts);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter when search or category changes
  useEffect(() => {
    let result = posts;
    if (activeCategory !== 'Tất cả') {
      result = result.filter(p => p.categoryName === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.categoryName || '').toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, activeCategory, posts]);

  return (
    <div className="blog-page">
      {/* Page Header */}
      <div className="blog-page-header">
        <div className="blog-page-header-icon">
          <Newspaper size={36} />
        </div>
        <h1>Tin Tức &amp; Bài Viết</h1>
        <p>Khám phá kiến thức, xu hướng và đánh giá mới nhất từ đội ngũ chuyên gia</p>

        {/* Search */}
        <div className="blog-search-wrapper">
          <Search size={18} className="blog-search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="blog-search-input"
          />
        </div>
      </div>

      {/* Category Filter - dùng BlogSidebar component */}
      <BlogSidebar
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Results count */}
      {!loading && (
        <p className="blog-result-count">
          Hiển thị <strong>{filtered.length}</strong> bài viết
          {activeCategory !== 'Tất cả' && <span> trong "{activeCategory}"</span>}
          {search && <span> cho "{search}"</span>}
        </p>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="blog-loading">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="blog-skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="blog-empty">
          <Newspaper size={64} style={{ opacity: 0.2, marginBottom: 16 }} />
          <h3>Không tìm thấy bài viết nào</h3>
          <p>Thử tìm kiếm với từ khóa khác hoặc xem tất cả danh mục</p>
          <button className="blog-cat-btn active" onClick={() => { setSearch(''); setActiveCategory('Tất cả'); }}>
            Xem tất cả
          </button>
        </div>
      ) : (
        <div className="blog-grid">
          {filtered.map((post, i) => {
            const imageUrl = post.imageUrl
              ? (post.imageUrl.startsWith('http') ? post.imageUrl : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${post.imageUrl}`)
              : 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop';

            const summary = stripHtml(post.content || post.summary || '');
            const displaySummary = summary.length > 140 ? summary.slice(0, 140) + '...' : summary;

            return (
              <article key={post.id || i} className="blog-article-card">
                <a href={`/blog/${post.id}`} className="blog-article-image-link">
                  <div className="blog-article-image">
                    <img src={imageUrl} alt={post.title} loading="lazy" />
                    {post.categoryName && (
                      <span className="blog-article-category">
                        {post.categoryName}
                      </span>
                    )}
                  </div>
                </a>
                <div className="blog-article-body">
                  <div className="blog-article-date">
                    {formatDate(post.createdDate || post.date)}
                  </div>
                  <h2 className="blog-article-title">
                    <a href={`/blog/${post.id}`}>{post.title}</a>
                  </h2>
                  <p className="blog-article-summary">{displaySummary || 'Nhấn để đọc bài viết đầy đủ...'}</p>
                  <a href={`/blog/${post.id}`} className="blog-article-readmore">
                    Đọc bài viết →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Blog;
