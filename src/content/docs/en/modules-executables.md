---
title: 'Module: Executables'
description: 'auth and world composition roots — startup, wiring, operational flow'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Executables: `auth` and `world`

## `auth` (`src/auth/main.cpp`)

The **authentication server**:

1. Initializes logging; loads **`authserver.yaml`** (`FIRELANDS_AUTH_CONFIG` override)
2. Runs **`DatabaseMigrator`** against `sql/` using the auth JDBC URI
3. Opens MariaDB; constructs **`MySqlAccountRepository`**, **`MySqlRealmRepository`**
4. Builds **`AuthService`**, **`RealmListService`** (optional **`RealmLiveRegistry`** when realm-link is configured)
5. Starts **`AsyncNetworkServer`** for classic auth clients (`AuthSession`)
6. Optionally starts **realm-link** listener for world population metrics
7. Starts **`RestAuthServer`** on `Network.RestPort` with **`WebSessionService`**

Main loop: poll `authServer.Update()` (and realm-link if enabled).

| Setting | Default |
|---------|---------|
| Auth TCP | 3724 |
| REST | 8081 |

## `world` (`src/world/main.cpp`)

The **world server**:

1. Loads **`worldserver.yaml`** (`FIRELANDS_WORLD_CONFIG`) — exits if missing
2. Reconfigures logging (file rotation, levels)
3. Optionally **`RunRealmLinkOutbound`** when `RealmLink.Enabled`
4. Initializes **`LuaGameScriptHost`** → **`WorldService`**; fires `world_startup`
5. Sets **`MapCollisionQueriesStub`** from `Collision.DataRoot`
6. Migrates DB; connects **auth**, **characters**, and **world** databases
7. Wires **`AuthService`**, **`CharacterService`**, **`CommandService`**, **`GmTicketService`**, **`PlayerCreateInfoService`**
8. Starts **`AsyncNetworkServer`** on `Network.Port` (default **8085**)
9. Interactive console via **`WorldInteractiveConsole`** (FTXUI when TTY)

Main loop: `worldServer.Update()`.

## `FirelandsDevTools` (`src/tools/`)

CLI for accounts and realms — see [DevTools](/wiki/docs/devtools/). Separate from in-world `.account` console commands.

## Operational flow

```
Client → auth (SRP-6a, realm list) → world (session crypto, gameplay)
                ↑
         realm-link (optional live population)
```

- Clients authenticate on **auth**, then connect to **world** with session-derived crypto
- **Realm-link** syncs live realm metrics from world to auth when configured
- Staff commands: [GM Commands](/wiki/docs/gm-commands/)

## Configuration

| File | Executable |
|------|------------|
| `authserver.yaml` | `auth` |
| `worldserver.yaml` | `world` |

Key world sections: `Network`, `Database.*`, `Scripting`, `Data.DbcPath`, `Collision.DataRoot`, `Rates`, `Console`, `RealmLink`.

## Related

- [Developer Setup](/wiki/docs/developer-setup/)
- [Module: Infrastructure](/wiki/docs/modules-infrastructure/)
