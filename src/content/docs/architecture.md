---
title: 'Architecture'
description: 'Hexagonal Architecture in Firelands'
pubDate: '2025-01-01'
---

# Hexagonal Architecture

Firelands implements **Hexagonal Architecture** (also known as Ports & Adapters) to keep business logic decoupled from external systems.

## Layer Structure

```
src/
├── shared/           # Common utilities, Logger, Common.h
├── domain/           # Entities, Value Objects, Repository Interfaces (Ports)
├── application/      # Use cases, Application Services
├── infrastructure/   # MySQL adapters, REST adapters, External wrappers (Adapters)
├── auth/            # Auth server executable
├── world/           # World server executable
└── tools/           # DevTools executable
```

## Dependency Rule

- `domain/` must **NOT** import from `application/` or `infrastructure/`
- All external dependencies flow inward: **infrastructure → application → domain**
- Communication via abstract interfaces (ports)

## Domain Layer (`src/domain/`)

Contains:
- **Entities**: Core business objects
- **Value Objects**: Immutable types
- **Repository Interfaces (Ports)**: Abstract interfaces for data access

Example:
- `domain/models/Character.h`
- `domain/models/SpellDefinition.h`
- `domain/models/GmTicket.h`

## Application Layer (`src/application/`)

Contains:
- **Services**: Use cases implementing business logic
- **Ports**: Interfaces defining external system interactions

Example:
- `application/services/AuthService.h`
- `application/services/CharacterService.h`
- `application/services/CommandService.h`

## Infrastructure Layer (`src/infrastructure/`)

Contains:
- **Adapters**: Implementations of ports
- **External wrappers**: Third-party library wrappers

## Executables

| Target | Binary | Purpose |
|--------|--------|---------|
| `auth` | `build/bin/auth` | Authentication server |
| `world` | `build/bin/world` | Game server |

## Precompiled Headers (PCH)

Heavy headers precompiled for faster builds:
- STL containers
- spdlog
- nlohmann/json
- `shared/Common.h`
- `shared/Logger.h`

When adding new targets, include PCH:
```cmake
target_precompile_headers(<target_name> PRIVATE ${PROJECT_PCH_HEADERS})
```

**Important**: spdlog MUST be included via `<shared/Logger.h>` for `SPDLOG_LEVEL_NAMES` to apply.