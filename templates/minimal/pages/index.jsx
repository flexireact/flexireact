import React from 'react';

export const title = 'Welcome to FlexiReact';

export default function HomePage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚡ FlexiReact</h1>
      <p style={styles.subtitle}>Your minimal app is ready!</p>
      
      <div style={styles.links}>
        <a href="/api/hello" style={styles.link}>API Example →</a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: 'system-ui, sans-serif',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    opacity: 0.7,
    marginBottom: '2rem',
  },
  links: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    color: '#a855f7',
    textDecoration: 'none',
  },
};
