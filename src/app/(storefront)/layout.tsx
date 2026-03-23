'use client';

import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { ChatWidget } from '@/components/storefront/ChatWidget';
import { BottomNav } from '@/components/storefront/BottomNav';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 page-transition pt-16">{children}</main>
      <Footer />
      <ChatWidget />
      <BottomNav />
    </>
  );
}
