import React from 'react';

const team = [
  { name: 'Alex Chen', role: 'Creator & Lead Developer', avatar: 'AC', bio: 'Full-stack developer passionate about design systems.' },
  { name: 'Sarah Miller', role: 'Design Lead', avatar: 'SM', bio: 'UI/UX designer focused on accessible interfaces.' },
  { name: 'James Wilson', role: 'Core Contributor', avatar: 'JW', bio: 'Open source enthusiast and React specialist.' },
];

const stats = [
  { value: '23+', label: 'Components' },
  { value: '10k+', label: 'Downloads' },
  { value: '500+', label: 'GitHub Stars' },
  { value: '50+', label: 'Contributors' },
];

const values = [
  { icon: '🎯', title: 'Developer Experience', description: 'Easy to use and customize.' },
  { icon: '♿', title: 'Accessibility First', description: 'Built with a11y in mind.' },
  { icon: '🚀', title: 'Performance', description: 'Optimized bundle size.' },
  { icon: '🎨', title: 'Beautiful Design', description: 'Modern, clean aesthetics.' },
];

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full border border-[var(--flexi-border)] mb-4">About</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Building the future of UI</h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            FlexiUI is an open-source project dedicated to making beautiful, accessible UI components available to everyone.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#00FF9C' }}>{stat.value}</div>
              <div className="opacity-70">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-[var(--flexi-border)] my-20" />

        {/* Our Story */}
        <div className="max-w-3xl mx-auto mb-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 opacity-80">
            <p>FlexiUI started as a personal project to solve a common problem: building consistent, beautiful UIs without spending hours on design decisions.</p>
            <p>We believe that every developer should have access to high-quality UI components that are accessible, customizable, and easy to use.</p>
            <p>Today, FlexiUI is used by thousands of developers around the world to build everything from personal projects to enterprise applications.</p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-2xl border border-[var(--flexi-border)]" style={{ backgroundColor: 'var(--flexi-bg-subtle)' }}>
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm opacity-70">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-[var(--flexi-border)] my-20" />

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center p-6 rounded-2xl border border-[var(--flexi-border)]" style={{ backgroundColor: 'var(--flexi-bg-subtle)' }}>
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: 'rgba(0,255,156,0.2)', color: '#00FF9C' }}
                >
                  {member.avatar}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm mb-2" style={{ color: '#00FF9C' }}>{member.role}</p>
                <p className="text-sm opacity-70">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block p-8 rounded-3xl border" style={{ background: 'linear-gradient(135deg, rgba(0,255,156,0.1), transparent)', borderColor: 'rgba(0,255,156,0.3)' }}>
            <h3 className="text-xl font-bold mb-2">Want to contribute?</h3>
            <p className="opacity-70 mb-4">FlexiUI is open source. We welcome contributions!</p>
            <div className="flex gap-4 justify-center">
              <a href="https://github.com/flexireact/flexi-ui" className="px-5 py-2.5 text-sm font-medium rounded-xl border border-[var(--flexi-border)] hover:bg-[var(--flexi-bg-muted)] transition-colors inline-flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </a>
              <a href="#" className="px-5 py-2.5 text-sm font-medium rounded-xl text-black" style={{ backgroundColor: '#00FF9C' }}>
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
