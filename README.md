<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/brand/echoir_wordmark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/brand/echoir_wordmark_light.svg">
    <img src="./assets/brand/echoir_wordmark.svg" alt="Echoir — Digital Choral Songbook" width="380" />
  </picture>
</p>

<p align="center">
  <strong>The digital songbook and collaborative workspace for choirs, vocal ensembles, and conductors.</strong><br>
  Digitized sheet music scores, synchronized multi-track voice part stems, and real-time concert setlist orchestration.
</p>

<p align="center">
  <a href="https://echoir.onrender.com"><img src="https://img.shields.io/badge/Live%20Demo-echoir.onrender.com-10b981?style=flat&logo=render&logoColor=white" alt="Live Demo" /></a>
  <a href="#system-architecture"><img src="https://img.shields.io/badge/Architecture-4--Tier%20MVC%2FRepository-6366f1?style=flat" alt="Architecture" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x%20(Strict)-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-38bdf8?style=flat&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-334155?style=flat&logo=nodedotjs&logoColor=white" alt="Node" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/Database-MongoDB%20Native-059669?style=flat&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-1e1b4b?style=flat" alt="License" /></a>
</p>

<p align="center">
  <a href="https://echoir.onrender.com"><b>Explore Live Demo</b></a> •
  <a href="#system-architecture">System Architecture</a> •
  <a href="#brand-identity--design-system">Brand Identity</a> •
  <a href="#engineering-case-studies">Case Studies</a> •
  <a href="#production-code-extracts">Code Extracts</a> •
  <a href="#application-interface--visual-showcase">UI Showcase</a>
</p>

---

## Project Context & Source Code Availability

The core production codebase for **echoir** is maintained in a private repository for intellectual property, security, and future commercialization purposes. This public repository serves as an **architectural proxy and engineering case study** to demonstrate:

- Production system architecture, boundary isolation, and domain modeling.
- Rigorous TypeScript craftsmanship (strict null checks, zero-`any` typing, clean interfaces).
- Concrete solutions to real-world engineering challenges (concurrency, multi-tenancy, resilient routing).
- **AI-Augmented Engineering & Agent Governance**: How hand-crafted foundational architecture transitioned into autonomous AI agent orchestration to accelerate development ~7x while maintaining 100% type safety and zero architectural drift.

> **For Hiring Managers & Technical Interviewers:**  
> A live walkthrough and code demonstration of the full private production repository is available upon request during technical interview stages. Please reach out via the [Contact](#contact--author) section.

---

## Live Production Deployment

The application is deployed and publicly accessible in production:

- **Live URL**: [https://echoir.onrender.com](https://echoir.onrender.com)

Feel free to register a test account, explore the dashboard, or create your own choir workspace.

> **Note on Free-Tier Hosting**: The backend is hosted on Render's free tier. If the instance has been idle, the initial request may take 30–50 seconds while the container spins up. Subsequent requests run at normal speed.

---

## Problem Space & Engineering Philosophy

### The Problem
Traditional choirs and vocal ensembles face fragmented, inefficient rehearsal workflows:
- Physical sheet music binders get damaged, lost, or forgotten.
- Voice part rehearsal tracks are scattered across WhatsApp chats, Google Drives, and email attachments.
- Concert programmes and running orders are tracked in ad-hoc spreadsheets without access to sheet music.

**echoir** consolidates the entire choral workflow into a single responsive web platform:
- **Centralized Repertoire**: Digitized scores with client-side PDF splitting, page rendering, and full-text search.
- **Multi-Track Voice Part Audio**: Isolated stem tracks for Soprano, Alto, Tenor, and Bass with synchronized in-browser playback.
- **Concert Programme Builder**: Drag-and-drop setlist reordering with automatic timing calculations.
- **Multi-Choir Workspaces**: Fast switching between different choirs with isolated repertoires and role permissions.
- **Frictionless Onboarding**: Cryptographic invite links and shareable join codes for rapid singer enrollment.

### Hand-Crafted Foundations, AI-Accelerated Scale
The foundational pillars of **echoir**—the 4-tier MVC/Repository layer isolation, native MongoDB concurrency guards, and custom React context workspace architecture—were designed and implemented completely by hand.

Once these architectural patterns were firmly established, development shifted to an **AI-Augmented Engineering model** using autonomous coding agents (Google Antigravity). By defining strict agent governance rules (`.agents/`), machine-readable path triggers (`acs.yaml`), and mandatory local CI verification gates, feature velocity accelerated dramatically (~7x) with zero degradation in code quality or type safety.

---

## System Architecture

The application is structured as a full-stack monorepo featuring a decoupled, strictly layered backend architecture and a responsive React SPA frontend.

```mermaid
flowchart TB
    subgraph Client["Frontend Client (React 18 + TypeScript + Vite)"]
        UI["UI Layer / Design Tokens"]
        RQ["TanStack React Query Cache"]
        Router["Hierarchical Dynamic Router"]
    end

    subgraph Gateway["API & Middleware Layer (Express.js)"]
        AuthMid["JWT Auth & Context Middleware"]
        UploadMid["Multer Media Streamer"]
        ErrorMid["Typed HTTP Error Handler"]
    end

    subgraph CoreBackend["4-Tier Backend Architecture"]
        Controllers["Controllers (HTTP Validation & Response Mapping)"]
        Services["Domain Services (Business Logic & Transactions)"]
        Repos["Repository Layer (Query Abstraction & MongoDB Drivers)"]
    end

    subgraph DataStore["Persistence & Storage Layer"]
        MongoDB[("MongoDB Native Driver")]
        CloudMedia[("Cloud Media & Storage Engine")]
    end

    Client <-->|REST API + JWT Bearer| Gateway
    Gateway --> Controllers
    Controllers --> Services
    Services --> Repos
    Repos <--> MongoDB
    Services <--> CloudMedia
```

For detailed sequence diagrams and container specifications, see the [System Overview Architecture Document](./architecture/system_overview.md) and [Data Models Specification](./architecture/data_models.md).

---

## Brand Identity & Design System

Echoir's visual identity, **"The Singing Score"**, bridges traditional choral music notation and modern digital design tokens into an engineered, cohesive visual language:

- **Emblem Architecture**: An open choral songbook with engraved staff lines centered around a classical treble clef. The clef's vertical spine serves as the physical binding hinge of the score.
- **Harmonic Voice-Part Spectrum**: The continuous emerald-to-cyan-to-indigo gradient directly mirrors the vocal ranges of a four-part choir (SATB):
  - **Soprano (`#34d399` / `#10b981`)**: The upper crown of the clef, used across active playback waveforms, live audio stems, and affirmative state indicators.
  - **Alto (`#38bdf8` / `#06b6d4`)**: The middle clef loop, applied to secondary accents, active navigation pills, and rehearsal controls.
  - **Tenor (`#6366f1` / `#4f46e5`)**: The clef root and notehead, providing the primary structural brand base.
  - **Bass (`#1e1b4b` / `#08070d`)**: The deep score binding pages, anchoring tonal dark surfaces and elevated workspace cards.
- **Two-Tier Icon Architecture**:
  - **Tier 1 (Browser Tabs, 16–48px)**: To eliminate the blurry container effect at low resolutions, the dark squircle is stripped, and the mark is scaled edge-to-edge with boosted optical weight.
  - **Tier 2 (High-DPI Launchers, 180–512px)**: Dark squircle container with border glow preserved for PWA launchers and Apple touch icons.
- **Single Source of Truth (`logoGeometry.json`)**: All brand marks, vector assets, and the in-app `<LogoIcon />` component are generated deterministically from a single JSON coordinate definition via headless Chromium rendering.

<p align="center">
  <img src="./assets/brand/echoir_official_brand_showcase.png" alt="Echoir Official Brand Identity & Design System" width="100%" />
</p>

*(For the complete vector asset inventory and token specifications, see the [Brand Asset Catalog](./assets/brand/README.md).)*

---

## Engineering Case Studies

In-depth technical write-ups examining specific architectural challenges, trade-offs, and failure modes solved during development:

| Case Study | Focus Area | Key Concepts |
| :--- | :--- | :--- |
| [**01. Strict 4-Tier Architecture & Layer Isolation**](./case-studies/01-strict-4-tier-architecture.md) | Backend Architecture | Repository Pattern, Zero-Leakage MongoDB Abstraction, Domain vs DB Models, Typed Error Hierarchy |
| [**02. Multi-Choir Workspace Switching & Invitations**](./case-studies/02-multi-choir-context-invitations.md) | Multi-Tenancy & Security | Workspace Context Injection, Cryptographic Invite Tokens, Dynamic Tenant Isolation, Cache Invalidation |
| [**03. Resilient Hierarchical Routing & Self-Healing Slugs**](./case-studies/03-resilient-hierarchical-routing.md) | Frontend & UX Architecture | Dual-Paradigm Path & Query Slugs, Multi-Pane Workbench State, Longest-Prefix Matching, Auto-Canonicalization |
| [**04. AI-Augmented Systems Engineering & Agent Governance**](./case-studies/04-agentic-engineering-governance.md) | AI Systems & Architecture | Progressive Disclosure, Deterministic Path Triggers, 5-Gate Operational Lifecycle, Upstream Provenance Tracking |
| [**05. Client-Side Persistent Media Caching & Memory Management**](./case-studies/05-persistent-client-side-media-cache.md) | Client Systems & Offline Storage | IndexedDB Blob Cache, Reference-Counted Object URLs, Lookahead Prefetching, Dual-Watermark LRU |

---

## Production Code Extracts

Curated, production-grade code extracts demonstrating coding standards, zero-`any` TypeScript policies, and architectural patterns:

- **Backend Repository Pattern** (`snippets/backend-repository-pattern/`)
  - [`IChoirRepository.ts`](./snippets/backend-repository-pattern/IChoirRepository.ts): Typed interface contract defining database boundaries.
  - [`ChoirRepository.ts`](./snippets/backend-repository-pattern/ChoirRepository.ts): MongoDB native driver encapsulation and atomic aggregations.
  - [`ChoirService.ts`](./snippets/backend-repository-pattern/ChoirService.ts): Business validation, transaction orchestration, and error handling.
- **Routing & Slug Architecture** (`snippets/routing-and-slug-architecture/`)
  - [`slugUtils.ts`](./snippets/routing-and-slug-architecture/slugUtils.ts): Multilingual diacritic normalization, collision-resistant ID-slug resolution, and canonical query parameter formatting.
- **Persistent Client-Side Media Cache** (`snippets/persistent-media-cache/`)
  - [`objectUrlManager.ts`](./snippets/persistent-media-cache/objectUrlManager.ts): Reference-counted browser Object URL lifecycle registry with deferred grace-period revocation preventing memory leaks.
  - [`fileCacheService.ts`](./snippets/persistent-media-cache/fileCacheService.ts): Multi-tier binary caching engine with in-flight deduplication, deterministic version checks, and LRU pruning.
- **React Query & Custom Hooks** (`snippets/react-query-and-hooks/`)
  - [`useChoirWorkspace.ts`](./snippets/react-query-and-hooks/useChoirWorkspace.ts): Workspace state provider and dynamic context switching.
  - [`useOptimisticRepertoire.ts`](./snippets/react-query-and-hooks/useOptimisticRepertoire.ts): TanStack Query cache manipulation and optimistic updates.
- **Auth & Invitation Security Pipeline** (`snippets/auth-and-invitation-pipeline/`)
  - [`authMiddleware.ts`](./snippets/auth-and-invitation-pipeline/authMiddleware.ts): JWT verification, token extraction, and request context injection.
  - [`invitationService.ts`](./snippets/auth-and-invitation-pipeline/invitationService.ts): Cryptographic invitation token generation, entropy verification, and redemption logic.
- **Design System & Scalable Vector Geometry** (`snippets/ui-design-system/`)
  - [`LogoIcon.tsx`](./snippets/ui-design-system/LogoIcon.tsx): Multi-variant React 18 SVG component supporting transparent mark, dark squircle, and light-mode variants with dynamic `useId` gradient isolation.
  - [`logoGeometry.json`](./snippets/ui-design-system/logoGeometry.json): Decoupled SVG path coordinates and stroke definitions serving as the single source of truth for both browser rendering and CLI build scripts.
- **AI Agent Governance Framework** (`.agents/`)
  - [`AGENTS.md`](./AGENTS.md): Master entry point and deterministic Rule Routing Matrix (< 140 lines).
  - [`acs.yaml`](./.agents/acs.yaml): Machine-readable Agent Configuration Schema with trigger paths and upstream provenance.
  - [`sync-from-upstream/SKILL.md`](./.agents/skills/sync-from-upstream/SKILL.md): Autonomous workflow for inspecting upstream `echoir` commits and porting architectural changes.

---

## Technology Stack & Engineering Practices

### Frontend (`client/`)
- **Core Framework**: React 18, TypeScript (Strict Mode), Vite
- **Data Fetching & Cache**: `@tanstack/react-query` (declarative key factories and cache invalidation contracts)
- **Offline Storage & Binary Caching**: IndexedDB (`idb`), native `Blob` storage, and custom reference-counted Object URL lifecycle management
- **Routing**: `react-router-dom` v6 with dynamic hierarchical nested routing
- **Interactivity & UI**: `@dnd-kit/core` & `@dnd-kit/sortable` (drag-and-drop setlists), `framer-motion`
- **Styling & Design System**: Modular SCSS with design tokens (SATB harmonic voice scales, tonal dark mode surfaces, accessible contrast compliance) and decoupled SVG geometry
- **Document & Media Handling**: `pdfjs-dist`, `jspdf`, Web Audio API

### Backend (`server/`)
- **Runtime & Framework**: Node.js, Express.js, TypeScript
- **Architecture**: Strict 4-Tier MVC/Repository pattern (Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Repositories)
- **Database**: MongoDB using the native Node.js driver (`mongodb`) with zero ORM overhead
- **Authentication**: JWT (JSON Web Tokens) with `bcrypt` password hashing and Google OAuth integration
- **Media Pipeline**: `multer`, `fluent-ffmpeg`, `archiver`, cloud storage integration

### DevOps & Quality Assurance
- **Monorepo Orchestration**: `npm` workspaces with concurrent development lifecycle
- **Linting & Formatting**: ESLint (TypeScript strict rules), Prettier
- **Continuous Integration**: GitHub Actions automated linting, type-checking, and build verification pipelines
- **Testing**: Vitest / Jest unit test suites for utilities, services, and repositories

### AI-Augmented Engineering & Agent Governance
- **Agent Orchestration**: Autonomous agent pairing governed via progressive disclosure (`AGENTS.md` $\rightarrow$ `.agents/rules/`)
- **Trigger-Based Guardrails**: Machine-readable glob path routing (`acs.yaml`) activating targeted rules per file scope
- **Quality Gates**: 5-phase operational lifecycle requiring interface inspection before coding, zero compiler suppression (`@ts-ignore`), and pre-push local CI verification
- **Provenance Tracking**: Strict upstream commit hash tracking to synchronize architectural milestones from the private repository

---

## Application Interface & Visual Showcase

High-resolution captures from the live production application running with sample repertoire and ensemble data for *Chór Kameralny Harmonia Vocalis*:

### 1. Dual-Pane Repertoire Browser & Score Preview
> Full-text search, multi-category tag filtering (`SATB`, `Romantyzm`, `Sakralne`), score sheet thumbnail rendering, and draft programme drawer.

<p align="center">
  <img src="./assets/screenshots/01_repertoire_dual_pane.png" alt="Dual-Pane Repertoire Browser" width="100%" />
</p>

### 2. Multi-Track Voice Part Audio Rehearsal Player
> Isolated stem tracks for Soprano, Alto, Tenor, Bass, and Tutti with real-time waveform scrubbing and playback speed controls.

<p align="center">
  <img src="./assets/screenshots/02_voice_parts_player.png" alt="Multi-Track Voice Part Audio Player" width="100%" />
</p>

### 3. Full-Screen Sheet Reader & Performance Mode
> Clean, distraction-free score notation rendering designed for choir folders, rehearsal stands, and performance tablets.

<p align="center">
  <img src="./assets/screenshots/03_sheet_reader_performance.png" alt="Performance Sheet Music Reader" width="100%" />
</p>

### 4. Concert Programme Catalog & Setlist Organization
> Curated performance setlists with numbered song sequencing, estimated timings, and one-click songbook loading.

<p align="center">
  <img src="./assets/screenshots/04_programmes_overview.png" alt="Concert Programmes Overview" width="100%" />
</p>

### 5. Multi-Tenant Choir Workspace & Dashboard
> Ensemble management hub showcasing membership metrics, cryptographic invitation tokens, and member roster.

<p align="center">
  <img src="./assets/screenshots/06_choir_dashboard.png" alt="Choir Workspace Dashboard" width="100%" />
</p>

### 6. Mobile Responsive Shell
> Responsive mobile design with bottom navigation dock, compact repertoire cards, and thumb-accessible quick actions.

<p align="center">
  <img src="./assets/screenshots/09_mobile_responsive_shell.png" alt="Mobile Responsive Shell" width="350px" />
</p>

*(For the complete screenshot inventory and metadata, see the [Screenshot Catalog](./assets/screenshots/README.md).)*

---

## Contact & Author

Created and maintained by **Michał** ([@MichalRedm](https://github.com/MichalRedm)).

- **GitHub**: [@MichalRedm](https://github.com/MichalRedm)
- **Project Role**: Full-Stack Architect & Lead Developer
- **Inquiries**: Feel free to reach out via GitHub issues or profile contact links for technical discussions, architectural deep dives, or employment inquiries.

---

## License

The architectural documentation and code samples in this showcase repository are open-sourced under the [MIT License](./LICENSE).
