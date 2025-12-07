# FlexiUI Template

A beautiful landing page template built with FlexiReact and @flexireact/flexi-ui.

## Features

- 🎨 Modern, dark-first design
- 📱 Fully responsive
- ⚡ Fast and optimized
- 🎯 TypeScript support
- 🌙 Dark/Light mode toggle

## Pages

- **Home** - Landing page with hero, features, and CTA
- **Features** - Component showcase
- **Pricing** - Pricing plans with FAQ
- **About** - Team and company info

## Getting Started

```bash
# Create a new project with this template
npx create-flexireact my-app --template flexi-ui

# Navigate to project
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with ThemeProvider
│   └── globals.css     # Global styles
├── components/
│   ├── Navbar.tsx      # Navigation bar
│   └── Footer.tsx      # Footer component
├── pages/
│   ├── index.tsx       # Home page
│   ├── features.tsx    # Features page
│   ├── pricing.tsx     # Pricing page
│   └── about.tsx       # About page
├── public/
│   └── favicon.svg     # Site favicon
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Customization

### Colors

Edit the Tailwind config to customize the primary color:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#00FF9C', // Change this
        },
      },
    },
  },
};
```

### Components

All FlexiUI components are available:

```tsx
import {
  Button,
  Card,
  Input,
  Modal,
  Toast,
  // ... and more
} from '@flexireact/flexi-ui';
```

## License

MIT
