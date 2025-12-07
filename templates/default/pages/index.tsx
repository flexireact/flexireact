'use client';

import React from 'react';
import { Navbar } from '../app/components/Navbar';
import { Button } from '../app/components/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../app/components/Card';

export const title = 'FlexiReact - The Modern React Framework';

const features = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Powered by esbuild for instant builds and blazing-fast hot module replacement.',
  },
  {
    icon: '🎨',
    title: 'Tailwind CSS',
    description: 'Pre-configured with Tailwind CSS, beautiful defaults, and dark mode support.',
  },
  {
    icon: '📘',
    title: 'TypeScript First',
    description: 'Full TypeScript support with strict type checking and excellent DX.',
  },
  {
    icon: '🏝️',
    title: 'Islands Architecture',
    description: 'Partial hydration for minimal JavaScript and maximum performance.',
  },
  {
    icon: '📁',
    title: 'File-based Routing',
    description: 'Intuitive routing. Create a file in pages/, get a route automatically.',
  },
  {
    icon: '🔌',
    title: 'API Routes',
    description: 'Build your backend API alongside your frontend with ease.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-purple-500/20 via-transparent to-transparent blur-3xl" />
        
        <div className="relative mx-auto max-w-5xl text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center animate-fade-in">
            <svg className="h-24 w-24 sm:h-32 sm:w-32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#61DAFB"/>
                  <stop offset="100%" stopColor="#21A1F1"/>
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="12" fill="url(#heroGradient)"/>
              <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#heroGradient)" strokeWidth="6" transform="rotate(-30 100 100)"/>
              <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#heroGradient)" strokeWidth="6" transform="rotate(30 100 100)"/>
              <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="url(#heroGradient)" strokeWidth="6" transform="rotate(90 100 100)"/>
              <circle cx="28" cy="70" r="8" fill="url(#heroGradient)"/>
              <circle cx="172" cy="130" r="8" fill="url(#heroGradient)"/>
              <circle cx="100" cy="20" r="8" fill="url(#heroGradient)"/>
            </svg>
          </div>

          {/* Badge */}
          <div className="mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground">v2.1 — TypeScript, Tailwind & Islands</span>
          </div>
          
          {/* Heading */}
          <h1 className="mb-6 animate-slide-up text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block text-foreground">
              Build faster with
            </span>
            <span className="mt-2 block bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              FlexiReact
            </span>
          </h1>
          
          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl animate-slide-up text-lg text-muted-foreground" style={{ animationDelay: '0.1s' }}>
            The modern React framework with TypeScript, Tailwind CSS, SSR, SSG, 
            Islands architecture, and file-based routing. Inspired by Next.js, 
            Remix, and Astro — but simpler.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button size="xl" className="group">
              <span>Get Started</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Button>
            <Button variant="outline" size="xl">
              Documentation
            </Button>
          </div>

          {/* Code Example */}
          <div className="mt-16 mx-auto max-w-2xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-muted-foreground">Terminal</span>
              </div>
              <pre className="text-left text-sm">
                <code className="text-muted-foreground">
                  <span className="text-green-400">$</span> npx flexireact create my-app{'\n'}
                  <span className="text-green-400">$</span> cd my-app{'\n'}
                  <span className="text-green-400">$</span> npm run dev
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything you need to build modern apps
            </h2>
            <p className="mt-4 text-muted-foreground">
              A complete toolkit for building fast, scalable React applications.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-2 text-3xl">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-2xl border border-border bg-gradient-to-b from-secondary/50 to-transparent p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Create your first FlexiReact app in seconds.
            </p>
            <div className="mt-8">
              <Button size="xl" className="group">
                <span>Start Building</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-semibold">FlexiReact</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ by the FlexiReact team
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/flexireact" className="text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
