import React from 'react';
import { ThemeProvider } from '@flexireact/flexi-ui';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import './styles/globals.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FlexiUI - Modern React Components</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark">
          <div className="min-h-screen bg-[var(--flexi-bg)] text-[var(--flexi-fg)] flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
