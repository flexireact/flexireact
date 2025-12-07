import React from 'react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for side projects',
    features: ['All 23+ components', 'MIT License', 'Community support', 'Basic docs'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/one-time',
    description: 'For professional developers',
    features: ['Everything in Free', 'Premium components', 'Figma files', 'Priority support', 'Discord access', 'Early access'],
    cta: 'Buy Now',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large teams',
    features: ['Everything in Pro', 'Custom components', 'Dedicated support', 'SLA guarantee', 'On-boarding', 'Custom theming'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  { q: 'Is FlexiUI really free?', a: 'Yes! The core library is completely free and open source under the MIT license.' },
  { q: 'What do I get with Pro?', a: 'Pro includes premium components, Figma design files, priority support, and early access.' },
  { q: 'Can I use FlexiUI with Next.js?', a: 'Absolutely! FlexiUI works with Next.js, Remix, FlexiReact, and any React framework.' },
  { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee for Pro purchases.' },
];

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full border border-[var(--flexi-border)] mb-4">Pricing</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">Start for free, upgrade when you need more.</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-[#00FF9C]' : 'border-[var(--flexi-border)]'}`}
              style={{ backgroundColor: plan.popular ? 'rgba(0,255,156,0.05)' : 'var(--flexi-bg-subtle)' }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full text-black" style={{ backgroundColor: '#00FF9C' }}>
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="opacity-70">{plan.period}</span>}
                </div>
                <p className="text-sm opacity-70">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF9C" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
                  plan.popular
                    ? 'text-black'
                    : 'border border-[var(--flexi-border)] hover:bg-[var(--flexi-bg-muted)]'
                }`}
                style={plan.popular ? { backgroundColor: '#00FF9C' } : {}}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-[var(--flexi-border)] my-20" />

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="opacity-70">Got questions? We've got answers.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-2xl border border-[var(--flexi-border)]" style={{ backgroundColor: 'var(--flexi-bg-subtle)' }}>
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm opacity-70">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
