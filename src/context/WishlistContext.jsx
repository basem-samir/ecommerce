import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/wishlist`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch wishlist');
          const data = await res.json();
          const localWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
          if (localWishlist.length > 0) {
            const mergedWishlist = [...data];
            localWishlist.forEach(localItem => {
              const exists = mergedWishlist.find(dbItem => dbItem._id === localItem._id);
              if (!exists) {
                mergedWishlist.push(localItem);
              }
            });
            setWishlistItems(mergedWishlist);
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/wishlist`, {
              method: 'PUT',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}` 
              },
              body: JSON.stringify({ wishlistItems: mergedWishlist })
            });
            localStorage.removeItem('wishlistItems');
          } else {
            setWishlistItems(data);
          }
        } catch (e) {
          console.error('Failed to fetch wishlist', e);
        }
      } else {
        const storedWishlist = localStorage.getItem('wishlistItems');
        if (storedWishlist) {
          setWishlistItems(JSON.parse(storedWishlist));
        } else {
          setWishlistItems([]);
        }
      }
    };
    fetchWishlist();
  }, [user]);

  const saveWishlist = async (newWishlist) => {
    setWishlistItems(newWishlist);
    if (user) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/wishlist`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}` 
          },
          body: JSON.stringify({ wishlistItems: newWishlist })
        });
      } catch (e) {
        console.error('Failed to sync wishlist', e);
      }
    } else {
      localStorage.setItem('wishlistItems', JSON.stringify(newWishlist));
    }
  };

  const addToWishlist = (product) => {
    const exists = wishlistItems.find(item => item._id === product._id);
    if (!exists) {
      const updatedWishlist = [...wishlistItems, product];
      saveWishlist(updatedWishlist);
    }
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlistItems.filter(item => item._id !== id);
    saveWishlist(updatedWishlist);
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
