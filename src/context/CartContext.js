import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('photomart-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('photomart-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, price) => {
    const cartItem = {
      id: `${product.id}-${size}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      size: size,
      price: price,
      quantity: 1
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItem.id);
      if (existingItem) {
        return prevItems.map(item => (item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevItems, cartItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems => prevItems.map(item => (item.id === itemId ? { ...item, quantity } : item)));
  };

  const getCartTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const getCartItemCount = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    isMenuOpen,
    setIsMenuOpen,
    isCartOpen,
    setIsCartOpen,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    getCartItemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}


