---
title: 'Módulo: Shared'
description: 'FirelandsShared — config, logging, crypto, helpers de red, lector DBC'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Módulo: `FirelandsShared` (`src/shared`)

`FirelandsShared` es la **biblioteca estática** de nivel más bajo usada por todos los demás targets. Contiene utilidades transversales que no deben depender de servicios de juego ni de persistencia.

## Responsabilidades

| Área | Ruta | Propósito |
|------|------|-----------|
| Config | `shared/Config.{h,cpp}` | YAML vía yaml-cpp; overrides de entorno `FIRELANDS_AUTH_CONFIG` / `FIRELANDS_WORLD_CONFIG` |
| Logging | `shared/Logger.h` | Wrapper de spdlog — **siempre** incluir vía este header |
| Networking | `shared/network/` | `ByteBuffer`, `WorldPacket`, opcodes, codecs wire, `WorldCrypt.h` |
| Crypto / SRP | `shared/Crypto.h`, `SRPConstants.h`, `BigInt.h` | Matemática SRP-6a para autenticación |
| DBC | `shared/dbc/DbcReader.cpp` | Lector de tablas binarias estilo `.dbc` del cliente |
| Game helpers | `shared/game/` | Niveles de acceso, permisos, apariencia GM, tablas de experiencia |
| TUI | `shared/tui/` | Helpers FTXUI para consolas interactivas |

## CMake

Definido en `src/shared/CMakeLists.txt`. Enlaza **OpenSSL**, **spdlog**, **nlohmann_json**, **yaml-cpp**.

Las fuentes compiladas hoy incluyen `Config.cpp`, `network/SpellCastWire.cpp`, `dbc/DbcReader.cpp`; muchos headers son header-only.

## Cuándo añadir código aquí

Añade a **shared** solo cuando:

- Varias capas necesitan la misma utilidad
- El código **no** tiene dependencia de MariaDB, sesión Boost.Asio ni agregados de dominio
- Es genuinamente transversal (formato wire, config, logging, crypto)

## Relacionado

- [Arquitectura](/wiki/es/docs/architecture/) — visión general de capas
- [Módulo: Domain](/wiki/es/docs/modules-domain/) — capa superior
