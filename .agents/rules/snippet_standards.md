# Code Snippet Standards & IP Sanitization Guidelines

> [!IMPORTANT]
> **Trigger Paths**: `snippets/**`, `snippets/**/*.{ts,tsx}`
> **When to Read**: MUST be read before creating, editing, or updating any sanitized TypeScript code samples in `snippets/`.

## 1. Core Principles & Philosophy

The `snippets/` directory provides hiring managers with direct proof of technical craftsmanship, design patterns, and typing discipline without revealing proprietary intellectual property or credentials.

1. **Strict IP Sanitization**:
   - Strip all internal server URLs, database connection strings, third-party API keys, and business-sensitive logic.
   - Replace sensitive business constants with clean, generic equivalents.
2. **Zero-`any` Policy**:
   - All variables, function parameters, generic type arguments, and return types must be explicitly typed.
   - Use union types, type guards, and discriminated unions instead of loose casting (`as unknown as T`).
3. **Standalone Integrity**:
   - Each snippet file must read cleanly as an educational exemplar.
   - Include clear TSDoc docstrings explaining the architectural rationale behind interfaces and classes.
4. **Clean Top-Level Declarations**:
   - Top-level `function` declarations over arrow function assignments.
   - Explicit `readonly` properties on immutable data objects.

---

## 2. Declarative Snippet Structure (Golden Pattern)

```typescript
/**
 * @fileoverview Sanitized snippet demonstrating the Repository Pattern abstraction
 * over MongoDB native driver collections with strict domain boundary mapping.
 */

import type { Collection, Db, ObjectId } from "mongodb";
import type { IChoirRepository } from "./IChoirRepository";
import type { ChoirDomainEntity } from "../../types/domain";

export class ChoirRepository implements IChoirRepository {
  private readonly collection: Collection<ChoirDBDocument>;

  constructor(db: Db) {
    this.collection = db.collection<ChoirDBDocument>("choirs");
  }

  public async findById(choirId: string): Promise<ChoirDomainEntity | null> {
    const doc = await this.collection.findOne({ choirId });
    return doc ? this.mapToDomain(doc) : null;
  }

  private mapToDomain(raw: ChoirDBDocument): ChoirDomainEntity {
    // Pure mapping logic isolating database schema details from domain consumers
    return {
      choirId: raw.choirId,
      name: raw.name,
      memberCount: raw.users.length,
    };
  }
}
```

---

## 3. Anti-Pattern & Pitfall Traps

| Anti-Pattern Trap | Why It Fails | Golden Pattern |
| :--- | :--- | :--- |
| **Copying Unsanitized Files Directly** | May accidentally leak proprietary business logic, internal infrastructure keys, or session secrets. | Hand-sanitize every sample, extracting only the architectural pattern and interfaces. |
| **Using `any` or `@ts-ignore` in Snippets** | Signals lack of typing discipline to technical interviewers and recruiters. | Write rigorous TypeScript types, interfaces, and generics with zero compiler suppression. |
| **Broken Import Chains** | Pointing imports to missing local files confuses readers who browse the directory. | Keep snippets self-contained, importing standard types or co-located snippet interfaces. |
| **Omitting Architectural Context** | A bare code dump fails to explain *why* an abstraction was chosen. | Include top docstrings explaining the architectural trade-offs and design pattern being shown. |
