# Agent Context Self-Maintenance Standards

> [!IMPORTANT]
> **Trigger Paths**: `.agents/**`
> **When to Read**: MUST be read upon synchronizing upstream changes, modifying case studies, adding code snippets, or refining showcase rules.

To maintain `.agents/` as the single authoritative Source of Truth, all AI assistants must proactively maintain and refine documentation, schema context, and rules.

## Mandatory Maintenance Triggers

| Trigger Event | Action Required | Target File(s) |
| :--- | :--- | :--- |
| **Upstream Sync Completed** | Update the tracked commit hash, date, and commit message. | `.agents/project_context.md`<br>`.agents/acs.yaml` |
| **New Snippet Added** | Document the architectural pattern and update the subsystem map. | `.agents/rules/snippet_standards.md`<br>`.agents/project_context.md` |
| **New Case Study Created** | Add entry to rule routing matrix and update case study directory index. | `AGENTS.md`<br>`README.md` |
| **Screenshots Regenerated** | Update the screenshot inventory table and verify embedded preview paths. | `assets/screenshots/README.md`<br>`README.md` |
| **Rule or Anti-Pattern Discovered** | Add declarative guardrails and anti-pattern table rows. | Relevant rule in `.agents/rules/` |

## Standard Maintenance Procedure

1. Review modified files (`git diff --stat`).
2. Update corresponding `.agents/` files (e.g. `project_context.md` with new upstream commit).
3. Verify that `acs.yaml` trigger paths match any new directory additions.
4. Stage and commit `.agents/` updates alongside showcase changes.
