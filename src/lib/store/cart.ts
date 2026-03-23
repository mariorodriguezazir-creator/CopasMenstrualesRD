import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.variantId === newItem.variantId
          );

          if (existingIndex >= 0) {
            const existing = state.items[existingIndex];
            const newQty = existing.quantity + newItem.quantity;

            if (newQty > existing.maxStock) {
              return state; // Don't exceed stock
            }

            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...existing,
              quantity: newQty,
            };
            return { items: updatedItems };
          }

          if (newItem.quantity > newItem.maxStock) {
            return state;
          }

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variantId === variantId
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  !(
                    item.productId === productId &&
                    item.variantId === variantId
                  )
              ),
            };
          }

          return {
            items: state.items.map((item) => {
              if (
                item.productId === productId &&
                item.variantId === variantId
              ) {
                const clampedQty = Math.min(quantity, item.maxStock);
                return { ...item, quantity: clampedQty };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.finalPrice * item.quantity,
          0
        );
      },
    }),
    {
      name: 'copas-menstruales-cart',
    }
  )
);
