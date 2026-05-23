---
title: 'Getting Started'
description: 'Introduction to Firelands - WoW Cataclysm Emulator'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---

# <span class="lang-en">Getting Started</span><span class="lang-es">Comenzar</span>

<span class="lang-en">

**Firelands** (`firelands-next`) is a **WoW Cataclysm 4.3.4** private-server emulator (client build **15595**) built with modern software engineering: hexagonal architecture, test-driven development, and C++20 throughout.

Repository: [github.com/FirelandsProject/firelands-next](https://github.com/FirelandsProject/firelands-next)

</span>
<span class="lang-es">

**Firelands** (`firelands-next`) es un emulador de servidor privado **WoW Cataclysm 4.3.4** (build de cliente **15595**) construido con ingeniería moderna: arquitectura hexagonal, desarrollo guiado por pruebas y C++20 en todo el proyecto.

Repositorio: [github.com/FirelandsProject/firelands-next](https://github.com/FirelandsProject/firelands-next)

</span>

## <span class="lang-en">What Firelands Provides</span><span class="lang-es">Qué Ofrece Firelands</span>

<span class="lang-en">

| Feature | Detail |
|---------|--------|
| **Auth server** | SRP-6a authentication, realm list, optional REST login |
| **World server** | Character gameplay, spells, combat, gossip, GM tools |
| **Three databases** | `firelands_auth`, `firelands_characters`, `firelands_world` |
| **Lua scripting** | Server-side customization without recompiling |
| **GM commands** | In-game `.` commands and FTXUI interactive console |
| **DevTools CLI** | Account and realm management from the terminal |

</span>
<span class="lang-es">

| Característica | Detalle |
|----------------|---------|
| **Servidor auth** | Autenticación SRP-6a, lista de reinos, login REST opcional |
| **Servidor world** | Gameplay, hechizos, combate, gossip, herramientas GM |
| **Tres bases de datos** | `firelands_auth`, `firelands_characters`, `firelands_world` |
| **Scripting Lua** | Personalización en servidor sin recompilar |
| **Comandos GM** | Comandos `.` en juego y consola interactiva FTXUI |
| **CLI DevTools** | Gestión de cuentas y reinos desde terminal |

</span>

## <span class="lang-en">Tech Stack</span><span class="lang-es">Tecnologías</span>

<span class="lang-en">

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

</span>
<span class="lang-es">

| | |
|---|---|
| **Lenguaje** | C++20 |
| **Build** | CMake 3.10+ + Ninja (obligatorio) |
| **Red** | Boost.Asio (corrutinas C++20) |
| **Base de datos** | MySQL / MariaDB 8 |
| **Cripto auth** | SRP-6a, OpenSSL |
| **Config** | yaml-cpp (`authserver.yaml`, `worldserver.yaml`) |
| **Logging** | spdlog 1.14.1 |
| **Pruebas** | GoogleTest 1.14.0 + GMock |
| **Scripting** | Lua 5.4.7 |
| **Consola** | FTXUI 5.0.0 |
| **Archivos** | StormLib 9.26 (extractores / vmap) |
| **Despliegue** | Docker Compose + GitHub Actions |

</span>

## <span class="lang-en">Architecture Overview</span><span class="lang-es">Resumen de Arquitectura</span>

<span class="lang-en">

Firelands follows **Hexagonal Architecture** (Ports & Adapters). Dependencies flow inward:

</span>
<span class="lang-es">

Firelands sigue la **Arquitectura Hexagonal** (Ports & Adapters). Las dependencias fluyen hacia adentro:

</span>

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

<span class="lang-en">

See [Architecture](/wiki/docs/architecture/) for full layer definitions, all ports, adapters, and domain entities.

</span>
<span class="lang-es">

Consulta [Arquitectura](/wiki/docs/architecture/) para definiciones completas de capas, ports, adaptadores y entidades de dominio.

</span>

## <span class="lang-en">Servers</span><span class="lang-es">Servidores</span>

<span class="lang-en">

| Server | Binary | Default port | Purpose |
|--------|--------|--------------|---------|
| **Auth** | `build/bin/auth` | 3724 | SRP login, realm list, REST (8081) |
| **World** | `build/bin/world` | 8085 | Gameplay, characters, Lua, GM console |
| **DevTools** | `build/bin/FirelandsDevTools` | — | CLI account/realm tool |

</span>
<span class="lang-es">

| Servidor | Binario | Puerto por defecto | Propósito |
|---------|--------|-------------------|----------|
| **Auth** | `build/bin/auth` | 3724 | Login SRP, lista de reinos, REST (8081) |
| **World** | `build/bin/world` | 8085 | Gameplay, personajes, Lua, consola GM |
| **DevTools** | `build/bin/FirelandsDevTools` | — | CLI de cuentas/reinos |

</span>

## <span class="lang-en">Quick Start</span><span class="lang-es">Inicio Rápido</span>

```bash
git clone https://github.com/FirelandsProject/firelands-next
cd firelands-next
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
ninja -C build auth world
docker-compose up -d db
./build/bin/auth
./build/bin/world
```

<span class="lang-en">

Full setup details: [Developer Setup](/wiki/docs/developer-setup/).

</span>
<span class="lang-es">

Detalles completos: [Configuración de Desarrollador](/wiki/docs/developer-setup/).

</span>

## <span class="lang-en">Documentation</span><span class="lang-es">Documentación</span>

<span class="lang-en">

- [Developer Setup](/wiki/docs/developer-setup/) — Environment, build, configuration
- [Architecture](/wiki/docs/architecture/) — Layers, ports, adapters, domain model
- [Database](/wiki/docs/database/) — Schema, migrations, tables
- [Lua Scripting](/wiki/docs/lua-scripting/) — Gameplay scripting
- [Testing](/wiki/docs/testing/) — TDD and GoogleTest
- [GM Commands](/wiki/docs/gm-commands/) — Staff commands and tickets

</span>
<span class="lang-es">

- [Configuración de Desarrollador](/wiki/docs/developer-setup/) — Entorno, build, configuración
- [Arquitectura](/wiki/docs/architecture/) — Capas, ports, adaptadores, dominio
- [Base de Datos](/wiki/docs/database/) — Esquema, migraciones, tablas
- [Scripting Lua](/wiki/docs/lua-scripting/) — Scripting de gameplay
- [Pruebas](/wiki/docs/testing/) — TDD y GoogleTest
- [Comandos GM](/wiki/docs/gm-commands/) — Comandos de staff y tickets

</span>
