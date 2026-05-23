---
title: 'Roadmap'
description: 'Phased roadmap, parity matrix, and client stability tracking'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Roadmap & tracking

Single place for progress: phased roadmap, client stability, and parity vs the reference implementation (build **15595**).

## Quick goals

| Priority | Goal |
|----------|------|
| **Obj 0** | Client **stable**: login → world → **≥ 5 min idle** without crashes |
| **Obj 1** | Incremental subsystem parity (see matrix below) |
| **Obj 2** | **Lua** gameplay scripting (no Smart Scripts SQL) |

## Workspace snapshot (2026-05-18)

- **Shipped:** NPC gossip menus from world DB — `SMSG_GOSSIP_MESSAGE` / `SMSG_GOSSIP_COMPLETE`, Lua-first + DB fallback, migrations 31–32 + gossip import. See [Gossip & NPC text](/wiki/docs/gossip-npc-text/).
- **Shipped:** `npc_text` + `SMSG_NPC_TEXT_UPDATE`; quest lines in gossip; GM ticket desk
- **Open:** Full vmap/mmap collision replacing `MapCollisionQueriesStub`; quest accept/complete flow; instances/phases
- **Toolchain:** [C++20 migration](/wiki/docs/cpp20-migration/) — Phase 1 done; Phase 2 feature adoption open

## Phased roadmap

### Phase 1 — Foundations & Auth ✅

- Project skeleton (CMake / C++20), logging, DB connectors
- SRP-6a auth + auth success

### Phase 2 — Realm system ✅

- `realmlist` table, `CMD_REALM_LIST` + `SMSG_REALM_LIST`

### Phase 3 — World server skeleton ✅

- `worldserver` app + YAML, `CMSG_AUTH_SESSION` + session validation

### Phase 4 — Character management ✅

- Characters DB schema, `CMSG_CHAR_ENUM` / create / delete

### Phase 5 — Entering the world 🔄

- [x] `CMSG_PLAYER_LOGIN`, login burst SMSG order, spawn `SMSG_UPDATE_OBJECT`
- [x] Movement relay + chat, crash #132 fix (talents/specs)
- [x] Post-login probes: minimal ACKs (mail, calendar, zone, LFG, cemetery, …)
- [x] Two clients same map: cross CreateObject on login
- [x] Idle **≥ 5 min** validated; `Network.TimeSyncPeriodMs` configurable

### Phase 6 — Gameplay mechanics 🔄

- [x] Lua host MVP + WorldService hooks
- [x] Spells — minimal cast (GCD + `SMSG_SPELL_START`/`GO`)
- [x] Gossip DB menus + `npc_text` + quest lines in gossip
- [ ] Quest accept/complete opcodes
- [ ] Instances + phases (Lua)
- [ ] Real collision (vmap/mmap) — [VMap pipeline](/wiki/docs/vmap-pipeline/)

## Client stability

### Definition of done (short term)

- [x] Enter world without crash
- [x] **≥ 5 min idle** without disconnect
- [x] Periodic `SMSG_TIME_SYNC_REQ` (not chained on every response)
- [ ] Spot-check login burst payload order vs reference

### Idle validation (manual)

1. Enter world; stay idle ≥ 5 minutes (no chat/commands)
2. Confirm no client crash and no unexpected server disconnect
3. Optional: `Log.Level: trace`; tune `Network.TimeSyncPeriodMs` in `worldserver.yaml`

## Parity matrix

Living section — update **Status** when milestones close.

| Subsystem | firelands-next | Status | Next criterion |
|-----------|----------------|--------|----------------|
| Auth / SRP | `AuthSession`, `SRPService` | Done | Client login stable |
| Realm list | `RealmListService` | Done | Packet field parity |
| World socket / crypto | `WorldSession`, `WorldCrypt` | Partial | Header edge cases |
| Opcodes / packets | `WorldOpcodes.h`, handlers | Partial | Coverage per login + world |
| Character DB | `MySqlCharacterRepository` | Done | Schema parity |
| Player login sequence | `HandlePlayerLogin` | Partial | Spot-check critical SMSG |
| Movement | `HandleMovement`, `Map` | Partial | Opcode filter + hooks |
| Map / grid | `Map`, `WorldObject`, `Player` | Partial | Multi-map instances |
| Visibility / broadcast | `BroadcastPacketToNearby` | Partial | True visibility range |
| Chat | `HandleMessageChat` | Partial | Guild/party/whisper |
| Scripting | `LuaGameScriptHost` | Partial | Expand C++→Lua API |
| Creatures / GOs | Domain types + spawn hooks | Started | Unit `SMSG_UPDATE_OBJECT` |
| Combat / spells | `SpellCastWire`, cast handlers | Started | Auras + spell costs from DBC |
| Quests / gossip | Gossip + quest lines | Partial | Accept/complete opcodes |
| Loot | — | Not started | Basic take-item flow |
| Collision | `MapCollisionQueriesStub` | Started | Wire real vmap/mmap |
| Instances / phases | — | Not started | Instance id + reset hooks |
| DBC stores | Partial spell DBC | Started | Critical templates |
| Battlegrounds | — | Not started | After open world stable |

**Short-term priority:** quest accept/complete → combat/auras → collision data → instances.

## Stability changelog

| Date | Note |
|------|------|
| 2026-04-29 | Fix crash #132; post-login probe ACKs |
| 2026-04-30 | Cross CreateObject on login; minimal spell cast |
| 2026-05-03 | `Network.TimeSyncPeriodMs`; idle validation guide |
| 2026-05-05 | Idle ≥ 5 min validation complete |
| 2026-05-18 | Gossip menus shipped; `npc_text` WIP |

## Related

- [Gossip & NPC text](/wiki/docs/gossip-npc-text/)
- [VMap pipeline](/wiki/docs/vmap-pipeline/)
- [C++20 migration](/wiki/docs/cpp20-migration/)
- [Contributing](/wiki/docs/contributing/)
