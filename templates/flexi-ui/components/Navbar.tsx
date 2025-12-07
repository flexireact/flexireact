import React from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

// Theme Toggle Button (inline script for SSR)
function ThemeToggleButton() {
  return (
    <>
      <button
        id="theme-toggle"
        className="p-2 rounded-xl hover:bg-[var(--flexi-bg-muted)] transition-colors"
        aria-label="Toggle theme"
      >
        {/* Sun icon (shown in dark mode) */}
        <svg className="theme-icon-sun w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        {/* Moon icon (shown in light mode) */}
        <svg className="theme-icon-moon w-5 h-5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var btn = document.getElementById('theme-toggle');
          var sun = btn.querySelector('.theme-icon-sun');
          var moon = btn.querySelector('.theme-icon-moon');
          
          function updateIcons() {
            var isDark = document.documentElement.classList.contains('dark');
            sun.style.display = isDark ? 'block' : 'none';
            moon.style.display = isDark ? 'none' : 'block';
          }
          
          btn.onclick = function() {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            updateIcons();
          };
          
          // Init from localStorage
          var saved = localStorage.getItem('theme');
          if (saved === 'light') {
            document.documentElement.classList.remove('dark');
          } else {
            document.documentElement.classList.add('dark');
          }
          updateIcons();
        })();
      `}} />
    </>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--flexi-border)] backdrop-blur-sm" style={{ backgroundColor: 'rgba(var(--flexi-bg-rgb, 2, 6, 23), 0.8)' }}>
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00FF9C, #00CC7D)' }}>
            <span className="text-black font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-xl">FlexiUI</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggleButton />
          <a href="/signin" className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-[var(--flexi-bg-muted)] transition-colors">
            Sign In
          </a>
          <a href="/get-started" className="px-4 py-2 text-sm font-medium rounded-xl text-black" style={{ backgroundColor: '#00FF9C' }}>
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-xl hover:bg-[var(--flexi-bg-muted)]" id="mobile-menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
