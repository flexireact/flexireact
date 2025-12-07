import React from 'react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 text-xl font-bold transition-opacity hover:opacity-80">
          <svg className="h-8 w-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#61DAFB"/>
                <stop offset="100%" stopColor="#21A1F1"/>
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="12" fill="url(#navGradient)"/>
            <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#navGradient)" strokeWidth="6" transform="rotate(-30 100 100)"/>
            <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#navGradient)" strokeWidth="6" transform="rotate(30 100 100)"/>
            <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#navGradient)" strokeWidth="6" transform="rotate(90 100 100)"/>
          </svg>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            FlexiReact
          </span>
        </a>
        
        <div className="hidden items-center gap-8 md:flex">
          <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Home
          </a>
          <a href="/docs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Docs
          </a>
          <a href="/examples" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Examples
          </a>
          <a href="/api/hello" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            API
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/flexireact/flexireact" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="GitHub"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
