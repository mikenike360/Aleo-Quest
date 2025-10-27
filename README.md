# 🌌 Aleo Quest

A production-ready web application for learning zero-knowledge proofs through interactive experiences. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and modern React patterns.

## 🎯 Overview

This application provides three complementary ways to explore Aleo and zero-knowledge technology:

1. **Learn** 📚 — Gaztec-style narrative microsite with MDX-driven chapters
2. **See** 👁️ — Interactive visualizers showing ZK concepts in action
3. **Do** 🎮 — Gamified ZK Quest with 5 stages for hands-on learning

## ✨ Features

### Learning Path
- 6 comprehensive MDX chapters covering ZK fundamentals
- Sticky progress tracking with localStorage persistence
- Beautiful step-by-step navigation with prev/next
- Interactive quizzes and callouts

### Interactive Demos
- **Proof Animator** — Visualize proof generation and verification
- **Privacy Comparison** — See data exposure with/without ZK
- **Range Proof** — Prove properties without revealing values

### ZK Quest (Gamified)
- 5-stage progressive challenge system
- Real-time proof generation via mock APIs
- Badge collection and progress tracking
- Story-driven narrative with explainers
- Interactive mini-games optimized for mobile
- Responsive quest completion screen

### Developer Playground
- Monaco editor integration (placeholder for Leo code)
- Syntax highlighting and code execution preview
- TODO hooks for WASM Leo compiler integration

### Technical Highlights
- ✅ Next.js 14 App Router with RSC
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS + shadcn/ui + Radix primitives
- ✅ Framer Motion animations
- ✅ Zustand for state management
- ✅ MDX for content management
- ✅ Mock proof API endpoints
- ✅ Plausible analytics (optional)
- ✅ Fully responsive mobile-first design
- ✅ Optimized for touch interfaces (44px+ touch targets)
- ✅ Accessibility-friendly (keyboard nav, ARIA labels)
- ✅ Responsive ASCII art logos
- ✅ Adaptive image scaling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn (recommended) or npm/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/mikenike360/aleo-starter-template.git
cd aleo-starter-template

# Install dependencies (user prefers yarn)
yarn install

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### First Time Setup

The app will work immediately, but for the best experience:

1. **Install all new dependencies:**
```bash
yarn install
```

2. **Optional: Configure Plausible Analytics**
Create a `.env.local` file:
```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_PLAUSIBLE_API_HOST=https://plausible.io
```

3. **Build for production:**
```bash
yarn build
yarn start
```

## 📦 Project Structure

```
aleo-starter-template/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with nav/footer
│   ├── page.tsx                 # Landing page
│   ├── learn/                   # Learning section
│   ├── quest/                   # Gamified quest
│   ├── playground/              # Monaco editor playground
│   └── api/                     # API routes
│       └── proofs/              # Mock proof endpoints
│           ├── commit/
│           ├── prove/
│           └── payment/
├── components/                   # React components
│   ├── ui/                      # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   └── tabs.tsx
│   ├── ProgressBar.tsx          # Global progress tracker
│   ├── StepChrome.tsx           # Learn section wrapper
│   ├── QuestStage.tsx           # Quest stage component
│   ├── Callout.tsx              # MDX callout component
│   ├── Quiz.tsx                 # Interactive quiz
│   ├── Diagram.tsx              # SVG diagram wrapper
│   ├── ProofAnimator.tsx        # Demo: proof animation
│   ├── PrivacyCompare.tsx       # Demo: privacy comparison
│   └── RangeProof.tsx           # Demo: range proof
├── content/                      # MDX content
│   └── learn/                   # Learning chapters
│       ├── intro.mdx
│       ├── zk.mdx
│       ├── how-it-works.mdx
│       ├── use-cases.mdx
│       ├── build-with-leo.mdx
│       └── get-started.mdx
├── lib/                         # Utilities
│   ├── cn.ts                   # Tailwind class merger
│   ├── hash.ts                 # Mock proof generation
│   ├── store.ts                # Zustand state management
│   ├── steps.ts                # Learn step definitions
│   ├── mdx.ts                  # MDX loader utilities
│   └── analytics.ts            # Plausible integration
├── src/                         # Legacy (Pages Router)
│   └── assets/css/
│       └── globals.css         # Global styles
├── program/                     # Aleo Leo program (existing)
├── public/                      # Static assets
├── next.config.js              # Next.js config (with MDX)
├── tailwind.config.js          # Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## 🧩 Key Components

### State Management (Zustand)
Located in `lib/store.ts`, manages:
- Learn progress (current step, completed steps)
- Quest progress (stage, data, proofs)
- Badge collection
- LocalStorage persistence

### Content System (MDX)
- Content files in `content/learn/*.mdx`
- Frontmatter for metadata (id, title, summary, CTA)
- Custom components: `<Callout>`, `<Quiz>`, `<Diagram>`
- Server-side rendering with `next-mdx-remote`

### Mock Proof APIs
Three endpoints simulate real Aleo proof operations:
- `POST /api/proofs/commit` — Generate commitment
- `POST /api/proofs/prove` — Verify predicate proof
- `POST /api/proofs/payment` — Private payment proof

**TODO:** Replace with real Aleo SDK integration.

## 📱 Mobile Optimization

### Responsive Design Features
- **Scaling ASCII Logos**: Logo automatically adjusts from 0.35rem (mobile) to 0.5rem (desktop)
- **Adaptive Images**: Quest completion and stage images scale proportionally
- **Touch-Optimized**: All interactive elements meet 44px minimum touch target
- **Flexible Layouts**: Buttons and content stack appropriately on narrow screens
- **Mobile-First**: Padding, spacing, and fonts optimized for small viewports

### Tested Viewports
- Mobile: 320px - 375px width
- Tablet: 768px - 1024px width  
- Desktop: 1280px+ width

## 🎨 Customization

### Styling
- Dark theme by default (easily switchable)
- Modify color scheme in `tailwind.config.js`
- Global styles in `src/assets/css/globals.css`
- Component variants via `class-variance-authority`

### Content
Edit MDX files in `content/learn/` to customize learning chapters. Each file supports:
```mdx
---
id: "step-id"
title: "Step Title"
summary: "Brief description"
ctaLabel: "Next Step"
ctaHref: "/learn/next-step"
---

# Your markdown content here

<Callout type="info" title="Pro Tip">
  Custom components work seamlessly!
</Callout>
```

### Quest Stages
Modify quest logic in `app/quest/page.tsx`. Each stage:
1. Calls mock API
2. Updates state
3. Awards badge
4. Transitions to next stage

## 🔌 Integration Points

### TODO: Aleo SDK Integration
Replace mock proof APIs with real Aleo functionality:

```typescript
// In app/api/proofs/commit/route.ts
import { AleoSDK } from '@demox-labs/aleo-sdk-web';

const commitment = await AleoSDK.generateCommitment(secret);
```

### TODO: Leo WASM in Playground
The Monaco editor is ready for Leo compilation:

```typescript
// In app/playground/page.tsx
import LeoWASM from 'leo-wasm'; // hypothetical

const result = await LeoWASM.compile(code);
```

### TODO: NFT Badge Minting
Wire quest completion to Aleo NFT minting:

```typescript
// In app/quest/page.tsx
if (questStage === 'completed') {
  await mintBadgeNFT(badges);
}
```

## 🧪 Development

### Available Scripts

```bash
# Development
yarn dev                 # Start dev server
yarn dev:ts             # Dev server + TypeScript watch mode

# Building
yarn build              # Production build
yarn start              # Start production server

# Leo Program
yarn build-program      # Compile Leo program
yarn program            # Full program pipeline

# Linting & Formatting
yarn lint               # Run ESLint
yarn ts                 # Type-check without emitting
```

### Type Safety
- Strict TypeScript mode enabled
- Path aliases configured (`@/*` → root imports)
- All components fully typed

### Testing the App
1. Start with `/` landing page
2. Navigate to `/learn` → complete a few steps
3. Go to `/quest` → complete stage 1
5. Check localStorage for persisted state

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
For production, set:
```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

### Build Optimizations
- Automatic static optimization for `/learn/[slug]`
- Server Components by default (RSC)
- Image optimization with Next.js Image
- Lazy-loaded Monaco editor

## 📊 Performance

Target Lighthouse scores (easily achievable):
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

Optimizations included:
- Font subsetting (Inter from Google Fonts)
- Lazy component loading
- Optimized animations (Framer Motion)
- Efficient state management
- Server-side MDX compilation

## 🏗️ Recent Improvements

### Mobile Responsiveness (Latest)
- ✅ Fixed ASCII logo overflow on mobile screens with responsive text sizing
- ✅ Made quest completion image responsive (scales from 576px to fit any screen)
- ✅ Improved button layouts to stack on mobile, side-by-side on desktop
- ✅ Enhanced touch targets for all mini-games (coins, checkboxes, sliders)
- ✅ Added responsive padding across all pages
- ✅ Improved text wrapping in interactive terminal

### Quest Enhancements
- ✅ Larger "START ALEO QUEST" button
- ✅ Removed privacy status bars from mini-games for cleaner UI
- ✅ Quest completion screen with celebration image
- ✅ Improved stage progression with better visual feedback

## 🤝 Contributing

This template is open-source to help grow the Aleo ecosystem.

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🔗 Resources

- **Aleo Docs**: [developer.aleo.org](https://developer.aleo.org)
- **Leo Language**: [leo-lang.org](https://leo-lang.org)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind**: [tailwindcss.com](https://tailwindcss.com)
- **shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)

## 🙌 Credits

Originally built by [@mikenike360](https://github.com/mikenike360) from [VenomLabs](https://venomlabs.xyz)

Guided Experience scaffold created as a comprehensive learning platform for zero-knowledge technology.

## 📄 License

MIT License — free to use, modify, and share.

---

**Ready to build privacy-first applications?** Start with `/learn` and complete the `/quest`! 🚀

---

### 📱 Mobile Testing

Test the responsive design across devices:
- Open Chrome DevTools (F12) → Toggle device toolbar
- Test: 320px (iPhone SE), 375px (iPhone), 768px (Tablet), 1280px+ (Desktop)
- Verify: No horizontal scrolling, touch targets ≥44px
