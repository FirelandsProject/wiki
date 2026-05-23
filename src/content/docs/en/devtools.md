---
title: 'DevTools'
description: 'FirelandsDevTools CLI for account and realm management'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Firelands DevTools

`FirelandsDevTools` is a command-line utility for managing the Firelands database. It handles SRP password hashing automatically and is separate from in-world `.account` console commands ([GM Commands](/wiki/docs/gm-commands/)).

## Requirements

- Built binary: `ninja -C build FirelandsDevTools` → `build/bin/FirelandsDevTools`
- Running MySQL/MariaDB (Docker recommended: `docker-compose up -d db`)
- Default credentials: user `firelands` / password `firelands` on `localhost:3306`

## Usage

```bash
./build/bin/FirelandsDevTools <command> [arguments]
```

## Account management

Creates or updates a user in `firelands_auth.account`:

```bash
./FirelandsDevTools account <username> <password> [email] [expansion]
```

| Argument | Description |
|----------|-------------|
| username | Login name |
| password | Plain text (hashed to SRP salt/verifier by the tool) |
| email | Optional; default `<username>@firelands.com` |
| expansion | Optional 0–3; default `3` (Cataclysm) |

Example:

```bash
./FirelandsDevTools account admin admin123 admin@example.com 3
```

## Realm management

Registers or updates a row in `realmlist`:

```bash
./FirelandsDevTools realm <id> <name> <address> <port> [icon] [timezone] [secLevel] [population]
```

If the first argument after `realm` is **not** all digits, it is treated as the **name** and the second as **id**:

```bash
./FirelandsDevTools realm Firelands 1 127.0.0.1 8085
```

| Argument | Description |
|----------|-------------|
| id | Unique realm ID |
| name | Display name in realm list |
| address | World server IP/hostname |
| port | World server port (e.g. 8085) |
| icon | 0=Normal, 1=PvP, 4=RP, 6=RPPvP, 8=Non-standard |
| timezone | 1=Development, 2=US, 3=Oceanic, … |
| secLevel | Minimum access level to join |
| population | Population float indicator |

Example:

```bash
./FirelandsDevTools realm 1 "Firelands Test" 127.0.0.1 8085 1 1 0 0.0
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Connection error | Ensure DB is running; check credentials in `DevTools.cpp` vs your environment |
| Permission denied | Grant write access to `firelands_auth` for the `firelands` user |

## Related

- [Developer Setup](/wiki/docs/developer-setup/)
- [Database](/wiki/docs/database/) — `account` and `realmlist` tables
- [Module: Executables](/wiki/docs/modules-executables/)
