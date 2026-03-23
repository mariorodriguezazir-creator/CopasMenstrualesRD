'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <header className="glass sticky top-0 z-50 shadow-ambient">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold font-headline text-primary tracking-tight group-hover:text-primary-container transition-colors">
            CopasMenstrualesRD
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink href="/" active={pathname === '/'}>
            Inicio
          </NavLink>
          <NavLink href="/carrito" active={pathname === '/carrito'}>
            Tienda
          </NavLink>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/carrito"
            className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <ShoppingBag className="h-5 w-5 text-on-surface" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-on-primary">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-full hover:bg-surface-container-high transition-colors"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? (
              <X className="h-5 w-5 text-on-surface" />
            ) : (
              <Menu className="h-5 w-5 text-on-surface" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden glass border-t border-outline-variant/15 px-4 pb-4 pt-2 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            <MobileNavLink
              href="/"
              active={pathname === '/'}
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </MobileNavLink>
            <MobileNavLink
              href="/carrito"
              active={pathname === '/carrito'}
              onClick={() => setMenuOpen(false)}
            >
              Mi Carrito
            </MobileNavLink>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        active
          ? 'text-primary'
          : 'text-on-surface-variant hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-surface-container-high text-primary'
          : 'text-on-surface-variant hover:bg-surface-container'
      }`}
    >
      {children}
    </Link>
  );
}
