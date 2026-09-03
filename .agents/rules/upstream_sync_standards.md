# Upstream Synchronization & Parity Standards

> [!IMPORTANT]
> **Trigger Paths**: `.agents/project_context.md`, `.agents/acs.yaml`, `case-studies/**`, `snippets/**`, `assets/**`
> **When to Read**: MUST be read when synchronizing updates, new features, or architectural evolutions from the private `echoir` repository.

## 1. Upstream Synchronization Principles

The `echoir-showcase` repository represents a curated snapshot of `echoir`. As `echoir` evolves with new features, optimizations, or architectural refactorings, `echoir-showcase` must periodically synchronize without compromising intellectual property.

1. **Deterministic Commit Provenance**:
   - The exact upstream commit hash must always be recorded in `.agents/project_context.md` and `.agents/acs.yaml`.
   - Never update code samples or case studies without advancing the tracked commit hash.
2. **Selective Architectural Porting**:
   - Do **not** port trivial bugfixes, minor CSS adjustments, or proprietary business logic.
   - Focus on high-value architectural milestones:
     - New design patterns (e.g. outbox pattern, state machines).
     - New major subsystem models or collections.
     - Significant UX/frontend flows requiring updated screenshots.
     - Security enhancements (e.g. rate-limiting, token rotation).
3. **Mandatory Sanitization Gateway**:
   - Before any code snippet from `echoir` is saved into `echoir-showcase`:
     1. Remove all environment credentials and secrets.
     2. Ensure zero proprietary IP leakage.
     3. Ensure the snippet adheres to [snippet_standards.md](./snippet_standards.md).
4. **Visual Asset Freshness**:
   - If UI changes alter the visual layout of core pages, execute the Playwright capture script (`scratch/capture_showcase_screenshots.js`) against the running local `echoir` instance to refresh the screenshots.

---

## 2. Synchronization Workflow (Golden Pattern)

```bash
# 1. In echoir workspace: Identify upstream changes since last tracked commit
git log <last-synced-commit>..HEAD --oneline

# 2. Inspect modified files in relevant subsystems
git diff <last-synced-commit>..HEAD --stat server/src/repositories/

# 3. Port & sanitize relevant patterns into echoir-showcase/snippets/ or case-studies/

# 4. In echoir-showcase: Update tracked commit metadata in .agents/project_context.md
```

---

## 3. Anti-Pattern & Pitfall Traps

| Anti-Pattern Trap | Why It Fails | Golden Pattern |
| :--- | :--- | :--- |
| **Silent Commit Drift** | Updating snippets without updating the tracked commit hash makes it impossible to know which version of `echoir` is represented. | Always record the upstream commit SHA-1 in `.agents/project_context.md` upon every sync. |
| **Direct File Copying** | Raw files from `echoir` may contain internal imports, proprietary algorithms, or configuration secrets. | Hand-sanitize and curate every ported code sample into an educational snippet. |
| **Over-Syncing Trivial Changes** | Syncing minor typos or formatting changes clutters the showcase history without adding architectural value. | Only sync meaningful architectural, security, or domain model evolutions. |
| **Desynchronized Screenshots** | Modifying UI code samples while leaving outdated screenshots showing old layouts creates dissonance for reviewers. | Re-run automated Playwright capture when UI components or layouts evolve. |
