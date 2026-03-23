'use client';

import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface-container-lowest">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto page-transition">
        {children}
      </main>
    </div>
  );
}
