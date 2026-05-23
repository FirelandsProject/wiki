---
title: 'Module: Application'
description: 'FirelandsApplication — use cases, services, and application ports'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Module: `FirelandsApplication` (`src/application`)

The **application** layer implements **use cases** and **ports** that infrastructure satisfies. It orchestrates domain objects without knowing MariaDB or Boost.Asio.

## Built library (`FirelandsApplication`)

| Source | Role |
|--------|------|
| `RealmListService.cpp` | Realm rows + live population via `IRealmLiveState` |
| `CommandService.cpp` | Staff `.` commands and world console — see [GM Commands](/wiki/docs/gm-commands/) |
| `OnlineCharacterSessionRegistry.cpp` | Online name → session for console targeting |
| `WorldService.cpp` | Runtime world façade: maps, players, creatures, Lua host, collision port |

## Header-only services

| Service | Role |
|---------|------|
| `AuthService` | Account lookup, SRP verification, session keys |
| `SRPService` | SRP-6a verification helpers |
| `CharacterService` | Character list and persistence |
| `PlayerCreateInfoService` | Character creation templates |
| `GmTicketService` | Ticket queue, assignment, replies — [GM Tickets](/wiki/docs/gm-tickets/) |
| `WebSessionService` | REST session tracking |
| `SpellManager` / `CombatService` | Spell effects and combat orchestration |

## Application ports (`application/ports/`)

| Port | Implemented by |
|------|----------------|
| `INetworkServer` | `AsyncNetworkServer` |
| `IAuthSession` | `AuthSession` |
| `ICommandService` / `ICommandSession` | `CommandService` / `WorldSession` |
| `IGameScriptHost` | `LuaGameScriptHost` |
| `IMapCollisionQueries` | `MapCollisionQueriesStub` (vmap planned) |
| `IRealmLiveState` | `RealmLiveRegistry` + realm-link |
| `IWorldRuntime` | `WorldRuntimeAccess` |

`IMapNotifier` lives in `domain/ports/` (used by `Player`).

## Dependency rule

Application depends on **domain** + **shared** only. No concrete MySQL or ASIO headers.

## Related

- [Module: Infrastructure](/wiki/docs/modules-infrastructure/)
- [Gossip & NPC text](/wiki/docs/gossip-npc-text/)
