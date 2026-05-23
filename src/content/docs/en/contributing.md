---
title: 'Contributing'
description: 'Development workflow, code standards, and pull request guidelines'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Contributing

This guide describes how to contribute to **firelands-next**, including development workflow, coding standards, and best practices.

## Prerequisites

Before contributing, understand:

1. **Hexagonal architecture** — [Architecture](/wiki/docs/architecture/) and [module guides](/wiki/docs/modules-shared/)
2. **TDD workflow** — [Testing](/wiki/docs/testing/)
3. **Build system** — CMake + Ninja ([Developer Setup](/wiki/docs/developer-setup/))
4. **Language** — All code, comments, and git commits in **English**

## Development workflow

### 1. Finding work

- Check the [Roadmap](/wiki/docs/roadmap/) for planned features
- Look at GitHub issues labeled `good first issue`
- Review documentation gaps in this wiki

### 2. Starting work

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/description-of-bug
```

Branch naming:

| Prefix | Use |
|--------|-----|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `refactor/` | Code refactoring |
| `docs/` | Documentation only |

### 3. Development process

1. **Write tests first** (TDD)
2. Implement the feature
3. Verify tests pass: `ctest --test-dir build`
4. Commit with clear messages
5. Open a pull request

### 4. Commit messages

```
<type>(<scope>): <description>

[optional body]
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`

Examples:

```
feat(auth): add SRP6a password reset flow
fix(world): correct spell damage for area spells
docs(database): document new migration schema
```

## Code standards

### C++ style

| Rule | Convention |
|------|------------|
| Standard | C++20 |
| Variables / functions | `snake_case` |
| Types / classes | `PascalCase` |
| Constants / enums | `UPPER_SNAKE_CASE` |
| File names | `kebab-case` |

### Architecture rules

**Dependency direction:**

```
Infrastructure → Application → Domain → Shared
```

- `domain/` must **not** import from `application/` or `infrastructure/`
- Use **ports** (interfaces) in domain/application; implement **adapters** in infrastructure
- Application depends on domain + shared only — no concrete MySQL or Boost.Asio headers

### Logging

Always include spdlog via `<shared/Logger.h>`:

```cpp
#include <shared/Logger.h>

LOG_INFO("Player {} logged in from {}", player.GetName(), ip_address);
```

### Error handling

- Exceptions for exceptional situations
- `std::optional<T>` when an operation may legitimately find nothing
- Never concatenate SQL strings — use parameterized queries in infrastructure

## SQL standards

- Place migrations in `sql/migrations/` with numeric prefixes (`001_`, `002_`, …)
- Use idempotent operations (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`)
- Never `DROP TABLE` in migrations
- Regenerate bundled SQL after schema changes: `cmake --build build --target merge-migrations`

## Lua standards

- Scripts in `scripts/lua/`
- Descriptive file names: `npc_9001_boss_karax.lua`
- Wrap risky code in `pcall`; namespace handlers in tables
- See [Lua Scripting](/wiki/docs/lua-scripting/)

## Testing standards

- GoogleTest + GMock
- One behavior per test; AAA pattern (Arrange, Act, Assert)
- Mock repository ports when testing application services
- See [Testing](/wiki/docs/testing/)

## Common contribution types

### Adding a feature

1. Domain model (if needed)
2. Repository port + infrastructure adapter
3. Application service
4. Wire handlers (infrastructure)
5. Unit tests
6. Wiki documentation

### Adding a GM command

1. `Permission` in `shared/game/Permissions.h`
2. Register in `CommandService.cpp`
3. Implement on `WorldSession` via `ICommandSession`
4. Document in [GM Commands](/wiki/docs/gm-commands/)

### Adding a database migration

1. `sql/migrations/NNN_description.sql`
2. Update C++ models/repositories if needed
3. Run `merge-migrations` and test on Docker MySQL
4. Update [Database](/wiki/docs/database/)

## Code review

**Reviewers:** focus on logic, architecture, and style; be constructive.

**Authors:** respond to comments; keep PRs focused and reasonably sized.

## Getting help

- This wiki and `docs/` in the **firelands-next** repository
- GitHub issues and discussions
- Reference implementation clone (`firelands-cata-ref/`, build 15595) for packet parity
