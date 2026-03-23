'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, BookOpen, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

const navItems = [
  { href: '/', label: 'Shop', icon: Store },
  { href: '/#aprender', label: 'Learn', icon: BookOpen },
  { href: '/carrito', label: 'Carrito', icon: ShoppingBag },
  { href: '/#contacto', label: 'Perfil', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur-lg shadow-[0_-8px_30px_rgba(194,114,138,0.08)] rounded-t-[32px]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || 
          (item.href === '/' && pathname === '/') ||
          (item.href === '/carrito' && pathname.startsWith('/carrito'));
        const isCart = item.href === '/carrito';

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center px-5 py-1.5 transition-all active:scale-90 ${
              isActive
                ? 'text-primary bg-surface-container rounded-[20px]'
                : 'text-muted hover:text-primary'
            }`}
          >
            <div className="relative">
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              {isCart && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full gradient-primary text-[9px] font-bold text-on-primary">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium tracking-wide mt-0.5">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
