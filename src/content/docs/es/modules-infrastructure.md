---
title: 'Módulo: Infrastructure'
description: 'FirelandsInfrastructure — MySQL, ASIO, Lua, REST, realm-link'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Módulo: `FirelandsInfrastructure` (`src/infrastructure`)

**Infrastructure** conecta el emulador con el mundo exterior: MariaDB, TCP Boost.Asio, REST opcional, realm-link, scripting Lua y stubs de colisión.

Todo I/O de sockets usa **coroutines C++20** (`co_await`, `boost::asio::use_awaitable`). Helpers compartidos: `AsioAwaitables.h`.

## Persistencia (`infrastructure/persistence/`)

| Componente | Rol |
|------------|-----|
| `DatabaseMigrator` | Ejecuta `sql/bundled/` → `sql/init/` → `sql/migrations/`; rastrea `schema_migrations` |
| `MySqlAccountRepository` | `IAccountRepository` (auth DB) |
| `MySqlRealmRepository` | `IRealmRepository` |
| `MySqlCharacterRepository` | `ICharacterRepository` |
| `MySqlPlayerCreateInfoRepository` | Plantillas world DB |
| `MySqlGmTicketRepository` | Tickets GM |
| `MySqlGossipRepository`, `MySqlNpcTextRepository`, `MySqlQuestGossipRepository` | Ports de gossip |
| `MySqlCreatureSpawnRepository` | Spawns de criaturas |
| `MemoryWebSessionRepository` | Sesiones REST en memoria |
| `InMemoryThreatManager`, `MySqlThreatManager`, `MySqlSpellProcessor` | Ports de combate |

## Red (`infrastructure/network/`)

| Componente | Rol |
|------------|-----|
| `AsyncNetworkServer` | Bucle accept con coroutines; `Update()` hace poll de `io_context` |
| `AuthSession` | Bucles read/write de clientes auth |
| `WorldSession` | Cliente world; handlers bajo `worldsession/*.cpp` |
| `RestAuthServer` | Login REST en `Network.RestPort` |
| `RealmLinkSession` / `RealmLinkOutbound` | Auth ↔ world métricas en vivo |

## Scripting y adaptadores de mundo

| Componente | Rol |
|------------|-----|
| `LuaGameScriptHost` | Lua 5.4 bajo `Scripting.ScriptsDirectory` |
| `SpellEntryDbcStore`, `SpellCastTablesDbc` | Datos de hechizos DBC del cliente |
| `MapCollisionQueriesStub` | Placeholder hasta integración completa de vmap |

## Notas CMake

`FirelandsInfrastructure` enlaza FirelandsApplication, MariaDB C++, Boost thread, Lua, zlib. `LuaGameScriptHost.cpp` omite PCH por compatibilidad de toolchain.

## Relacionado

- [Módulo: Executables](/wiki/es/docs/modules-executables/)
- [Scripting Lua](/wiki/es/docs/lua-scripting/)
- [Pipeline VMap](/wiki/es/docs/vmap-pipeline/)
