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
    <header className="fixed top-0 w-full z-50 glass-header shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 h-16">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-primary hover:bg-surface-container transition-colors rounded-full active:scale-95 duration-200"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo - Editorial Style */}
          <Link href="/" className="flex items-center group">
            <span className="font-headline text-2xl font-bold tracking-tight text-primary italic">
              CopasMenstrualesRD
            </span>
          </Link>
        </div>

        {/* Desktop Nav Cluster */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/" active={pathname === '/'}>
            Shop
          </NavLink>
          <NavLink href="/#catalogo" active={false}>
            Catálogo
          </NavLink>
        </nav>

        {/* Right: Cart */}
        <div className="flex items-center gap-2">
          <Link
            href="/carrito"
            className="relative p-2 text-primary hover:bg-surface-container transition-colors rounded-full active:scale-95 duration-200"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-on-primary shadow-sm">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-outline-variant/15 px-4 pb-4 pt-2 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            <MobileNavLink
              href="/"
              active={pathname === '/'}
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </MobileNavLink>
            <MobileNavLink
              href="/#catalogo"
              active={false}
              onClick={() => setMenuOpen(false)}
            >
              Catálogo
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
      className={`text-sm font-medium tracking-wide transition-colors ${
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
      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
        active
          ? 'bg-surface-container-high text-primary'
          : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );
}
