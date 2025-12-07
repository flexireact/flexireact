import React from 'react';

const featureCategories = [
  {
    title: 'Core Components',
    description: 'Essential building blocks',
    items: [
      { name: 'Button', desc: '6 variants, loading states, icons' },
      { name: 'Input', desc: 'Validation, icons, helper text' },
      { name: 'Textarea', desc: 'Auto-resize, character count' },
      { name: 'Checkbox', desc: 'With label and indeterminate' },
      { name: 'Switch', desc: 'Toggle with animations' },
      { name: 'Select', desc: 'Searchable dropdown' },
    ],
  },
  {
    title: 'Display Components',
    description: 'Show content beautifully',
    items: [
      { name: 'Card', desc: 'Elevated, glass variants' },
      { name: 'Badge', desc: 'Status indicators' },
      { name: 'Avatar', desc: 'With fallback and status' },
      { name: 'Tooltip', desc: 'Hover information' },
    ],
  },
  {
    title: 'Feedback Components',
    description: 'Communicate with users',
    items: [
      { name: 'Alert', desc: 'Success, warning, error, info' },
      { name: 'Toast', desc: 'Non-blocking notifications' },
      { name: 'Spinner', desc: 'Loading indicators' },
      { name: 'Skeleton', desc: 'Loading placeholders' },
      { name: 'Progress', desc: 'Progress bars' },
    ],
  },
  {
    title: 'Overlay Components',
    description: 'Modals, drawers, and more',
    items: [
      { name: 'Modal', desc: 'Dialog with animations' },
      { name: 'Drawer', desc: 'Side panel overlay' },
      { name: 'Dropdown', desc: 'Context menus' },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full border border-[var(--flexi-border)] mb-4">Features</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Powerful Components</h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            Everything you need to build modern, accessible web applications.
          </p>
        </div>

        {/* Feature Categories */}
        <div className="space-y-16">
          {featureCategories.map((category, index) => (
            <div key={index}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                <p className="opacity-70">{category.description}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-[var(--flexi-border)] hover:border-[#00FF9C]/30 transition-colors cursor-pointer"
                    style={{ backgroundColor: 'var(--flexi-bg-subtle)' }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm opacity-70">{item.desc}</p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {index < featureCategories.length - 1 && (
                <div className="h-px w-full bg-[var(--flexi-border)] mt-16" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="inline-block p-8 rounded-3xl border" style={{ background: 'linear-gradient(135deg, rgba(0,255,156,0.1), transparent)', borderColor: 'rgba(0,255,156,0.3)' }}>
            <h3 className="text-xl font-bold mb-2">Ready to start building?</h3>
            <p className="opacity-70 mb-4">Install FlexiUI and create beautiful interfaces.</p>
            <a href="/docs" className="px-6 py-3 text-base font-medium rounded-xl text-black inline-block" style={{ backgroundColor: '#00FF9C' }}>
              Get Started →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
