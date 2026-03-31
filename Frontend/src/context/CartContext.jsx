import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import api from "../api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("kisanstore_cart");
    return stored ? JSON.parse(stored) : [];
  });
  const isInitialMount = useRef(true);

  // Sync LOCAL cart if user is logged in for the first time
  useEffect(() => {
    if (isAuthenticated && user?.cart?.length > 0 && cart.length === 0) {
      setCart(user.cart.map(item => ({
        ...item.product,
        quantity: item.quantity
      })));
    }
  }, [isAuthenticated, user]);

  // Sync to LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("kisanstore_cart", JSON.stringify(cart));
    
    // Sync to SERVER (Debounced)
    if (isAuthenticated && !isInitialMount.current) {
      const handler = setTimeout(async () => {
        try {
          await api.put('/auth/cart', {
            cart: cart.map(item => ({
              product: item._id,
              quantity: item.quantity
            }))
          });
        } catch (err) {
          console.error("Cart sync failed", err);
        }
      }, 1000);
      return () => clearTimeout(handler);
    }
    isInitialMount.current = false;
  }, [cart, isAuthenticated]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
          : item,
      ),
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

