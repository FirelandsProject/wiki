---
title: 'Module: Shared'
description: 'FirelandsShared — config, logging, crypto, networking helpers, DBC reader'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Module: `FirelandsShared` (`src/shared`)

`FirelandsShared` is the lowest-level **static library** used by every other target. It holds cross-cutting utilities that must not depend on game services or persistence.

## Responsibilities

| Area | Path | Purpose |
|------|------|---------|
| Config | `shared/Config.{h,cpp}` | YAML via yaml-cpp; env overrides `FIRELANDS_AUTH_CONFIG` / `FIRELANDS_WORLD_CONFIG` |
| Logging | `shared/Logger.h` | spdlog wrapper — **always** include via this header |
| Networking | `shared/network/` | `ByteBuffer`, `WorldPacket`, opcodes, wire codecs, `WorldCrypt.h` |
| Crypto / SRP | `shared/Crypto.h`, `SRPConstants.h`, `BigInt.h` | SRP-6a math for authentication |
| DBC | `shared/dbc/DbcReader.cpp` | Client `.dbc`-style binary table reader |
| Game helpers | `shared/game/` | Access levels, permissions, GM appearance, experience tables |
| TUI | `shared/tui/` | FTXUI helpers for interactive consoles |

## CMake

Defined in `src/shared/CMakeLists.txt`. Links **OpenSSL**, **spdlog**, **nlohmann_json**, **yaml-cpp**.

Compiled sources today include `Config.cpp`, `network/SpellCastWire.cpp`, `dbc/DbcReader.cpp`; many headers are header-only.

## When to add code here

Add to **shared** only when:

- Multiple layers need the same utility
- The code has **no** MariaDB, Boost.Asio session, or domain aggregate dependency
- It is genuinely cross-cutting (wire format, config, logging, crypto)

## Related

- [Architecture](/wiki/docs/architecture/) — full layer overview
- [Module: Domain](/wiki/docs/modules-domain/) — next layer up
