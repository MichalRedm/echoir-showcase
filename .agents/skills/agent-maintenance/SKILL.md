---
name: agent-maintenance
description: Maintain and update the .agents/ directory structure in echoir-showcase to reflect the current state of documentation, code samples, and upstream parity.
---

# Agent Showcase Maintenance Skill

Use this skill when completing an upstream synchronization, adding new code samples, updating architectural case studies, or refining repository documentation.

---

## Maintenance Checklist

1. **Upstream Commit Hash**:
   - Verify that `.agents/project_context.md` and `.agents/acs.yaml` record the latest commit from `echoir`.
2. **Subsystem Mapping**:
   - Check if any new snippet folders or case studies were created. Update the mapping matrix in `project_context.md`.
3. **Trigger Paths**:
   - Verify that any new file types or directory paths are covered in `.agents/acs.yaml` trigger paths and `AGENTS.md` Rule Routing Matrix.
4. **Mermaid & Link Integrity**:
   - Ensure all Mermaid diagrams have double-quoted labels (`Node["label"]`).
   - Check that all relative links resolve to valid target files.
5. **Commit Updates**:
   - Stage and commit `.agents/` updates alongside showcase changes.
