---
title: 'Módulo: Application'
description: 'FirelandsApplication — casos de uso, servicios y application ports'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Módulo: `FirelandsApplication` (`src/application`)

La capa **application** implementa **casos de uso** y **ports** que infrastructure satisface. Orquesta objetos de dominio sin conocer MariaDB ni Boost.Asio.

## Biblioteca compilada (`FirelandsApplication`)

| Fuente | Rol |
|--------|-----|
| `RealmListService.cpp` | Filas de reinos + población en vivo vía `IRealmLiveState` |
| `CommandService.cpp` | Comandos `.` de staff y consola world — ver [Comandos GM](/wiki/es/docs/gm-commands/) |
| `OnlineCharacterSessionRegistry.cpp` | Nombre en línea → sesión para targeting desde consola |
| `WorldService.cpp` | Fachada runtime del mundo: mapas, jugadores, criaturas, host Lua, port de colisión |

## Servicios header-only

| Servicio | Rol |
|----------|-----|
| `AuthService` | Búsqueda de cuenta, verificación SRP, session keys |
| `SRPService` | Helpers de verificación SRP-6a |
| `CharacterService` | Lista y persistencia de personajes |
| `PlayerCreateInfoService` | Plantillas de creación de personajes |
| `GmTicketService` | Cola de tickets, asignación, respuestas — [Tickets GM](/wiki/es/docs/gm-tickets/) |
| `WebSessionService` | Seguimiento de sesiones REST |
| `SpellManager` / `CombatService` | Efectos de hechizos y orquestación de combate |

## Application ports (`application/ports/`)

| Port | Implementado por |
|------|------------------|
| `INetworkServer` | `AsyncNetworkServer` |
| `IAuthSession` | `AuthSession` |
| `ICommandService` / `ICommandSession` | `CommandService` / `WorldSession` |
| `IGameScriptHost` | `LuaGameScriptHost` |
| `IMapCollisionQueries` | `MapCollisionQueriesStub` (vmap planificado) |
| `IRealmLiveState` | `RealmLiveRegistry` + realm-link |
| `IWorldRuntime` | `WorldRuntimeAccess` |

`IMapNotifier` vive en `domain/ports/` (usado por `Player`).

## Regla de dependencias

Application depende solo de **domain** + **shared**. Sin headers concretos de MySQL ni ASIO.

## Relacionado

- [Módulo: Infrastructure](/wiki/es/docs/modules-infrastructure/)
- [Gossip y texto NPC](/wiki/es/docs/gossip-npc-text/)
