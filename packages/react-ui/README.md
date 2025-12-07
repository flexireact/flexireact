# @flexi/react-ui

Modern, accessible UI component library for FlexiReact applications.

![Version](https://img.shields.io/npm/v/@flexi/react-ui)
![License](https://img.shields.io/npm/l/@flexi/react-ui)

## ✨ Features

- 🎨 **Beautiful Design** - Minimalist, futuristic UI with neon emerald accents
- 🌙 **Dark Mode** - First-class dark theme support
- ♿ **Accessible** - ARIA-compliant components built on Radix UI
- 🎯 **TypeScript** - Full type safety out of the box
- 🌳 **Tree-shakeable** - Import only what you need
- ⚡ **SSR Ready** - Works with FlexiReact's SSR/SSG
- 🏝️ **Islands Compatible** - Zero-JS optional for static components

## 📦 Installation

```bash
npm install @flexi/react-ui
# or
pnpm add @flexi/react-ui
# or
yarn add @flexi/react-ui
```

### Peer Dependencies

```bash
npm install react react-dom tailwindcss
```

## 🚀 Quick Start

### 1. Configure Tailwind

```js
// tailwind.config.js
const { flexiUIPlugin } = require('@flexi/react-ui/tailwind');

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@flexi/react-ui/dist/**/*.js',
  ],
  plugins: [flexiUIPlugin],
};
```

### 2. Add Theme Provider

```tsx
// app/layout.tsx or pages/_app.tsx
import { ThemeProvider } from '@flexi/react-ui';

export default function App({ children }) {
  return (
    <ThemeProvider defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
}
```

### 3. Use Components

```tsx
import { Button, Card, Input, Badge } from '@flexi/react-ui';

export default function MyPage() {
  return (
    <Card>
      <h2>Welcome!</h2>
      <Input placeholder="Enter your name" />
      <Button variant="primary">Get Started</Button>
      <Badge variant="success">New</Badge>
    </Card>
  );
}
```

## 🧱 Components

### Core
| Component | Description |
|-----------|-------------|
| `Button` | Versatile button with variants (primary, secondary, outline, ghost, danger, link) |
| `Input` | Text input with validation, icons, and helper text |
| `Textarea` | Multi-line text input |
| `Checkbox` | Checkbox with optional label |
| `Switch` | Toggle switch component |

### Display
| Component | Description |
|-----------|-------------|
| `Card` | Content container with variants |
| `Badge` | Status indicator badges |
| `Avatar` | User avatar with fallback and status |

### Feedback
| Component | Description |
|-----------|-------------|
| `Alert` | Alert messages (success, warning, error, info) |
| `Spinner` | Loading spinner with variants |
| `Skeleton` | Loading placeholder |
| `Progress` | Progress bar |

### Layout
| Component | Description |
|-----------|-------------|
| `Stack` | Flex layout helper (HStack, VStack) |
| `Separator` | Visual divider |
| `Center` | Center content |

### Overlay
| Component | Description |
|-----------|-------------|
| `Modal` | Dialog/modal window |

## 🎨 Theming

### Design Tokens

```ts
import { colors, radius, shadows } from '@flexi/react-ui';

// Primary color: Neon Emerald (#00FF9C)
colors.primary[500] // '#00FF9C'

// Rounded corners
radius['2xl'] // '1.5rem'

// Glow shadows
shadows.glow // '0 0 20px rgba(0, 255, 156, 0.3)'
```

### Theme Toggle

```tsx
import { useTheme, ThemeToggle } from '@flexi/react-ui';

function Header() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  return (
    <header>
      <ThemeToggle />
      {/* or custom */}
      <button onClick={toggleTheme}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
```

## 📖 Component Examples

### Button

```tsx
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button loading>Loading...</Button>
<Button leftIcon={<Icon />}>With Icon</Button>
```

### Input

```tsx
<Input placeholder="Email" />
<Input label="Username" helperText="Choose wisely" />
<Input variant="filled" />
<Input error helperText="Invalid email" />
<Input leftElement={<SearchIcon />} />
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

<Card variant="elevated">Elevated card</Card>
<Card variant="glass">Glass effect</Card>
<Card hover>Hover effect</Card>
```

### Modal

```tsx
<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
      <ModalDescription>Modal description</ModalDescription>
    </ModalHeader>
    <p>Modal content goes here</p>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="ghost">Cancel</Button>
      </ModalClose>
      <Button>Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Alert

```tsx
<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>

<Alert variant="error" onClose={() => {}}>
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

### Stack

```tsx
<HStack gap={4}>
  <Button>One</Button>
  <Button>Two</Button>
</HStack>

<VStack align="start" gap={2}>
  <Input />
  <Button>Submit</Button>
</VStack>

<Stack direction="row" justify="between" align="center">
  <span>Left</span>
  <span>Right</span>
</Stack>
```

## 🛠️ CLI

```bash
# Initialize in your project
npx flexi-ui init

# Add specific components
npx flexi-ui add button card modal

# List available components
npx flexi-ui list
```

## 🎯 API Reference

### Common Props

All components accept:
- `className` - Additional CSS classes
- `variant` - Visual variant
- `size` - Size variant (sm, md, lg)

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'link'` | `'primary'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'icon'` | `'md'` | Size |
| `loading` | `boolean` | `false` | Show loading spinner |
| `fullWidth` | `boolean` | `false` | Full width button |
| `leftIcon` | `ReactNode` | - | Icon before text |
| `rightIcon` | `ReactNode` | - | Icon after text |
| `asChild` | `boolean` | `false` | Render as child element |

### Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'filled' \| 'flushed'` | `'default'` | Visual variant |
| `inputSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `error` | `boolean` | `false` | Error state |
| `label` | `string` | - | Input label |
| `helperText` | `string` | - | Helper/error text |
| `leftElement` | `ReactNode` | - | Left icon/element |
| `rightElement` | `ReactNode` | - | Right icon/element |

## 📄 License

MIT © FlexiReact Team
