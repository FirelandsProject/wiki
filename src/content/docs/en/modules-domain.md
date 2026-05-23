---
title: 'Module: Domain'
description: 'FirelandsDomain — entities, world model, repository ports'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Module: `FirelandsDomain` (`src/domain`)

The **domain** layer models core game and account concepts and defines **repository interfaces** (ports). No SQL, no sockets.

## Compiled sources

`src/domain/CMakeLists.txt` builds:

- `models/Realm.cpp` — realm metadata for realm lists and live state
- `world/Map.cpp` — map grid / object indexing
- `world/Creature.cpp`, `world/GameObject.cpp` — world entities

## Header-only areas

| Area | Examples |
|------|----------|
| Models | `Character`, `PlayerCreateInfo`, `GmTicket`, `GossipMenu`, `NpcText`, `SpellDefinition`, `WebSession`, `Chat` |
| World entities | `Player`, `WorldObject`, `Unit`, `Aura` |
| Repository ports | `IAccountRepository`, `ICharacterRepository`, `IGossipRepository`, `INpcTextRepository`, … |
| Domain ports | `IMapNotifier` — callbacks from `Player` to session without domain importing infrastructure |

## Principles

- Express **what** the emulator manipulates, not **how** data is stored or packets are sent
- Pure gameplay rules that need no I/O belong here
- SQL parsing and packet handlers belong in infrastructure or shared network helpers

## Repository ports (summary)

| Port | Purpose |
|------|---------|
| `IAccountRepository` | Accounts, SRP verifiers, session keys |
| `IRealmRepository` | Realm list rows |
| `ICharacterRepository` | Character CRUD |
| `IPlayerCreateInfoRepository` | Starter positions, spells, skills |
| `IGmTicketRepository` | GM help tickets |
| `IGossipRepository` / `INpcTextRepository` / `IQuestGossipRepository` | Gossip data |
| `ICreatureSpawnRepository` | Creature spawns |
| `ISpellDefinitionStore` | Spell metadata |

Implementations live in `infrastructure/persistence/MySql*`.

## Related

- [Database](/wiki/docs/database/) — table mapping
- [Module: Application](/wiki/docs/modules-application/)
