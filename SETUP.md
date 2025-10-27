# 🚀 Setup Guide - Aleo Quest

This guide will help you get the application running quickly.

## Prerequisites

- Node.js 18.x or higher
- Yarn package manager (recommended) or npm/pnpm
- Git

## Step-by-Step Installation

### 1. Clone and Install

```bash
cd aleo-starter-template

# Install all dependencies
yarn install
```

### 2. Environment Configuration (Optional)

Create a `.env.local` file in the root directory:

```env
# Plausible Analytics (Optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_PLAUSIBLE_API_HOST=https://plausible.io

# Existing Aleo Config
URL=http://localhost:3000
TWITTER=https://twitter.com/aleohq
DISCORD=https://discord.gg/aleo
RPC_URL=https://api.explorer.aleo.org/v1
```

### 3. Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Verify Installation

Check that these pages work:
- ✅ Landing page: `/`
- ✅ Learn section: `/learn`
- ✅ ZK Quest: `/quest`
- ✅ Playground: `/playground`

## Common Issues

### Issue: Module not found errors

**Solution:** Make sure all dependencies are installed:
```bash
rm -rf node_modules yarn.lock
yarn install
```

### Issue: TypeScript errors

**Solution:** Run type checking:
```bash
yarn ts
```

### Issue: MDX files not loading

**Solution:** Ensure `content/learn/` directory exists with all `.mdx` files.

### Issue: Port 3000 already in use

**Solution:** Use a different port:
```bash
yarn dev -p 3001
```

## Building for Production

```bash
# Create production build
yarn build

# Test production build locally
yarn start
```

## Project Architecture

### Key Directories

- `app/` — Next.js App Router pages and API routes
- `components/` — React components (UI primitives + custom)
- `lib/` — Utilities (state, MDX loader, analytics)
- `content/learn/` — MDX content for learning chapters
- `public/` — Static assets

### State Management

The app uses Zustand with localStorage persistence:
- Learn progress (current step, completed steps)
- Quest progress (stage, badges, proofs)
- Global badge collection

State is stored in `lib/store.ts`.

### Content Management

Learning content is managed via MDX files in `content/learn/`:
- Each file has frontmatter (id, title, summary)
- Supports custom components: `<Callout>`, `<Quiz>`, `<Diagram>`
- Step order defined in `lib/steps.ts`

### API Routes

Three mock proof endpoints:
- `POST /api/proofs/commit` — Generate commitment
- `POST /api/proofs/prove` — Verify proof
- `POST /api/proofs/payment` — Private payment

**TODO:** Replace with real Aleo SDK calls.

## Development Workflow

### Adding a New Learn Step

1. Create `content/learn/new-step.mdx`:
```mdx
---
id: "new-step"
title: "New Step Title"
summary: "Brief description"
---

# Content here
```

2. Add to `lib/steps.ts`:
```typescript
{
  id: 'new-step',
  title: 'New Step Title',
  summary: 'Brief description',
  order: 7,
}
```

### Adding a New Component

1. Create component in `components/`:
```tsx
export function MyComponent({ prop }: Props) {
  return <div>...</div>;
}
```

2. Import and use in pages/MDX.

### Modifying Quest Stages

Edit `app/quest/page.tsx` to add new stages or modify behavior.

## Customization

### Changing Theme Colors

Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: { ... },
    }
  }
}
```

### Modifying Layout

Edit `app/layout.tsx` for global nav/footer changes.

### Adding Analytics Events

Use the analytics helper:
```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('custom_event', { prop: 'value' });
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically on push

### Manual Deployment

```bash
yarn build
# Upload .next/ folder to your hosting
```

## Next Steps

- [ ] Replace mock APIs with real Aleo SDK
- [ ] Integrate Leo WASM compiler in playground
- [ ] Add NFT badge minting for quest completion
- [ ] Expand content with more learning chapters
- [ ] Add wallet connection for real transactions

## Getting Help

- **Documentation**: See `README.md`
- **Issues**: Check existing issues or create new one
- **Community**: Join Aleo Discord

---

Happy building! 🚀

