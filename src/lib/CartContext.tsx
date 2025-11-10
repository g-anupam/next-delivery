// src/lib/CartContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define the types
interface CartItem {
  id: number; // Menu item ID
  name: string;
  price: number;
  restaurantId: number; // Which restaurant the item came from
  quantity: number;
}

interface CartConflict {
  item: Omit<CartItem, 'quantity'>;
  currentRestaurantId: number;
}

interface CartContextType {
  cart: CartItem[];
  cartConflict: CartConflict | null; // State to hold conflict details
  
  // Action functions
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  decrementQuantity: (itemId: number, restaurantId: number) => void; 
  removeFromCart: (itemId: number, restaurantId: number) => void;
  clearCart: () => void;
  resolveConflict: (clear: boolean) => void; // New function to handle the modal response
  
  // Getter functions
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// 2. Create the Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Create the Provider Component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartConflict, setCartConflict] = useState<CartConflict | null>(null); // ⭐️ NEW STATE

  // Function checks for restaurant ID conflict before adding
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    // ⭐️ CONFLICT CHECK
    if (cart.length > 0) {
      const currentRestaurantId = cart[0].restaurantId;
      if (currentRestaurantId !== item.restaurantId) {
        // CONFLICT FOUND: Store the conflict details and wait for user input (via modal)
        setCartConflict({ item, currentRestaurantId });
        return; 
      }
    }
    
    // NO CONFLICT: Proceed to add item
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === item.id && cartItem.restaurantId === item.restaurantId
      );

      if (existingItemIndex > -1) {
        // Increase quantity of existing item
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Function to resolve the conflict after the user interacts with the modal
  const resolveConflict = (clear: boolean) => {
    if (!cartConflict) return;

    if (clear) {
      // User chose to clear the cart and add the new item
      setCart([]); // Clear all existing items
      addToCart(cartConflict.item); // Recursively call addToCart, which will now proceed
    }
    
    // Clear the conflict state regardless of whether they cleared the cart or canceled
    setCartConflict(null);
  };

  // ... (Existing decrementQuantity, removeFromCart, clearCart, getTotalItems, getTotalPrice logic remains the same)

  // Function to decrease quantity or remove if quantity is 1
  const decrementQuantity = (itemId: number, restaurantId: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === itemId && cartItem.restaurantId === restaurantId
      );

      if (existingItemIndex > -1) {
        const item = prevCart[existingItemIndex];
        
        if (item.quantity > 1) {
          // Decrement quantity
          return prevCart.map((cartItem, index) =>
            index === existingItemIndex
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          );
        } else {
          // Remove item entirely if quantity is 1
          return prevCart.filter((_, index) => index !== existingItemIndex);
        }
      }
      return prevCart; // Return cart unchanged if item not found
    });
  };
  
  // Function to remove item entirely (e.g., button on checkout page)
  const removeFromCart = (itemId: number, restaurantId: number) => {
    setCart(prevCart => prevCart.filter(
        item => !(item.id === itemId && item.restaurantId === restaurantId)
    ));
  };

  const clearCart = () => setCart([]);
  
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
  
  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        cartConflict, // ⭐️ EXPOSE CONFLICT STATE
        addToCart, 
        decrementQuantity, 
        removeFromCart, 
        clearCart, 
        resolveConflict, // ⭐️ EXPOSE RESOLVER FUNCTION
        getTotalItems, 
        getTotalPrice 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 4. Custom hook for easy access
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};