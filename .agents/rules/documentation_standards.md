# Documentation & Architectural Case Study Standards

> [!IMPORTANT]
> **Trigger Paths**: `case-studies/**/*.md`, `architecture/**/*.md`, `README.md`, `assets/**`
> **When to Read**: MUST be read before drafting or editing case studies, architectural specs, README documents, or embedding visual assets.

## 1. Core Principles

Documentation in `echoir-showcase` serves as a portfolio piece evaluated by senior engineers, architects, and hiring managers. It must exhibit technical rigor, clarity, and visual elegance.

1. **Mermaid Diagram Syntax Invariant**:
   - Every node label in Mermaid flowcharts MUST be enclosed in double quotes: `Node["Description"]`.
   - **Never** place unquoted square brackets `[...]` inside flowchart node shapes (e.g. `Invalidate ['user']` breaks GitHub's parser with `got 'SQS'`).
   - Use standard Mermaid constructs (`flowchart TD`, `sequenceDiagram`, `classDiagram`).
2. **Relative Link Integrity**:
16:    - All links to other files within the repository must use relative Markdown paths: [System Architecture](../../architecture/system_overview.md).
17:    - Never use absolute file system paths (e.g. `d:/...` or `C:/...`).
18: 3. **Structured Case Study Layout**:
19:    - Every case study in `case-studies/` must follow the 4-part structure:
20:      1. **Context & Problem Statement**: The engineering challenge and business impact.
21:      2. **Architectural Design & Diagrams**: Flowcharts, sequence diagrams, and interface definitions.
22:      3. **Key Engineering Decisions**: Non-obvious trade-offs and rationale.
23:      4. **Measurable Outcomes**: Performance numbers, security guarantees, or developer ergonomics.
24: 4. **Visual Media & Screenshots**:
25:    - Embed high-resolution screenshots with centered alignment and width constraints: `<img src="..." width="100%" />`.
26:    - Always provide concise, descriptive caption callouts above or below each media embed.
27: 
28: ---
29: 
30: ## 2. Declarative Mermaid Diagram Standard (Golden Pattern)
31: 
32: ```mermaid
33: flowchart TD
34:     Client["React 18 SPA Client"] -->|"JWT Bearer Auth"| Gateway["Express.js API Gateway"]
35:     Gateway --> Controller["Choir Controller (HTTP DTO Mapping)"]
36:     Controller --> Service["Domain Service (Transaction & Validation)"]
37:     Service --> Repo["Repository (Zero-Leakage MongoDB Abstraction)"]
38:     Repo --> DB[("MongoDB Native Database")]
39: ```
40: 
41: ---
42: 
43: ## 3. Anti-Pattern & Pitfall Traps
44: 
45: | Anti-Pattern Trap | Why It Fails | Golden Pattern |
46: | :--- | :--- | :--- |
47: | **Unquoted Mermaid Brackets** | Labels like `Node[Invalidate ['user']]` trigger GitHub parser syntax crashes (`got 'SQS'`). | Always double-quote labels: `Node["Invalidate 'user' query cache"]`. |
48: | **Hardcoded Absolute OS Paths** | Links like `file:///C:/Users/...` break completely when viewed on GitHub. | Always use relative paths: `[System Overview](../../architecture/system_overview.md)`. |
| **Fluffy, Non-Technical Prose** | Vague descriptions fail to prove technical depth to interviewers. | Detail specific data structures, latency metrics, concurrency guards, and algorithm trade-offs. |
| **Broken Markdown Anchors** | Inconsistent header casing or spaces break anchor links in tables of contents. | Verify GitHub anchor slug rules (`#1-context--problem-statement`). |
