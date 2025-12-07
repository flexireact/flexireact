import React from 'react';

// Hero Section
function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 text-sm font-medium rounded-full mb-6" style={{ backgroundColor: 'rgba(0,255,156,0.1)', color: '#00FF9C', border: '1px solid rgba(0,255,156,0.3)' }}>
            ✨ Now available on npm
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Build beautiful apps with{' '}
            <span style={{ color: '#00FF9C' }}>FlexiUI</span>
          </h1>
          
          <p className="text-lg md:text-xl opacity-70 mb-8 max-w-2xl mx-auto">
            A modern, accessible UI component library for React. Dark-first design with beautiful neon emerald accents.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/docs" className="px-6 py-3 text-base font-medium rounded-xl text-black" style={{ backgroundColor: '#00FF9C' }}>
              Get Started →
            </a>
            <a href="https://github.com/flexireact/flexi-ui" className="px-6 py-3 text-base font-medium rounded-xl border border-[var(--flexi-border)] hover:bg-[var(--flexi-bg-muted)] transition-colors">
              View on GitHub
            </a>
          </div>

          <div className="inline-block p-4 rounded-2xl border border-[var(--flexi-border)]" style={{ backgroundColor: 'var(--flexi-bg-subtle)' }}>
            <code className="text-sm opacity-70">
              <span style={{ color: '#00FF9C' }}>npm</span> install @flexireact/flexi-ui
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
const features = [
  { icon: '🎨', title: 'Beautiful Design', description: 'Minimalist, futuristic UI with neon emerald accents.' },
  { icon: '♿', title: 'Accessible', description: 'ARIA-compliant components built on Radix UI primitives.' },
  { icon: '🎯', title: 'TypeScript Native', description: 'Full type safety out of the box.' },
  { icon: '🌳', title: 'Tree-shakeable', description: 'Import only what you need.' },
  { icon: '⚡', title: 'SSR Ready', description: 'Works with any SSR framework.' },
  { icon: '🎭', title: 'Customizable', description: 'CSS variables for easy theming.' },
];

function FeaturesSection() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--flexi-bg-subtle)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full border border-[var(--flexi-border)] mb-4">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
          <p className="opacity-70 max-w-2xl mx-auto">
            FlexiUI provides all the components you need to build modern web applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-2xl border border-[var(--flexi-border)] hover:border-[#00FF9C]/30 transition-colors" style={{ backgroundColor: 'var(--flexi-bg)' }}>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm opacity-70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Components Section
function ComponentsSection() {
  const components = ['Button', 'Input', 'Card', 'Modal', 'Tabs', 'Toast', 'Avatar', 'Badge', 'Select', 'Checkbox', 'Switch', 'Progress'];
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full border border-[var(--flexi-border)] mb-4">Components</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">23+ Ready-to-use Components</h2>
          <p className="opacity-70 max-w-2xl mx-auto">
            From buttons to modals, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {components.map((component) => (
            <div
              key={component}
              className="p-4 rounded-xl border border-[var(--flexi-border)] hover:border-[#00FF9C]/50 transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--flexi-bg-subtle)' }}
            >
              <span className="font-medium">{component}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="/components" className="px-5 py-2.5 text-sm font-medium rounded-xl border border-[var(--flexi-border)] hover:bg-[var(--flexi-bg-muted)] transition-colors inline-block">
            View All Components →
          </a>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto p-8 md:p-12 text-center rounded-3xl border" style={{ background: 'linear-gradient(135deg, rgba(0,255,156,0.1), transparent)', borderColor: 'rgba(0,255,156,0.3)' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="opacity-70 mb-8 max-w-lg mx-auto">
            Join thousands of developers building beautiful applications with FlexiUI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--flexi-border)] bg-[var(--flexi-bg)] focus:outline-none focus:border-[#00FF9C]"
            />
            <button className="px-6 py-3 font-medium rounded-xl text-black" style={{ backgroundColor: '#00FF9C' }}>
              Subscribe
            </button>
          </div>

          <p className="text-xs opacity-50 mt-4">
            Get notified about updates and new components.
          </p>
        </div>
      </div>
    </section>
  );
}

// Main Page
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ComponentsSection />
      <CTASection />
    </>
  );
}
