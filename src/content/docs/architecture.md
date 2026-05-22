---
title: 'Architecture'
description: 'Hexagonal Architecture in Firelands'
pubDate: '2025-01-01'
updatedDate: '2026-05-21'
---

# <span class="lang-en">Hexagonal Architecture</span><span class="lang-es">Arquitectura Hexagonal</span>

<span class="lang-en">

Firelands implements **Hexagonal Architecture** (also known as Ports & Adapters) to keep business logic decoupled from external systems.

</span>
<span class="lang-es">

Firelands implementa la **Arquitectura Hexagonal** (también conocida como Ports & Adapters) para mantener la lógica de negocio desacoplada de los sistemas externos.

</span>

## <span class="lang-en">Layer Structure</span><span class="lang-es">Estructura de Capas</span>

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

<span class="lang-en">

Common utilities / Entities, Value Objects, Repository Interfaces (Ports)

</span>
<span class="lang-es">

Utilidades comunes / Entidades, Objetos de Valor, Interfaces de Repositorio (Ports)

</span>

## <span class="lang-en">Dependency Rule</span><span class="lang-es">Regla de Dependencias</span>

<span class="lang-en">

- `domain/` must **NOT** import from `application/` or `infrastructure/`
- All external dependencies flow inward: **infrastructure → application → domain**
- Communication via abstract interfaces (ports)

</span>
<span class="lang-es">

- `domain/` debe **NO** importar de `application/` o `infrastructure/`
- Todas las dependencias externas fluyen hacia adentro: **infrastructure → application → domain**
- Comunicación a través de interfaces abstractas (ports)

</span>

## <span class="lang-en">Domain Layer (`src/domain/`)</span><span class="lang-es">Capa de Dominio (`src/domain/`)</span>

<span class="lang-en">

Contains:
- **Entities**: Core business objects
- **Value Objects**: Immutable types
- **Repository Interfaces (Ports)**: Abstract interfaces for data access

Example:
- `domain/models/Character.h`
- `domain/models/SpellDefinition.h`
- `domain/models/GmTicket.h`
- `domain/models/GossipMenu.h`
- `domain/models/SpellDefinition.h`

</span>
<span class="lang-es">

Contiene:
- **Entidades**: Objetos de negocio principales
- **Objetos de Valor**: Tipos inmutables
- **Interfaces de Repositorio (Ports)**: Interfaces abstractas para acceso a datos

Ejemplo:
- `domain/models/Character.h`
- `domain/models/SpellDefinition.h`
- `domain/models/GmTicket.h`
- `domain/models/GossipMenu.h`
- `domain/models/SpellDefinition.h`

</span>

## <span class="lang-en">Application Layer (`src/application/`)</span><span class="lang-es">Capa de Aplicación (`src/application/`)</span>

<span class="lang-en">

Contains:
- **Services**: Use cases implementing business logic
- **Ports**: Interfaces defining external system interactions

Example:
- `application/services/AuthService.h`
- `application/services/CharacterService.h`
- `application/services/CommandService.h`

</span>
<span class="lang-es">

Contiene:
- **Servicios**: Casos de uso que implementan lógica de negocio
- **Ports**: Interfaces que definen interacciones con sistemas externos

Ejemplo:
- `application/services/AuthService.h`
- `application/services/CharacterService.h`
- `application/services/CommandService.h`

</span>

## <span class="lang-en">Infrastructure Layer (`src/infrastructure/`)</span><span class="lang-es">Capa de Infraestructura (`src/infrastructure/`)</span>

<span class="lang-en">

Contains:
- **Adapters**: Implementations of ports (MySQL, DBC readers)
- **Network**: `AsyncNetworkServer` with Boost.Asio C++20 coroutines
- **World session**: `WorldSession` split across `worldsession/*.cpp` (login, gossip, spells, GM state, object updates)

</span>
<span class="lang-es">

Contiene:
- **Adapters**: Implementaciones de ports (MySQL, lectores DBC)
- **Red**: `AsyncNetworkServer` con corrutinas Boost.Asio C++20
- **Sesión world**: `WorldSession` repartida en `worldsession/*.cpp` (login, gossip, hechizos, estado GM, object updates)

</span>

## <span class="lang-en">Executables</span><span class="lang-es">Ejecutables</span>

<span class="lang-en">

| Target | Binary | Purpose |
|--------|--------|---------|
| `auth` | `build/bin/auth` | Authentication server |
| `world` | `build/bin/world` | Game server |
| `FirelandsDevTools` | `build/bin/FirelandsDevTools` | CLI for accounts and realms |

</span>
<span class="lang-es">

| Objetivo | Binario | Propósito |
|---------|---------|----------|
| `auth` | `build/bin/auth` | Servidor de autenticación |
| `world` | `build/bin/world` | Servidor de juego |
| `FirelandsDevTools` | `build/bin/FirelandsDevTools` | CLI de cuentas y reinos |

</span>

## <span class="lang-en">Wire format</span><span class="lang-es">Formato de red</span>

<span class="lang-en">

Packet layouts and opcodes target **WoW Cataclysm 4.3.4 (build 15595)**. Shared builders live under `src/shared/network/` (e.g. `SpellCooldownWire`, `KnownSpellsWire`, gossip packets). `ByteBuffer` uses C++20 `std::span` helpers for safe reads and writes.

</span>
<span class="lang-es">

Los paquetes y opcodes apuntan a **WoW Cataclysm 4.3.4 (build 15595)**. Los builders compartidos están en `src/shared/network/` (p. ej. `SpellCooldownWire`, `KnownSpellsWire`, gossip). `ByteBuffer` usa helpers `std::span` de C++20.

</span>

## <span class="lang-en">Precompiled Headers (PCH)</span><span class="lang-es">Encabezados Precompilados (PCH)</span>

<span class="lang-en">

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

</span>
<span class="lang-es">

Encabezados pesados precompilados para construcciones más rápidas:
- Contenedores STL
- spdlog
- nlohmann/json
- `shared/Common.h`
- `shared/Logger.h`

Al agregar nuevos objetivos, incluir PCH:
```cmake
target_precompile_headers(<target_name> PRIVATE ${PROJECT_PCH_HEADERS})
```

**Importante**: spdlog DEBE ser incluido vía `<shared/Logger.h>` para que `SPDLOG_LEVEL_NAMES` aplique.

</span>