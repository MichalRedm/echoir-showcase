# Architecture Diagrams & Visual Schemas

This directory contains standalone visual diagrams and C4 architecture exports illustrating the system topology of **echoir**.

---

## 🗺️ Diagram Catalog

- **System Context & Containers**: High-level overview of the React SPA, Express REST API, MongoDB data store, and cloud media services.
- **4-Tier Data Flow**: Visual sequence mapping the path of a request from HTTP route middleware down to MongoDB native collections.
- **Multi-Tenant Context Pipeline**: React Query cache isolation and dynamic tenant switching.
- **Cryptographic Invitation Lifecycle**: High-entropy token generation, storage, and redemption workflow.

All diagrams are written natively in **Mermaid.js** within the markdown documentation files (see [`/architecture/system_overview.md`](../../architecture/system_overview.md) and [`/architecture/data_models.md`](../../architecture/data_models.md)) for instant rendering directly on GitHub.
