---
title: 'Getting Started'
description: 'Introduction to Firelands - WoW Cataclysm Emulator'
pubDate: '2025-01-01'
---

# Firelands - WoW Cataclysm Emulator (4.3.4)

Firelands es un emulador de World of Warcraft Cataclysm (build 15595), construido con prácticas modernas de ingeniería de software.

## Tech Stack

- **Language**: C++17
- **Build System**: CMake + Ninja
- **Database**: MySQL 8.0
- **Testing**: GoogleTest (gtest/gmock)
- **Scripting**: Lua 5.4
- **Logging**: spdlog
- **Config**: YAML (yaml-cpp)

## Architecture

Firelands follows **Hexagonal Architecture** (Ports & Adapters):

```
src/
├── shared/           # Common utilities, Logger, Common.h
├── domain/           # Entities, Value Objects, Repository Interfaces (Ports)
├── application/      # Use cases, Application Services
├── infrastructure/   # MySQL adapters, REST adapters, External wrappers (Adapters)
├── auth/             # Authentication server
├── world/            # Game server
└── tools/            # Development tools
```

## Servers

| Server | Binary | Purpose |
|--------|--------|---------|
| **Auth** | `build/bin/auth` | User authentication, sessions, realm list |
| **World** | `build/bin/world` | Gameplay, characters, mobs, spells |

## Documentation

- [Developer Setup](/docs/developer-setup) - Environment setup and build
- [Architecture](/docs/architecture) - Hexagonal architecture
- [Database](/docs/database) - Schema and migrations
- [Lua Scripting](/docs/lua-scripting) - Gameplay scripting
- [Testing](/docs/testing) - Unit tests and TDD
- [GM Commands](/docs/gm-commands) - GM command reference