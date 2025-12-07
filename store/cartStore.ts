// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define what a Cart Item looks like
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item._id === product._id);

        if (existingItem) {
          // If item exists, increase quantity
          set({
            items: currentItems.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Add new item
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item._id !== id) });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      increaseQuantity: (id) => {
        const currentItems = get().items;
        const newItems = currentItems.map((item) =>
          item._id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        set({ items: newItems });
      },

      decreaseQuantity: (id) => {
        const currentItems = get().items;
        const newItems = currentItems.map((item) =>
          // Prevent going below 1 (user should use delete button for 0)
          item._id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        set({ items: newItems });
      },
    }),
    {
      name: '3xcoco-cart', // Unique name for LocalStorage
    }
  )
);