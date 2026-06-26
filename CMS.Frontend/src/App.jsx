import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/home/index.jsx';
import Shop from './pages/shop/index.jsx';
import ProductDetail from './pages/product-detail/index.jsx';
import Cart from './pages/cart/index.jsx';
import Checkout from './pages/checkout/index.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Profile from './pages/Profile.jsx';
import BlogDetail from './pages/blog/BlogDetail.jsx';
import Blog from './pages/blog/index.jsx';
import Orders from './pages/orders/index.jsx';

function App() {
  // Cart state initialization from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // User auth state initialization from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  // Update item quantity
  const updateQuantity = (productId, amount) => {
    if (amount <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: amount } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear cart on checkout success
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Login handler
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <Router>
      <div className="app-container">
        <Header 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} onLogin={handleLogin} />} />
            <Route path="*" element={
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home addToCart={addToCart} />} />
                  <Route path="/shop" element={<Shop addToCart={addToCart} />} />
                  <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
                  <Route path="/cart" element={
                    <Cart 
                      cart={cart} 
                      updateQuantity={updateQuantity} 
                      removeFromCart={removeFromCart} 
                    />
                  } />
                  <Route path="/checkout" element={
                    <Checkout 
                      cart={cart} 
                      clearCart={clearCart} 
                      currentUser={currentUser}
                    />
                  } />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/orders" element={<Orders currentUser={currentUser} />} />
                </Routes>
              </main>
            } />
          </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

