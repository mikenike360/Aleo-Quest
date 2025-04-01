
# 🛠️ Aleo Starter Template

A modern, open-source starter template for building **Aleo dApps** with:

- [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- Integrated [Leo Wallet](https://www.aleo.org/post/leo-wallet) support
- Light/dark mode and reusable UI components
- Bonus: Aleo program examples, fee calculation, private/public transfers, and more

---

## ⚡ Features

✅ Wallet Connect w/ Leo Wallet  
✅ Tailwind + DaisyUI pre-configured  
✅ Dark mode toggle out of the box  
✅ Reusable component & layout structure  
✅ Aleo RPC interaction examples  
✅ Ready-to-use file structure  
✅ Built for dev speed & extensibility

---

## 🚀 Quick Start

```bash
git clone https://github.com/mikenike360/zkontract.git aleo-starter
cd aleo-starter
yarn install
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Wallet Integration

This template includes Leo Wallet browser extension support.

### 👉 How it works:
- Detects Leo Wallet via `window.aleo`
- Allows users to connect and view their public address and view key
- Code: [`components/aleo/WalletConnect.tsx`](./src/components/aleo/WalletConnect.tsx)

> Make sure you have the [Leo Wallet extension](https://www.aleo.org/post/leo-wallet) installed.

---

## 🧩 Example Aleo Program

Includes a demo `.leo` program and compiled build:

```bash
cd program
leo run main
```

You can replace this with your own program and wire it into the frontend via Aleo RPC or your preferred method.

---

## 📦 Project Structure

```
.
├── /program/         ← Sample Leo program
├── /src/
│   ├── assets/       ← Global styles
│   ├── components/   ← UI + wallet connect
│   ├── hooks/        ← Custom React hooks
│   ├── layouts/      ← Page structure
│   ├── pages/        ← Next.js routes
│   ├── types/        ← TypeScript types
│   └── utils/        ← Aleo-specific helpers
```

---

## 🧠 Bonus Utilities (Optional)

- [`utils/feeCalculator.ts`](./src/utils/feeCalculator.ts) – helpful for estimating transaction costs
- [`utils/privateTransfer.ts`](./src/utils/privateTransfer.ts) – Aleo private transfer logic
- [`utils/publicTransfer.ts`](./src/utils/publicTransfer.ts) – public transfer example
- [`utils/GLSLBackground.tsx`](./src/utils/GLSLBackground.tsx) – dynamic background component

These are **not required** but useful if you plan to build more complex interactions.

---

## 🤝 Use This Template

You can click **“Use this template”** on GitHub to instantly clone and start building.

---

## 📸 Screenshot

> _Drop a screenshot here of the starter homepage with Leo Wallet connected_

---

## 🧑‍💻 Author

Built by [@mikenike360](https://github.com/mikenike360)

---

## 🌐 License

MIT – free to use, modify, and share.
