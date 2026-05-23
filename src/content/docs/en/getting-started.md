---
title: 'Getting Started'
description: 'Introduction to Firelands - WoW Cataclysm Emulator'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Getting Started

**Firelands** (`firelands-next`) is a **WoW Cataclysm 4.3.4** private-server emulator (client build **15595**) built with modern software engineering: hexagonal architecture, test-driven development, and C++20 throughout.

Repository: [github.com/FirelandsProject/firelands-next](https://github.com/FirelandsProject/firelands-next)

## What Firelands Provides

| Feature | Detail |
|---------|--------|
| **Auth server** | SRP-6a authentication, realm list, optional REST login |
| **World server** | Character gameplay, spells, combat, gossip, GM tools |
| **Three databases** | `firelands_auth`, `firelands_characters`, `firelands_world` |
| **Lua scripting** | Server-side customization without recompiling |
| **GM commands** | In-game `.` commands and FTXUI interactive console |
| **DevTools CLI** | Account and realm management from the terminal |

## Tech Stack

| | |
|---|---|
| **Language** | C++20 |
| **Build** | CMake 3.10+ + Ninja (required) |
| **Networking** | Boost.Asio (C++20 coroutines) |
| **Database** | MySQL / MariaDB 8 |
| **Auth crypto** | SRP-6a, OpenSSL |
| **Config** | yaml-cpp (`authserver.yaml`, `worldserver.yaml`) |
| **Logging** | spdlog 1.14.1 |
| **Testing** | GoogleTest 1.14.0 + GMock |
| **Scripting** | Lua 5.4.7 |
| **Console UI** | FTXUI 5.0.0 |
| **Archives** | StormLib 9.26 (extractors / vmap) |
| **Deploy** | Docker Compose + GitHub Actions |

## Architecture Overview

Firelands follows **Hexagonal Architecture** (Ports & Adapters). Dependencies flow inward:

```
Infrastructure → Application → Domain → Shared
```

```
src/
├── shared/           # Config, logging, crypto, DBC, wire formats
├── domain/           # Entities, world model, repository ports
├── application/      # Use cases, services, application ports
├── infrastructure/   # MySQL, ASIO, Lua, DBC stores
├── auth/             # Auth server executable
├── world/            # Game server executable
└── tools/            # FirelandsDevTools
```

See [Architecture](/wiki/docs/architecture/) for full layer definitions, all ports, adapters, and domain entities.

## Servers

| Server | Binary | Default port | Purpose |
|--------|--------|--------------|---------|
| **Auth** | `build/bin/auth` | 3724 | SRP login, realm list, REST (8081) |
| **World** | `build/bin/world` | 8085 | Gameplay, characters, Lua, GM console |
| **DevTools** | `build/bin/FirelandsDevTools` | — | CLI account/realm tool |

## Quick Start
```bash
git clone https://github.com/FirelandsProject/firelands-next
cd firelands-next
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
ninja -C build auth world
docker-compose up -d db
./build/bin/auth
./build/bin/world
```

Full setup details: [Developer Setup](/wiki/docs/developer-setup/).

## Documentation

### Core guides

- [Architecture](/wiki/docs/architecture/) — Layers, ports, adapters, domain model
- [Contributing](/wiki/docs/contributing/) — Workflow, code standards, PR process
- [Developer Setup](/wiki/docs/developer-setup/) — Environment, build, configuration
- [Database](/wiki/docs/database/) — Schema, migrations, tables
- [Testing](/wiki/docs/testing/) — TDD and GoogleTest
- [Roadmap](/wiki/docs/roadmap/) — Phases, parity matrix, client stability

### Module deep-dives

- [Shared](/wiki/docs/modules-shared/) · [Domain](/wiki/docs/modules-domain/) · [Application](/wiki/docs/modules-application/) · [Infrastructure](/wiki/docs/modules-infrastructure/) · [Executables](/wiki/docs/modules-executables/) · [Tools & build](/wiki/docs/modules-tools-build/)

### Gameplay & staff

- [Lua Scripting](/wiki/docs/lua-scripting/) — Gameplay scripting
- [Gossip & NPC text](/wiki/docs/gossip-npc-text/) — Menus, dialog, quest lines
- [GM Commands](/wiki/docs/gm-commands/) — Staff `.` commands reference
- [GM Tickets](/wiki/docs/gm-tickets/) — Help desk persistence and wire format

### Tooling & data pipeline

- [DevTools](/wiki/docs/devtools/) — CLI account and realm management
- [Extractors](/wiki/docs/extractors/) — MPQ, DBC, and client data extraction
- [VMap pipeline](/wiki/docs/vmap-pipeline/) — Collision and mmap extraction plan
- [StormLib](/wiki/docs/storm-lib/) — MPQ extractor roadmap
- [C++20 migration](/wiki/docs/cpp20-migration/) — Toolchain upgrade status
