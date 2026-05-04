---
title: 'Getting Started / Comenzar'
description: 'Introduction to Firelands - WoW Cataclysm Emulator'
pubDate: '2025-01-01'
---

# Getting Started<span class="lang-es"> / Comenzar</span>

<span class="lang-en">

Firelands is a **WoW Cataclysm Emulator** (4.3.4) built with modern software engineering practices. It features a clean hexagonal architecture and comprehensive test coverage.

</span>
<span class="lang-es">

Firelands es un **Emulador de WoW Cataclysm** (4.3.4) construido con prácticas modernas de ingeniería de software. Cuenta con una arquitectura hexagonal limpia y cobertura de pruebas completa.

</span>

## Tech Stack

| | |
|---|---|
| **Language** | C++17 |
| **Build** | CMake + Ninja |
| **Database** | MySQL 8.0 |
| **Testing** | GoogleTest |
| **Scripting** | Lua 5.4 |

<span class="lang-en">

### Architecture

Firelands follows **Hexagonal Architecture** (Ports & Adapters):

</span>
<span class="lang-es">

### Arquitectura

Firelands sigue la **Arquitectura Hexagonal** (Ports & Adapters):

</span>

```
src/
├── shared/           # Common utilities
├── domain/           # Entities, Ports
├── application/      # Use cases
├── infrastructure/   # Adapters
├── auth/             # Auth server
├── world/            # Game server
└── tools/            # DevTools
```

<span class="lang-en">

### Servers

| Server | Binary | Purpose |
|--------|--------|---------|
| **Auth** | `build/bin/auth` | Authentication, sessions |
| **World** | `build/bin/world` | Gameplay, characters |

</span>
<span class="lang-es">

### Servidores

| Servidor | Binario | Propósito |
|---------|--------|----------|
| **Auth** | `build/bin/auth` | Autenticación, sesiones |
| **World** | `build/bin/world` | Juego, personajes |

</span>

## Documentation

- [Developer Setup](/wiki/docs/developer-setup/) - Environment and build
- [Architecture](/wiki/docs/architecture/) - Hexagonal architecture
- [Database](/wiki/docs/database/) - Schema and migrations
- [Lua Scripting](/wiki/docs/lua-scripting/) - Gameplay scripting
- [Testing](/wiki/docs/testing/) - Unit tests
- [GM Commands](/wiki/docs/gm-commands/) - GM commands