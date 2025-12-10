/**
 * Premium sections for FlexiReact templates
 * Reusable components for landing pages
 */

export const PREMIUM_NAVBAR = `import React from 'react';

export function PremiumNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800/50">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00FF9C] to-[#00D68F] flex items-center justify-center shadow-lg shadow-[#00FF9C]/20">
            <span className="text-black font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-lg">FlexiReact</span>
          <span className="px-2 py-0.5 text-xs bg-[#00FF9C]/20 text-[#00FF9C] rounded-full">v3.0</span>
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="https://github.com/flexireact/flexireact#readme" className="text-sm text-gray-400 hover:text-white transition-colors">Docs</a>
          <a href="https://github.com/flexireact/flexireact" className="text-sm text-gray-400 hover:text-white transition-colors">GitHub</a>
          <a href="https://github.com/flexireact/flexireact/tree/main/examples" className="text-sm text-gray-400 hover:text-white transition-colors">Examples</a>
          <a href="https://discord.gg/rFSZxFtpAA" className="text-sm text-gray-400 hover:text-white transition-colors">Discord</a>
        </div>

        <a 
          href="https://github.com/flexireact/flexireact" 
          target="_blank"
          className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00FF9C]/50 rounded-lg transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-sm font-medium">Star</span>
        </a>
      </nav>
    </header>
  );
}`;

export const PREMIUM_FOOTER = `import React from 'react';

export function PremiumFooter() {
  return (
    <footer className="border-t border-gray-800/50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="https://github.com/flexireact/flexireact#readme" className="text-sm text-gray-400 hover:text-white transition">Docs</a></li>
              <li><a href="https://github.com/flexireact/flexireact/tree/main/examples" className="text-sm text-gray-400 hover:text-white transition">Examples</a></li>
              <li><a href="https://github.com/flexireact/flexireact/blob/main/CHANGELOG-v3.md" className="text-sm text-gray-400 hover:text-white transition">Changelog</a></li>
              <li><a href="https://github.com/flexireact/flexireact/projects" className="text-sm text-gray-400 hover:text-white transition">Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="https://github.com/flexireact/flexireact" className="text-sm text-gray-400 hover:text-white transition">GitHub</a></li>
              <li><a href="https://discord.gg/rFSZxFtpAA" className="text-sm text-gray-400 hover:text-white transition">Discord</a></li>
              <li><a href="https://github.com/flexireact/flexireact/discussions" className="text-sm text-gray-400 hover:text-white transition">Discussions</a></li>
              <li><a href="https://github.com/flexireact/flexireact/issues" className="text-sm text-gray-400 hover:text-white transition">Issues</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Ecosystem</h3>
            <ul className="space-y-2">
              <li><a href="https://www.npmjs.com/package/@flexireact/flexi-ui" className="text-sm text-gray-400 hover:text-white transition">FlexiUI</a></li>
              <li><a href="https://www.npmjs.com/package/flexiguard" className="text-sm text-gray-400 hover:text-white transition">FlexiGuard</a></li>
              <li><a href="https://www.npmjs.com/package/create-flexireact" className="text-sm text-gray-400 hover:text-white transition">CLI</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="https://github.com/flexireact/flexireact/blob/main/LICENSE" className="text-sm text-gray-400 hover:text-white transition">License</a></li>
              <li><a href="https://github.com/flexireact/flexireact/blob/main/CONTRIBUTING.md" className="text-sm text-gray-400 hover:text-white transition">Contributing</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00FF9C] flex items-center justify-center">
              <span className="text-black font-bold">F</span>
            </div>
            <span className="text-sm text-gray-400">Built with ❤️ by Asuno</span>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} FlexiReact. MIT License.</p>
        </div>
      </div>
    </footer>
  );
}`;

export const ANIMATIONS_CSS = `
/* Fade-in and slide-up animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-delay-100 {
  animation-delay: 0.1s;
  opacity: 0;
}

.animate-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animate-delay-300 {
  animation-delay: 0.3s;
  opacity: 0;
}

.animate-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}

/* Glow effects */
.glow-green {
  box-shadow: 0 0 20px rgba(0, 255, 156, 0.3);
}

.hover-glow:hover {
  box-shadow: 0 0 30px rgba(0, 255, 156, 0.4);
  transform: scale(1.02);
  transition: all 0.3s ease;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #00FF9C 0%, #00D68F 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
`;
