---
title: 'Módulo: Domain'
description: 'FirelandsDomain — entidades, modelo de mundo, repository ports'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Módulo: `FirelandsDomain` (`src/domain`)

La capa **domain** modela conceptos centrales de juego y cuentas y define **interfaces de repositorio** (ports). Sin SQL, sin sockets.

## Fuentes compiladas

`src/domain/CMakeLists.txt` compila:

- `models/Realm.cpp` — metadatos de reino para listas de reinos y estado en vivo
- `world/Map.cpp` — grid de mapa / indexación de objetos
- `world/Creature.cpp`, `world/GameObject.cpp` — entidades del mundo

## Áreas header-only

| Área | Ejemplos |
|------|----------|
| Models | `Character`, `PlayerCreateInfo`, `GmTicket`, `GossipMenu`, `NpcText`, `SpellDefinition`, `WebSession`, `Chat` |
| World entities | `Player`, `WorldObject`, `Unit`, `Aura` |
| Repository ports | `IAccountRepository`, `ICharacterRepository`, `IGossipRepository`, `INpcTextRepository`, … |
| Domain ports | `IMapNotifier` — callbacks de `Player` a sesión sin que domain importe infrastructure |

## Principios

- Expresa **qué** manipula el emulador, no **cómo** se almacenan los datos o se envían los paquetes
- Reglas puras de gameplay que no necesitan I/O pertenecen aquí
- El parsing SQL y los packet handlers pertenecen a infrastructure o helpers de red en shared

## Repository ports (resumen)

| Port | Propósito |
|------|-----------|
| `IAccountRepository` | Cuentas, verificadores SRP, session keys |
| `IRealmRepository` | Filas de lista de reinos |
| `ICharacterRepository` | CRUD de personajes |
| `IPlayerCreateInfoRepository` | Posiciones iniciales, hechizos, skills |
| `IGmTicketRepository` | Tickets de ayuda GM |
| `IGossipRepository` / `INpcTextRepository` / `IQuestGossipRepository` | Datos de gossip |
| `ICreatureSpawnRepository` | Spawns de criaturas |
| `ISpellDefinitionStore` | Metadatos de hechizos |

Las implementaciones viven en `infrastructure/persistence/MySql*`.

## Relacionado

- [Base de datos](/wiki/es/docs/database/) — mapeo de tablas
- [Módulo: Application](/wiki/es/docs/modules-application/)
