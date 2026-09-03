---
name: sync-from-upstream
description: Autonomous protocol for checking upstream commits in the private echoir repository, identifying architectural evolutions, porting sanitized snippets or case studies, and advancing the tracked commit provenance hash.
---

# Upstream Sync Skill (echoir -> echoir-showcase)

Use this skill when you need to update **echoir-showcase** to reflect new features, refactorings, or architectural milestones implemented in the private **echoir** repository.

---

## Prerequisites & Context

1. Read the current **Last Synced Commit Hash** from [`.agents/project_context.md`](../../project_context.md).
2. Ensure the local `echoir` workspace is available on the same machine.

---

## Step-by-Step Synchronization Procedure

### Step 1: Query Upstream Diff Log
From the `echoir` repository, inspect commits introduced since the last tracked commit:

```bash
cd <path-to-echoir>
git log <last-synced-commit>..HEAD --oneline
```

Identify whether any of the new commits touched:
- `server/src/repositories/` or database schemas
- `server/src/services/` or domain transaction logic
- Core security, authentication, or invitation pipelines
- Client routing, optimistic caching, or drag-and-drop features
- Visual UI layouts that warrant updated screenshots

### Step 2: Determine Scope of Showcase Changes
Evaluate which showcase assets require updates:
- **New Pattern / Architecture**: Draft a new engineering case study in `case-studies/` or update existing ones.
- **Refactored Contract**: Update corresponding sanitized TypeScript files in `snippets/`.
- **UI / Layout Overhaul**: Run the automated Playwright capture script (`echoir/scratch/capture_showcase_screenshots.js`) to regenerate high-resolution assets in `assets/screenshots/`.

### Step 3: Sanitize & Port Code
For each code sample to be ported:
1. Follow [`.agents/rules/snippet_standards.md`](../../rules/snippet_standards.md).
2. Remove any internal secrets, keys, production URLs, or proprietary algorithms.
3. Ensure strict TypeScript types, explicit return signatures, and zero `any`.
4. Include top architectural docstrings explaining design rationale.

### Step 4: Advance Tracked Commit Provenance
Once code, case studies, or screenshots have been updated:
1. Retrieve the latest upstream commit SHA:
   ```bash
   cd <path-to-echoir>
   git log -1 --format="%H %cd %s"
   ```
2. Update the **Last Synced Commit Hash**, **Commit Timestamp**, and **Commit Subject** in [`.agents/project_context.md`](../../project_context.md).
3. Update `last_synced_commit` and `last_synced_date` in [`.agents/acs.yaml`](../../acs.yaml).

### Step 5: Verification & Conventional Commit
1. Verify relative Markdown link integrity and Mermaid syntax.
2. Commit with Conventional Commits format:
   ```bash
   git add .
   git commit -m "chore(sync): sync architectural showcase with echoir commit <short-hash>"
   git push origin main
   ```
