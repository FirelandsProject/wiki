---
title: 'Comenzar'
description: 'Introducción a Firelands - Emulador de WoW Cataclysm'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Comenzar

**Firelands** (`firelands-next`) es un emulador de servidor privado **WoW Cataclysm 4.3.4** (build de cliente **15595**) construido con ingeniería moderna: arquitectura hexagonal, desarrollo guiado por pruebas y C++20 en todo el proyecto.

Repositorio: [github.com/FirelandsProject/firelands-next](https://github.com/FirelandsProject/firelands-next)

## Qué Ofrece Firelands

| Característica | Detalle |
|----------------|---------|
| **Servidor auth** | Autenticación SRP-6a, lista de reinos, login REST opcional |
| **Servidor world** | Gameplay, hechizos, combate, gossip, herramientas GM |
| **Tres bases de datos** | `firelands_auth`, `firelands_characters`, `firelands_world` |
| **Scripting Lua** | Personalización en servidor sin recompilar |
| **Comandos GM** | Comandos `.` en juego y consola interactiva FTXUI |
| **CLI DevTools** | Gestión de cuentas y reinos desde terminal |

## Tecnologías

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

## Resumen de Arquitectura

Firelands sigue la **Arquitectura Hexagonal** (Ports & Adapters). Las dependencias fluyen hacia adentro:

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

Consulta [Arquitectura](/wiki/es/docs/architecture/) para definiciones completas de capas, ports, adaptadores y entidades de dominio.

## Servidores

| Servidor | Binario | Puerto por defecto | Propósito |
|---------|--------|-------------------|----------|
| **Auth** | `build/bin/auth` | 3724 | Login SRP, lista de reinos, REST (8081) |
| **World** | `build/bin/world` | 8085 | Gameplay, personajes, Lua, consola GM |
| **DevTools** | `build/bin/FirelandsDevTools` | — | CLI de cuentas/reinos |

## Inicio Rápido
```bash
git clone https://github.com/FirelandsProject/firelands-next
cd firelands-next
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
ninja -C build auth world
docker-compose up -d db
./build/bin/auth
./build/bin/world
```

Detalles completos: [Configuración de Desarrollador](/wiki/es/docs/developer-setup/).

## Documentación

### Guías principales

- [Arquitectura](/wiki/es/docs/architecture/) — Capas, ports, adaptadores, dominio
- [Contribuir](/wiki/es/docs/contributing/) — Flujo de trabajo, estándares, PRs
- [Configuración de Desarrollador](/wiki/es/docs/developer-setup/) — Entorno, build, configuración
- [Base de Datos](/wiki/es/docs/database/) — Esquema, migraciones, tablas
- [Pruebas](/wiki/es/docs/testing/) — TDD y GoogleTest
- [Roadmap del Core](/wiki/es/docs/roadmap/) — Tracker unificado: fases, matriz, extractores, leyenda de estados

### Módulos

- [Shared](/wiki/es/docs/modules-shared/) · [Domain](/wiki/es/docs/modules-domain/) · [Application](/wiki/es/docs/modules-application/) · [Infrastructure](/wiki/es/docs/modules-infrastructure/) · [Ejecutables](/wiki/es/docs/modules-executables/) · [Herramientas y build](/wiki/es/docs/modules-tools-build/)

### Gameplay y staff

- [Scripting Lua](/wiki/es/docs/lua-scripting/) — Scripting de gameplay
- [Gossip y npc_text](/wiki/es/docs/gossip-npc-text/) — Menús, diálogo, líneas de quest
- [Comandos GM](/wiki/es/docs/gm-commands/) — Comandos `.` de staff
- [Tickets GM](/wiki/es/docs/gm-tickets/) — Persistencia y wire format

### Herramientas y datos

- [DevTools](/wiki/es/docs/devtools/) — CLI de cuentas y reinos
- [Extractores](/wiki/es/docs/extractors/) — MPQ, DBC, datos del cliente
- [Pipeline VMap](/wiki/es/docs/vmap-pipeline/) — Colisión y mmap
- [StormLib](/wiki/es/docs/storm-lib/) — Roadmap de extractores MPQ
- [Migración C++20](/wiki/es/docs/cpp20-migration/) — Estado del toolchain
