# AGENTS.md - Master Instructions & Context for AI Assistants

Welcome to the **echoir-showcase** repository! This file serves as the primary entry point, high-level context map, and deterministic rule routing matrix for AI coding assistants.

---

## 🏛️ Project Architecture & Overview

**echoir-showcase** is the public architectural showcase and engineering case study repository for **echoir**—a digital songbook and collaborative workspace platform for choirs and vocal ensembles.
- **Repository Purpose**: Acts as a high-fidelity **public architectural proxy** for the private, proprietary `echoir` codebase.
- **Core Assets**: In-depth case studies (`case-studies/`), system and data architecture specifications (`architecture/`), sanitized production TypeScript code samples (`snippets/`), and high-resolution Retina UI captures (`assets/screenshots/`).
- **Upstream Provenance**: Mirrors architectural milestones from the parent repository (`MichalRedm/echoir`). Version tracking and synchronization provenance are recorded in [`.agents/project_context.md`](.agents/project_context.md).

---

## 🚦 Mandatory Rule Routing Matrix

Before writing or modifying any content in this repository, identify your target area and **read the corresponding rule file FIRST**:

| When working on / modifying... | Target Paths / Globs | Mandatory File to Read FIRST | Key Invariants & Pitfalls to Check |
| :--- | :--- | :--- | :--- |
| **Sanitized Code Samples** | `snippets/**/*.{ts,tsx}` | [`.agents/rules/snippet_standards.md`](.agents/rules/snippet_standards.md) | • **Strict IP Sanitization**: Zero secrets, proprietary algorithms, or credentials<br>• Zero-`any` TypeScript policy<br>• Standalone, compilable contracts |
| **Case Studies & Architecture Docs** | `case-studies/**/*.md`<br>`architecture/**/*.md`<br>`README.md` | [`.agents/rules/documentation_standards.md`](.agents/rules/documentation_standards.md) | • **Authentic Senior Engineer Tone**: Zero decorative emoji clutter in headings or lists; no AI marketing buzzwords<br>• **Mermaid Invariant**: All flowchart node labels MUST be double-quoted (`Node["label"]`)<br>• Relative link integrity |
| **Visual Media & Screenshots** | `assets/screenshots/**/*.{png,md}` | [`.agents/rules/documentation_standards.md`](.agents/rules/documentation_standards.md) | • Consistent 1920×1080 (2× DPI) desktop & 390×844 (3× DPI) mobile viewports<br>• Realistic, sanitized rehearsal data |
| **Upstream Sync with `echoir`** | Monorepo root / `.agents/**`<br>`snippets/**`<br>`case-studies/**` | [`.agents/rules/upstream_sync_standards.md`](.agents/rules/upstream_sync_standards.md)<br>[`.agents/skills/sync-from-upstream/SKILL.md`](.agents/skills/sync-from-upstream/SKILL.md) | • Inspect `git log <last-commit>..HEAD` in `echoir`<br>• Sanitize diffs before porting<br>• Update provenance commit hash in `.agents/project_context.md` |
| **Agent Configuration & Self-Maintenance** | `.agents/**` | [`.agents/rules/agent_maintenance_standards.md`](.agents/rules/agent_maintenance_standards.md)<br>[`.agents/skills/agent-maintenance/SKILL.md`](.agents/skills/agent-maintenance/SKILL.md) | • Keep `trigger_paths` in `acs.yaml` updated<br>• Synchronize tracked commit hash upon every upstream sync |

---

## 🔄 Operational Phase Gates

Every task in this repository must progress sequentially through these 5 lifecycle gates:

```
[ Gate 1: Rule & Upstream Intake ] ➔ [ Gate 2: Implementation ] ➔ [ Gate 3: Integrity Verification ] ➔ [ Gate 4: Context Maintenance ] ➔ [ Gate 5: Conventional Commit ]
```

1. **Gate 1: Rule & Upstream Intake (MANDATORY)**:
   - Identify files to be modified. Read the required rule files from the *Rule Routing Matrix* using `view_file`.
   - If synchronizing changes from `echoir`, read the current tracked commit hash from [`.agents/project_context.md`](.agents/project_context.md).
2. **Gate 2: Implementation**:
   - Write sanitized code snippets, case studies, or documentation adhering strictly to `.agents/rules/`.
   - Strictly follow the senior engineer writing style: zero decorative emoji clutter in headings or bullet points, no marketing buzzwords, and plain-spoken technical explanations.
3. **Gate 3: Integrity Verification**:
   - Verify that all relative Markdown links resolve to real files.
   - Ensure all Mermaid diagrams have quoted labels.
   - Verify TypeScript snippets have no syntax errors.
4. **Gate 4: Context Self-Maintenance**:
   - Follow [`.agents/skills/agent-maintenance/SKILL.md`](.agents/skills/agent-maintenance/SKILL.md) and [`.agents/skills/sync-from-upstream/SKILL.md`](.agents/skills/sync-from-upstream/SKILL.md) to update `.agents/project_context.md` if the tracked upstream commit changed.
5. **Gate 5: Conventional Commit**:
   - Stage and commit with atomic Conventional Commits (`feat(showcase): ...`, `fix(docs): ...`, `chore(sync): ...`).

---

## ⚙️ Core CLI Tools & Verification

| Purpose | Working Directory | Command / Action |
| :--- | :--- | :--- |
| **Verify Markdown Link Integrity** | Repository root (`/`) | PowerShell relative link checker script |
| **Verify TypeScript Snippet Syntax** | Repository root (`/`) | `npx tsc --noEmit` (if tsconfig present) |
| **Inspect Upstream Diff from `echoir`** | `../echoir` workspace | `git log <last-tracked-commit>..HEAD --oneline` |
| **Automated Screenshot Capture** | `../echoir` workspace | `playwright-cli run-code --filename=scratch/capture_showcase_screenshots.js` |

---

## 🚨 Operational Boundaries & Escalation

- **Always**:
  - Write documentation in an authentic, senior engineer voice: clean Markdown, direct and concrete language, zero emoji clutter in headings or lists.
  - Sanitize any code ported from `echoir`: remove credentials, internal API keys, production endpoints, and proprietary algorithms.
  - Wrap all Mermaid flowchart node labels in double quotes to prevent GitHub Markdown parser errors.
  - Update the tracked upstream commit hash in `.agents/project_context.md` whenever synchronizing with `echoir`.
- **Never**:
  - Never use decorative emoji prefixes in headings (`# 🎶`) or bullet lists (`- 🎼`).
  - Never use hollow AI marketing buzzwords (*"pioneered"*, *"testament to"*, *"stark dilemma"*, *"holistic"*).
  - Never commit raw un-sanitized source files directly from `echoir`.
  - Never introduce unquoted bracket expressions `[ ... ]` inside Mermaid node identifiers or labels.
  - Never leave placeholder `TODO` or `WIP` tags in public case studies.

---

## 📁 Repository Layout & Navigation Map

- `AGENTS.md`: Master entry point & rule routing matrix (this file)
- `README.md`: Public architectural showcase & visual overview
- `LICENSE`: Open-source MIT license
- `architecture/`: High-level system architecture and data models
  - `system_overview.md`: 4-tier MVC/Repository, security model, sequence diagrams
  - `data_models.md`: MongoDB schema specifications and indexing strategies
- `case-studies/`: In-depth engineering problem-solving deep dives
  - `01-strict-4-tier-architecture.md`: Repository pattern and tier isolation
  - `02-multi-choir-context-invitations.md`: Multi-tenant workspace switching & crypto invites
  - `03-resilient-hierarchical-routing.md`: Self-healing URL slug architecture
  - `04-agentic-engineering-governance.md`: AI-augmented systems engineering & agent governance
- `snippets/`: Sanitized, production-grade TypeScript extracts
- `assets/screenshots/`: High-resolution UI captures and visual catalog
- `.agents/`: Agent configuration, rules, context, and sync skills
  - `acs.yaml`: Agent configuration schema with path triggers & upstream metadata
  - `project_context.md`: Living repository status & **Upstream Provenance Tracking Table**
  - `rules/`: Declarative coding and documentation guardrails
  - `skills/`: Autonomous maintenance & upstream synchronization workflows
