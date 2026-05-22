---
title: 'Getting Started'
description: 'Introduction to Firelands - WoW Cataclysm Emulator'
pubDate: '2025-01-01'
updatedDate: '2026-05-21'
---

# <span class="lang-en">Getting Started</span><span class="lang-es">Comenzar</span>

<span class="lang-en">

Firelands is a **WoW Cataclysm Emulator** (4.3.4) built with modern software engineering practices. It features a clean hexagonal architecture and comprehensive test coverage.

</span>
<span class="lang-es">

Firelands es un **Emulador de WoW Cataclysm** (4.3.4) construido con prácticas modernas de ingeniería de software. Cuenta con una arquitectura hexagonal limpia y cobertura de pruebas completa.

</span>

## <span class="lang-en">Tech Stack</span><span class="lang-es">Tecnologías</span>

<span class="lang-en">

| | |
|---|---|
| **Language** | C++20 |
| **Build** | CMake + Ninja |
| **Networking** | Boost.Asio (C++20 coroutines) |
| **Database** | MySQL 8.0 |
| **Testing** | GoogleTest |
| **Scripting** | Lua 5.4 |
| **Console UI** | FTXUI (FirelandsTui) |

</span>
<span class="lang-es">

| | |
|---|---|
| **Lenguaje** | C++20 |
| **Build** | CMake + Ninja |
| **Red** | Boost.Asio (corrutinas C++20) |
| **Base de datos** | MySQL 8.0 |
| **Pruebas** | GoogleTest |
| **Scripting** | Lua 5.4 |
| **Consola** | FTXUI (FirelandsTui) |

</span>

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

## <span class="lang-en">Documentation</span><span class="lang-es">Documentación</span>

<span class="lang-en">

- [Developer Setup](/wiki/docs/developer-setup/) - Environment and build
- [Architecture](/wiki/docs/architecture/) - Hexagonal architecture
- [Database](/wiki/docs/database/) - Schema and migrations
- [Lua Scripting](/wiki/docs/lua-scripting/) - Gameplay scripting
- [Testing](/wiki/docs/testing/) - Unit tests
- [GM Commands](/wiki/docs/gm-commands/) - GM commands

</span>
<span class="lang-es">

- [Developer Setup](/wiki/docs/developer-setup/) - Entorno y construcción
- [Architecture](/wiki/docs/architecture/) - Arquitectura hexagonal
- [Database](/wiki/docs/database/) - Esquema y migraciones
- [Lua Scripting](/wiki/docs/lua-scripting/) - Scripting de juego
- [Testing](/wiki/docs/testing/) - Pruebas unitarias
- [GM Commands](/wiki/docs/gm-commands/) - Comandos de GM

</span>