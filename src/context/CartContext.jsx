import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/cart`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch cart');
          const data = await res.json();
          const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
          if (localCart.length > 0) {
            // Merge guest cart with user cart
            const mergedCart = [...data];
            localCart.forEach(localItem => {
              const exists = mergedCart.find(dbItem => dbItem.cartItemId === localItem.cartItemId);
              if (exists) {
                exists.qty += localItem.qty;
              } else {
                mergedCart.push(localItem);
              }
            });
            setCartItems(mergedCart);
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/cart`, {
              method: 'PUT',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}` 
              },
              body: JSON.stringify({ cartItems: mergedCart })
            });
            localStorage.removeItem('cartItems');
          } else {
            setCartItems(data);
          }
        } catch (e) {
          console.error('Failed to fetch cart', e);
        }
      } else {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        } else {
          setCartItems([]);
        }
      }
    };
    fetchCart();
  }, [user]);

  const saveCart = async (newCart) => {
    if (user) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/cart`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}` 
          },
          body: JSON.stringify({ cartItems: newCart })
        });
      } catch (e) {
        console.error('Failed to sync cart', e);
      }
    } else {
      localStorage.setItem('cartItems', JSON.stringify(newCart));
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevCartItems => {
      const existingItem = prevCartItems.find((item) => 
        item.product === product._id && item.color === product.color && item.size === product.size
      );
      let updatedCart;
      
      if (existingItem) {
        updatedCart = prevCartItems.map((item) =>
          (item.product === product._id && item.color === product.color && item.size === product.size) 
            ? { ...item, qty: item.qty + quantity } : item
        );
      } else {
        updatedCart = [...prevCartItems, { 
          cartItemId: `${product._id}-${product.color || 'none'}-${product.size || 'none'}`,
          product: product._id, 
          name: product.name, 
          price: (product.discount && (!product.discountEndDate || new Date(product.discountEndDate) > Date.now())) ? (product.price - (product.price * product.discount / 100)) : product.price, 
          qty: quantity,
          imageUrl: product.imageUrl,
          size: product.size,
          color: product.color
        }];
      }
      
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (idOrCartItemId) => {
    const updatedCart = cartItems.filter((item) => (item.cartItemId || item.product) !== idOrCartItemId);
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const updateQuantity = (idOrCartItemId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      (item.cartItemId || item.product) === idOrCartItemId ? { ...item, qty: quantity } : item
    );
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const updateCartItem = (idOrCartItemId, newSize, newColor) => {
    const updatedCart = cartItems.map((item) => {
      if ((item.cartItemId || item.product) === idOrCartItemId) {
        return {
          ...item,
          size: newSize,
          color: newColor,
          cartItemId: `${item.product}-${newColor || 'none'}-${newSize || 'none'}`
        };
      }
      return item;
    });
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
};
