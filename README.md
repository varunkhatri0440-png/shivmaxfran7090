# Shivmax Luxury Real Estate Platform 🏢✨

> **Enterprise-Grade Luxury Real Estate & Franchise Acquisition Platform** built with **Next.js 14 App Router**, **NestJS Backend Architecture**, **TailwindCSS**, **Framer Motion**, and **Canvas Frame-Scroller Technology**.

---

## 🌟 Overview

**Shivmax** is an ultra-modern, high-performance web platform tailored for luxury commercial real estate developments, high-net-worth investor onboarding, and franchise acquisition. Featuring cinematic frame-by-frame canvas rendering, interactive ROI & mortgage calculators, dynamic 3D asset views, and automated lead capture workflows.

---

## 🚀 Key Features

- **Cinematic 300-Frame Canvas Scroller**: Seamless scroll-driven viewport rendering optimized with high-efficiency WebP frames and preloading algorithms.
- **Interactive Financial Calculators**: Real-time Mortgage & Investment ROI calculators with amortisation schedules and instant PDF/lead export.
- **Enterprise Lead Pipeline**: Multi-step franchise application flow with real-time validation, honeypot spam protection, and NestJS REST API endpoints.
- **Luxury Aesthetic Design System**: Bespoke dark/gold glassmorphism theme, typography hierarchies, micro-interactions, and accessible responsive components.
- **Production & Vercel Ready**: Preconfigured with `vercel.json`, root deployment orchestration, security headers, and automated GitHub Actions CI/CD workflows.

---

## 🏗️ Project Architecture

```
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI (lint, build, type-check)
├── backend/                     # Enterprise NestJS Backend
│   ├── src/
│   │   ├── common/              # Global filters, interceptors, guards
│   │   ├── modules/             # Leads, franchise & investor modules
│   │   └── main.ts              # NestJS entrypoint
│   └── package.json
├── frontend/                    # Next.js 14 App Router Frontend
│   ├── public/
│   │   ├── frames/              # 300 high-performance WebP sequence frames
│   │   └── images/              # Optimized project imagery
│   ├── src/
│   │   ├── app/                 # Next.js App directory & pages
│   │   ├── components/          # High-performance UI components
│   │   └── lib/                 # Utility functions & API clients
│   └── package.json
├── scripts/                     # Performance, optimization & audit scripts
├── vercel.json                  # One-click Vercel deployment configuration
└── package.json                 # Monorepo root scripts
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** >= 18.x
- **npm** or **pnpm**

### 2. Installation
Clone the repository and install root and package dependencies:
```bash
git clone https://github.com/varunkhatri0440-png/shivmaxfran7090.git
cd shivmaxfran7090

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 3. Development
Run both frontend and backend concurrently from the root:
```bash
npm run dev
```
Or run individually:
```bash
# Frontend (Next.js) - http://localhost:3000
npm run dev:frontend

# Backend (NestJS) - http://localhost:4000
npm run dev:backend
```

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel

The project contains a preconfigured [vercel.json](vercel.json) targeting the Next.js `frontend` directory with automatic root builds:

1. Import this repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `.` (or select `frontend`).
3. Add any environment variables (e.g. `NEXT_PUBLIC_API_URL`).
4. Click **Deploy**.

---

## 🔒 Security & Quality Standards
- Strict input validation via `class-validator` & `zod`.
- Rate limiting & honeypot traps against bot submissions.
- Strict TypeScript configurations across both Frontend and Backend.
- Automated GitHub Actions build and lint verification.

---

## 📄 License
Private / Proprietary — Shivmax Real Estate Group. All rights reserved.
