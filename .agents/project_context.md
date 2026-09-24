# Project Context — echoir-showcase

## Master Entry Point
See [AGENTS.md](../AGENTS.md) at the repository root for the high-level rule routing matrix and operational phase gates.

---

## Upstream Repository Provenance & Synchronization Tracking

This showcase repository is a curated architectural proxy for the private production repository **`echoir`**. To ensure future updates, new features, and refactorings can be incrementally and autonomously ported, upstream synchronization history is strictly tracked here:

| Metadata Field | Value | Notes |
| :--- | :--- | :--- |
| **Parent Repository** | `MichalRedm/echoir` | Private production repository |
| **Last Synced Commit Hash** | `ad1285137b57526b2853fec15068a4c06cdf1c0a` | SHA-1 of latest synchronized upstream commit |
| **Commit Timestamp** | `2026-09-24 17:07:59 +0200` | Timestamp of last synchronized upstream commit |
| **Commit Subject** | `Merge pull request #235 from MichalRedm/fix/messenger-seo-og-preview` | Upstream HEAD commit (PR #234 brand identity, PR #235 SEO) |
| **Synchronization Status** | **100% In Parity** | All case studies, brand identity kit, snippets, and routing architectures match upstream |

### Subsystem Mapping Matrix

When upstream changes occur in `echoir`, use this matrix to identify which showcase assets must be updated:

| Upstream Path in `echoir` | Showcase Target in `echoir-showcase` | Showcase Focus |
| :--- | :--- | :--- |
| `server/src/repositories/` | `snippets/backend-repository-pattern/` | Typed Repository interfaces and native MongoDB queries |
| `server/src/services/` | `case-studies/01-strict-4-tier-architecture.md` | Business validation, transaction orchestration, tier isolation |
| `server/src/controllers/invitationController.ts`<br>`server/src/services/invitationService.ts` | `snippets/auth-and-invitation-pipeline/`<br>`case-studies/02-multi-choir-context-invitations.md` | Cryptographic invite tokens, member enrollment, security |
| `client/src/context/ChoirContext/`<br>`client/src/hooks/queries/` | `snippets/react-query-and-hooks/` | Dynamic tenant workspace provider, optimistic repertoire cache |
| `client/src/features/songs/`<br>`client/src/utils/slugUtils.ts` | `snippets/routing-and-slug-architecture/`<br>`case-studies/03-resilient-hierarchical-routing.md` | Dual-paradigm resilient ID-slug routing, workbench state preservation, diacritic handling |
| `client/src/services/cache/`<br>`client/src/hooks/useCached*` | `snippets/persistent-media-cache/`<br>`case-studies/05-persistent-client-side-media-cache.md` | Multi-tier binary IndexedDB cache, Object URL ref counting, LRU eviction |
| `client/public/branding/`<br>`client/src/components/ui/LogoIcon.tsx`<br>`client/src/components/ui/logoGeometry.json` | `assets/brand/`<br>`snippets/ui-design-system/` | Official brand identity ("The Singing Score"), two-tier icon strategy, vector geometry SSOT |
| `client/src/features/**/*.{tsx,scss}` | `assets/screenshots/` | Live UI walkthrough captures generated via Playwright |
| Monorepo root / `.agents/**` | `case-studies/04-agentic-engineering-governance.md` | AI agent governance, progressive disclosure, 5-gate lifecycle |

---

## Current Objective
Provide a compelling, professional architectural portfolio for technical recruiters and engineering managers, highlighting clean architecture, zero-`any` TypeScript, and deep engineering case studies without disclosing proprietary commercial IP.

---

## Repository Status & Readiness Checklist
- [x] Initial showcase repository initialization with MIT license and `.gitignore`.
- [x] Root `README.md` with system overview, architecture diagram, and executive summary.
- [x] Deep architectural specifications (`system_overview.md`, `data_models.md`).
- [x] 5 comprehensive engineering case studies (`01`, `02`, `03`, `04`, `05`) with fully rendered Mermaid diagrams.
- [x] 12 sanitized, production-grade TypeScript code samples across 6 architectural folders (including design system SSOT).
- [x] 9 high-resolution Retina screenshots (8 desktop @ 1920×1080 + 1 mobile @ 390×844) captured with real rehearsal scores.
- [x] Official brand identity kit ("The Singing Score") integrated into `README.md` (adaptive wordmark hero, SATB voice palette, design system section, and `assets/brand/` catalog).
- [x] Embedded visual walkthroughs in root `README.md` and screenshot catalog in `assets/screenshots/README.md`.
- [x] Agent system initialized with tailored `AGENTS.md`, `.agents/acs.yaml`, rules, and upstream sync tracking.
- [x] Repository published as public (`https://github.com/MichalRedm/echoir-showcase`) with live demo homepage and description.
- [x] Synchronized dual-paradigm hybrid ID-slug routing and query parameter canonicalization with upstream (PR #205, PR #206).
- [x] Documented persistent client-side media caching, reference-counted Object URL lifecycles, and LRU eviction (PR #207).

---

## Critical Developer & Agent Guidelines

1. **Strict IP Protection Invariant**:
   - Never copy entire files with proprietary commercial algorithms, secret keys, or internal environment configs into this repository.
   - Code samples must be standalone, sanitized illustrative extracts.
2. **Mermaid Formatting Invariant**:
   - Every node label in Mermaid flowcharts MUST be enclosed in double quotes: `Node["Description"]`.
   - Never use unquoted brackets `[...]` inside labels (e.g. `Invalidate ['user']` will break GitHub rendering).
3. **High-Density TypeScript**:
   - Zero `any` policy. All snippets must feature explicit type annotations, generics, and return types.
4. **Upstream Sync Protocol**:
   - Whenever pulling new changes from `echoir`, check `git log <last-commit>..HEAD` in `echoir`, update the corresponding showcase assets, and update the **Last Synced Commit Hash** in this file.
