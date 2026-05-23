---
title: 'Module: Infrastructure'
description: 'FirelandsInfrastructure — MySQL, ASIO, Lua, REST, realm-link'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Module: `FirelandsInfrastructure` (`src/infrastructure`)

**Infrastructure** wires the emulator to the outside world: MariaDB, Boost.Asio TCP, optional REST, realm-link, Lua scripting, and collision stubs.

All socket I/O uses **C++20 coroutines** (`co_await`, `boost::asio::use_awaitable`). Shared helpers: `AsioAwaitables.h`.

## Persistence (`infrastructure/persistence/`)

| Component | Role |
|-----------|------|
| `DatabaseMigrator` | Runs `sql/bundled/` → `sql/init/` → `sql/migrations/`; tracks `schema_migrations` |
| `MySqlAccountRepository` | `IAccountRepository` (auth DB) |
| `MySqlRealmRepository` | `IRealmRepository` |
| `MySqlCharacterRepository` | `ICharacterRepository` |
| `MySqlPlayerCreateInfoRepository` | World DB templates |
| `MySqlGmTicketRepository` | GM tickets |
| `MySqlGossipRepository`, `MySqlNpcTextRepository`, `MySqlQuestGossipRepository` | Gossip ports |
| `MySqlCreatureSpawnRepository` | Creature spawns |
| `MemoryWebSessionRepository` | In-memory REST sessions |
| `InMemoryThreatManager`, `MySqlThreatManager`, `MySqlSpellProcessor` | Combat ports |

## Network (`infrastructure/network/`)

| Component | Role |
|-----------|------|
| `AsyncNetworkServer` | Coroutine accept loop; `Update()` polls `io_context` |
| `AuthSession` | Auth client read/write loops |
| `WorldSession` | World client; handlers under `worldsession/*.cpp` |
| `RestAuthServer` | REST login on `Network.RestPort` |
| `RealmLinkSession` / `RealmLinkOutbound` | Auth ↔ world live metrics |

## Scripting & world adapters

| Component | Role |
|-----------|------|
| `LuaGameScriptHost` | Lua 5.4 under `Scripting.ScriptsDirectory` |
| `SpellEntryDbcStore`, `SpellCastTablesDbc` | Client DBC spell data |
| `MapCollisionQueriesStub` | Placeholder until full vmap integration |

## CMake notes

`FirelandsInfrastructure` links FirelandsApplication, MariaDB C++, Boost thread, Lua, zlib. `LuaGameScriptHost.cpp` skips PCH for toolchain compatibility.

## Related

- [Module: Executables](/wiki/docs/modules-executables/)
- [Lua Scripting](/wiki/docs/lua-scripting/)
- [VMap pipeline](/wiki/docs/vmap-pipeline/)
