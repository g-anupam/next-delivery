// src/components/AddToCartButton.tsx
"use client";

import { useCart } from '@/lib/CartContext'; 
import { Minus, Plus } from 'lucide-react'; // Needs 'lucide-react' installed

interface AddToCartButtonProps {
  itemId: number;
  itemName: string;
  itemPrice: number;
  restaurantId: number;
}

export default function AddToCartButton({ 
  itemId, 
  itemName, 
  itemPrice, 
  restaurantId 
}: AddToCartButtonProps) {
  
  // Use the new functions from the context
  const { cart, addToCart, decrementQuantity } = useCart(); 

  // Find the item's current quantity in the cart
  const itemInCart = cart.find(
    (item) => item.id === itemId && item.restaurantId === restaurantId
  );
  
  const quantity = itemInCart ? itemInCart.quantity : 0;

  // Function to add item to cart (also handles incrementing quantity > 0)
  const handleAddToCart = () => {
    addToCart({
      id: itemId,
      name: itemName,
      price: itemPrice,
      restaurantId: restaurantId,
    });
  };

  // Function to remove or decrement item
  const handleDecrementQuantity = () => {
    decrementQuantity(itemId, restaurantId);
  };

  if (quantity > 0) {
    // ⭐️ SHOW QUANTITY COUNTER (When item is in cart)
    return (
      <div className="flex items-center space-x-2 border border-orange-500 rounded-xl">
        <button
          onClick={handleDecrementQuantity}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-l-xl transition"
          aria-label="Remove one item"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-900">{quantity}</span>
        <button
          onClick={handleAddToCart}
          className="p-2 bg-orange-500 text-white hover:bg-orange-600 rounded-r-xl transition"
          aria-label="Add one item"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // ⭐️ SHOW INITIAL "Add to Cart" BUTTON (When item is not in cart)
  return (
    <button
      onClick={handleAddToCart}
      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm shadow-md transition"
    >
      Add to Cart
    </button>
  );
}