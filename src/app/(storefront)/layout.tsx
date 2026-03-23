'use client';

import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { ChatWidget } from '@/components/storefront/ChatWidget';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 page-transition">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
