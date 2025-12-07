import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--flexi-bg)', color: 'var(--flexi-fg)' }}>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
