# 🌌 Aleo Quest

An interactive web application for learning zero-knowledge proofs through narrative lessons and gamified challenges. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎯 Overview

Aleo Quest provides two complementary ways to explore zero-knowledge technology:

1. **Learn** 📚 — Narrative chapters with step-by-step explanations
2. **Quest** 🎮 — Gamified 5-stage challenge with hands-on mini-games

## ✨ Features

### Learning Path
- 5 comprehensive chapters covering ZK fundamentals
- Interactive quizzes and callouts
- Progress tracking with localStorage persistence
- Step-by-step navigation

### ZK Quest
- 5 progressive stages with interactive challenges
- Real-time proof generation via mock APIs
- Badge collection and progress tracking
- Story-driven narrative
- Mobile-optimized mini-games

### Technical Highlights
- ✅ Next.js 14 App Router with Server Components
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Framer Motion animations
- ✅ Zustand for state management
- ✅ MDX for content management
- ✅ Terminal-themed UI with CRT effects
- ✅ Interactive command-line terminal
- ✅ Fully responsive mobile-first design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/mikenike360/aleo-starter-template.git
cd aleo-starter-template

# Install dependencies
yarn install

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Optional: Configure Analytics

Create a `.env.local` file:
```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_PLAUSIBLE_API_HOST=https://plausible.io
```

## 📦 Project Structure

```
aleo-starter-template/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with nav/footer
│   ├── page.tsx                 # Home page with boot sequence
│   ├── globals.css              # Global styles
│   ├── learn/                   # Learning section
│   │   ├── page.tsx            # Learn overview
│   │   └── [slug]/             # Individual lessons
│   ├── quest/                   # Gamified quest
│   │   ├── page.tsx            # Quest main page
│   │   └── StoryQuest.tsx      # Quest story logic
│   └── api/                     # API routes (mock proofs)
├── components/                   # React components
│   ├── ui/                      # shadcn/ui primitives
│   ├── zkVisuals/               # ZK visualizations & particle effects
│   ├── BootSequence.tsx         # Boot animation
│   ├── InteractiveTerminal.tsx  # Command-line interface
│   ├── StepChrome.tsx           # Learn lesson wrapper
│   └── [others].tsx             # Quest components, mini-games
├── content/                      # MDX content
│   └── learn/                   # Learning chapters (5 lessons)
├── lib/                         # Utilities
│   ├── store.ts                # Zustand state management
│   ├── steps.ts                # Learn step definitions
│   ├── quest-story.ts          # Quest narratives
│   ├── audio.ts                # Sound management
│   └── analytics.ts            # Analytics integration
├── public/                      # Static assets (images, sounds)
├── next.config.js              # Next.js config with MDX
├── tailwind.config.js          # Tailwind configuration
└── package.json                # Dependencies
```

## 🧩 Key Features

### State Management
Located in `lib/store.ts`, manages:
- Learn progress (completed steps, current step)
- Quest progress (stage, data, badges)
- Audio preferences (mute state)
- LocalStorage persistence

### Content System (MDX)
- Content in `content/learn/*.mdx`
- Frontmatter for metadata (id, title, summary)
- Custom components: `<Callout>`, `<Quiz>`
- Server-side rendering

### Mock Proof APIs
Three endpoints simulate Aleo proof operations:
- `POST /api/proofs/commit` — Generate commitment
- `POST /api/proofs/prove` — Verify predicate proof
- `POST /api/proofs/payment` — Private payment proof

**TODO:** Replace with real Aleo SDK integration.

### Interactive Terminal
- Command-line navigation (`cd learn`, `cd quest`, `cd home`)
- Progress tracking (`whoami`)
- File browsing (`ls`)
- Terminal-themed UI matching the aesthetic

## 🎨 Customization

### Styling
- Terminal-themed dark mode by default
- Green/cyan color scheme in `tailwind.config.js`
- Global styles in `app/globals.css`
- CRT flicker effects for authentic terminal feel

### Content
Edit MDX files in `content/learn/` to customize chapters:
```mdx
---
id: "step-id"
title: "Chapter Title"
summary: "Brief description"
---

# Your markdown content here

<Callout type="info" title="Pro Tip">
  Custom components work seamlessly!
</Callout>
```

### Quest Stages
Modify quest logic in `app/quest/StoryQuest.tsx` and narratives in `lib/quest-story.ts`.

## 🔌 Integration Points

### TODO: Aleo SDK Integration
Replace mock proof APIs with real Aleo functionality:

```typescript
// In app/api/proofs/*/route.ts
import { AleoSDK } from '@demox-labs/aleo-sdk-web';

const commitment = await AleoSDK.generateCommitment(secret);
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
yarn build              # Production build
yarn start              # Start production server

# Linting
yarn lint               # Run ESLint
```

### Testing the App
1. Start at home page with boot sequence
2. Navigate to `/learn` and complete lessons
3. Go to `/quest` and complete stages
4. Use interactive terminal to navigate (`cd learn`, `cd quest`)
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
For production analytics:
```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

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

## 🙌 Credits

Built with ♥ by [VenomLabs](https://venomlabs.xyz)

Created as a comprehensive learning platform for zero-knowledge technology.

## 📄 License

MIT License — free to use, modify, and share.

---

**Ready to explore zero-knowledge?** Start with the boot sequence, then `/learn` and `/quest`! 🚀
