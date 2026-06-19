import React from 'react';
import ProductCard from '../../components/ProductCard.jsx';

// Component: Lưới bọc và chạy map() gọi thẻ ProductCard
const ProductList = ({ products, addToCart }) => {
  return (
    <div className="products-grid" style={{ marginBottom: 0 }}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
