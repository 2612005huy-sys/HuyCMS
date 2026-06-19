import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import api from '../api.js';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products for fast client-side suggestion
    api.get('/Product/GetJsonAll')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Lỗi tải sản phẩm cho search bar", err));
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const lowerQuery = query.toLowerCase();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery)
      ).slice(0, 5); // Limit 5 suggestions
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, products]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProduct = (productId) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <div className="search-input-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim().length > 0) setIsOpen(true); }}
        />
        {query && (
          <button className="clear-search-btn" onClick={clearSearch}>
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="search-suggestions-dropdown">
          {suggestions.map(product => {
            const resolvedImageUrl = product.imageUrl 
              ? (product.imageUrl.startsWith('http') 
                  ? product.imageUrl 
                  : `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7005'}${product.imageUrl}`)
              : 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=100&auto=format&fit=crop';

            return (
              <div 
                key={product.id} 
                className="search-suggestion-item"
                onClick={() => handleSelectProduct(product.id)}
              >
                <img src={resolvedImageUrl} alt={product.name} />
                <div className="search-suggestion-info">
                  <h4>{product.name}</h4>
                  <p>{product.price.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isOpen && query.trim().length > 0 && suggestions.length === 0 && (
        <div className="search-suggestions-dropdown">
          <div className="search-no-results">
            Không tìm thấy sản phẩm nào.
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
