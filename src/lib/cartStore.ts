import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  necklaceId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  sessionId: string;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (necklaceId: string) => void;
  updateQuantity: (necklaceId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substring(2, 15);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: generateSessionId(),
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.necklaceId === item.necklaceId);
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.necklaceId === item.necklaceId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, id: Math.random().toString(36), quantity: 1 }],
          };
        });
      },
      
      removeItem: (necklaceId) => {
        set((state) => ({
          items: state.items.filter(i => i.necklaceId !== necklaceId),
        }));
      },
      
      updateQuantity: (necklaceId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(necklaceId);
          return;
        }
        set((state) => ({
          items: state.items.map(i =>
            i.necklaceId === necklaceId ? { ...i, quantity } : i
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'necklace-cart',
    }
  )
);
