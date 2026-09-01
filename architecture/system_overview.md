# System Architecture Overview — echoir

This document outlines the architectural topology, container boundaries, layered backend structure, and end-to-end data pipelines powering **echoir**.

---

## 1. High-Level C4 Container Diagram

```mermaid
C4Container
    title Container Diagram for echoir Platform

    Person(user, "Choir Singer / Conductor", "Uses web browser to view sheets, listen to stems, and organize programmes.")

    System_Boundary(echoir_app, "echoir Platform") {
        Container(spa, "Single-Page Application", "React 18, TypeScript, Vite, SCSS", "Delivers responsive UI, PDF reader, multi-track audio playback, and drag-and-drop programme ordering.")
        Container(api_gateway, "REST API Gateway & Controller Layer", "Node.js, Express, TypeScript", "Handles route dispatching, JWT authentication, multipart streaming, and payload validation.")
        Container(domain_services, "Domain Services Layer", "TypeScript", "Encapsulates business rules, transaction orchestration, permission checks, and audio processing.")
        Container(repo_layer, "Repository Layer", "MongoDB Native Driver", "Abstracts collection queries, atomic aggregations, and data projections.")
    }

    SystemDb(mongo, "Primary Database", "MongoDB", "Stores user identities, choir workspaces, song metadata, annotations, and setlists.")
    System_Ext(cloud_storage, "Cloud Media Engine", "Object Storage / MegaJS", "Stores binary PDF sheet music assets and compressed multi-track MP3/WAV stems.")
    System_Ext(google_auth, "Google Identity Services", "OAuth 2.0 / OpenID Connect", "Third-party single sign-on authentication.")

    Rel(user, spa, "Interacts via HTTPS", "Web Browser")
    Rel(spa, api_gateway, "Consumes REST API", "JSON / JWT Bearer")
    Rel(api_gateway, domain_services, "Invokes domain operations", "In-Process")
    Rel(domain_services, repo_layer, "Calls data access contracts", "In-Process (IChoirRepository, etc.)")
    Rel(repo_layer, mongo, "Executes queries / aggregations", "MongoDB Wire Protocol")
    Rel(domain_services, cloud_storage, "Uploads / Streams media assets", "Encrypted Stream / REST")
    Rel(api_gateway, google_auth, "Verifies OAuth tokens", "HTTPS")
```

---

## 2. 4-Tier Backend Architectural Layering

The backend enforces a strict unidirectional separation of concerns across 4 distinct layers:

```mermaid
graph TD
    subgraph "Tier 1: Routing & Middleware"
        R[Express Router] --> M[Auth & Validation Middleware]
    end

    subgraph "Tier 2: Controllers"
        M --> C[Typed Express Controllers]
    end

    subgraph "Tier 3: Domain Services"
        C --> S[Domain Services]
    end

    subgraph "Tier 4: Repositories"
        S --> RI[Repository Interfaces]
        RI --> RImpl[MongoDB Concrete Repositories]
    end

    subgraph "Persistence"
        RImpl --> DB[(MongoDB Collection)]
    end
```

### Layer Responsibilities & Isolation Rules
1. **Routing & Middleware Tier**:
   - Parses HTTP requests and extracts parameters (`req.params`, `req.query`, `req.body`).
   - Validates session tokens via `authMiddleware` and attaches authenticated user context (`req.userId`, `req.user`).
   - Catches unhandled rejections and maps typed errors (`BadRequestError`, `NotFoundError`, `ForbiddenError`) to HTTP status codes.

2. **Controller Tier**:
   - Strictly responsible for HTTP boundary mapping: unpacking request DTOs and formatting HTTP JSON responses.
   - **Rule**: Controllers *never* execute database queries directly and *never* contain business decision logic.

3. **Domain Service Tier**:
   - Encapsulates domain logic: permission checks, state transitions, unique code generation, audio file transcoding.
   - Orchestrates multi-repository operations and handles transaction rollbacks.
   - **Rule**: Services communicate with data stores exclusively via repository interfaces.

4. **Repository Tier**:
   - Concrete implementations of interface contracts (e.g., `IChoirRepository`, `ISongRepository`).
   - Encapsulates MongoDB native driver collection logic, query operators (`$set`, `$pull`, `$push`, `$facet`), and indexing.
   - **Rule**: Repositories contain *zero* business validation and *zero* HTTP awareness.

---

## 3. End-to-End Data & Media Pipelines

### A. Authentication & Workspace Context Pipeline
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React SPA
    participant Router as Express Router
    participant Auth as Auth Middleware
    participant Service as Choir Service
    participant Repo as Choir Repository
    participant DB as MongoDB

    User->>Client: Select Choir Workspace (e.g. choirId: "c102")
    Client->>Router: GET /api/choirs/c102 (Bearer JWT)
    Router->>Auth: Verify JWT Token
    Auth-->>Router: Attach req.userId
    Router->>Service: getChoirDetails(choirId, userId)
    Service->>Repo: getChoirDB(choirId)
    Repo->>DB: findOne({ choirId })
    DB-->>Repo: Choir Document
    Repo-->>Service: Domain Choir Entity
    Service->>Service: Validate user is member/admin of choir
    Service-->>Router: Populated Choir Data
    Router-->>Client: 200 OK (JSON with workspace & repertoire)
```

### B. Multi-Page Score Upload & Processing Pipeline
```mermaid
sequenceDiagram
    autonumber
    actor Conductor
    participant Client as React SPA
    participant Controller as Song Controller
    participant Service as Song Service
    participant Cloud as Cloud Storage Engine
    participant Repo as Song Repository
    participant DB as MongoDB

    Conductor->>Client: Upload Score (Multi-page PDF / High-Res Images)
    Client->>Client: Concurrency throttle & chunk validation
    Client->>Controller: POST /api/songs/:id/scores (Multipart Stream)
    Controller->>Service: processAndStoreScores(songId, files)
    Service->>Cloud: Stream uploads with transient retry logic
    Cloud-->>Service: Cloud File Handles & URLs
    Service->>Repo: updateSongScoresDB(songId, scoreRecords)
    Repo->>DB: findOneAndUpdate({ songId }, { $push: { scores: ... } })
    DB-->>Repo: Updated Document
    Repo-->>Service: Success
    Service-->>Controller: Domain Song Model
    Controller-->>Client: 201 Created
```

---

## 4. Security Architecture

1. **Token-Based Stateless Auth**: JSON Web Tokens signed with HMAC-SHA256 or asymmetric keys, storing minimal claims (`userId`, `email`).
2. **Workspace Isolation**: Every choir-scoped operation validates that the requesting `userId` is an enrolled member with appropriate permissions (`admin`, `moderator`, `user`).
3. **Cryptographic Invitation Tokens**: Invitation links use cryptographically random high-entropy strings, protected against enumeration and replay attacks.
4. **Input Sanitization & Safe Slugs**: URL slugs are transliterated and stripped of non-alphanumeric characters to prevent injection and routing ambiguities.
