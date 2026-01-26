import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    title: string;
    price: number; // Stored in VND (e.g. 725000)
    thumbnail: string;
    category: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean; // Controls the Drawer visibility
    openCart: () => void;
    closeCart: () => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            addToCart: (item) => {
                const currentItems = get().items;
                const exists = currentItems.find((i) => i.id === item.id);

                if (!exists) {
                    set({ items: [...currentItems, item], isOpen: true }); // Open cart on add
                } else {
                    set({ isOpen: true }); // Just open if already exists
                }
            },
            removeFromCart: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((sum, item) => sum + item.price, 0),
        }),
        {
            name: 'vibe-cart-storage', // key in localStorage
        }
    )
);
