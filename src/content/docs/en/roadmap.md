---
title: 'Core Roadmap'
description: 'Unified development roadmap for firelands-next — phases, parity matrix, extractors, toolchain, and status tracking'
pubDate: '2025-01-01'
updatedDate: '2026-05-24'
---

# Core development roadmap

**Single source of truth** for all firelands-next core work. This page merges the former split roadmaps (phases, parity matrix, VMap pipeline, StormLib, C++20, MapService plan, SpellManager plan) into one living tracker.

**Client target:** WoW Cataclysm **4.3.4 / build 15595**.

---

## Status legend

Use these symbols everywhere on this page. Update a row when the **next criterion** in that row is met.

| Symbol | Status | Meaning |
|:------:|--------|---------|
| ✅ | **Done** | Shipped, tested or manually validated, docs updated |
| 🔄 | **In progress** | Partial implementation or active branch |
| ⏳ | **Pending** | Scoped and prioritized; not started |
| 📋 | **Planned** | Agreed direction; lower priority or blocked on dependency |
| ⛔ | **Blocked** | Waiting on another milestone |

**Checkbox convention:** `[x]` = done · `[~]` = in progress · `[ ]` = pending

---

## North-star goals

| Priority | Goal | Status |
|:--------:|------|:------:|
| **Obj 0** | Client **stable**: login → world → **≥ 5 min idle** without crashes | ✅ |
| **Obj 1** | Incremental **subsystem parity** vs reference (see matrix below) | 🔄 |
| **Obj 2** | **Lua-first** gameplay scripting (no Smart Scripts SQL) | 🔄 |
| **Obj 3** | Reference-identical **collision data** (vmap/mmap) wired at runtime | 🔄 |

---

## Progress dashboard

Snapshot **2026-05-24**. Counts are manual — refresh when closing milestones.

| Track | Done | In progress | Pending |
|-------|:----:|:-----------:|:-------:|
| Core phases (1–6) | 4 | 2 | 0 |
| Parity subsystems (matrix) | 3 | 12 | 4 |
| Extractor pipeline (Tools 1–4 + runtime) | 6 | 2 | 3 |
| Architecture / ops | 2 | 2 | 4 |
| Toolchain (C++20) | 1 phase | 1 phase | — |

**Current focus (short term):** creature combat + `SMSG_UPDATE_OBJECT` for units → quest accept/complete → auras/effects → mmap generator → runtime collision.

---

## Core phases (high level)

### Phase 1 — Foundations & Auth ✅

| Item | Status |
|------|:------:|
| Project skeleton (CMake / C++20), logging, DB connectors | ✅ |
| SRP-6a auth + successful login | ✅ |

### Phase 2 — Realm system ✅

| Item | Status |
|------|:------:|
| `realmlist` table, `CMD_REALM_LIST` + `SMSG_REALM_LIST` | ✅ |

### Phase 3 — World server skeleton ✅

| Item | Status |
|------|:------:|
| `worldserver` app + YAML config | ✅ |
| `CMSG_AUTH_SESSION` + session validation | ✅ |

### Phase 4 — Character management ✅

| Item | Status |
|------|:------:|
| Characters DB schema | ✅ |
| `CMSG_CHAR_ENUM` / create / delete | ✅ |
| [Player create info](/wiki/docs/playercreateinfo/) — spawn, spells, skills from world DB | ✅ |

### Phase 5 — Entering the world 🔄

Most stability criteria met; polish items remain.

- [x] `CMSG_PLAYER_LOGIN`, login burst SMSG order, spawn `SMSG_UPDATE_OBJECT`
- [x] Movement relay + chat; crash #132 fix (talents/specs)
- [x] Post-login probes: minimal ACKs (mail, calendar, zone, LFG, cemetery, …)
- [x] Two clients same map: cross `CreateObject` on login
- [x] Idle **≥ 5 min** validated; `Network.TimeSyncPeriodMs` configurable
- [ ] Spot-check login burst payload order vs reference
- [ ] Post-login chatter: safe ignore or full handler (no loops / asserts)

### Phase 6 — Gameplay mechanics 🔄

- [x] Parity matrix (this document)
- [x] Lua host MVP + `WorldService` hooks
- [x] Spells — minimal cast (GCD + `SMSG_SPELL_START`/`GO` + failure list)
- [x] Gossip DB menus + `npc_text` + quest lines in gossip UI
- [x] [Zone phasing](/wiki/docs/phase-system/) — `PhaseShift`, area/quest gates, `SMSG_PHASE_SHIFT_CHANGE`
- [x] [GM ticket desk](/wiki/docs/gm-tickets/) — persistence, claim/reply/close, gossip UI
- [~] Creatures — spawn pipeline, unit `SMSG_UPDATE_OBJECT`, combat hooks
- [~] Quest flow — gossip query handlers; accept/complete opcodes + phase refresh on quest events
- [ ] Loot — basic take-item flow
- [ ] Instances + instance scripts (Lua)
- [ ] Real collision (vmap/mmap) — [VMap pipeline](/wiki/docs/vmap-pipeline/)
- [ ] Battlegrounds / arena (after open world stable)

---

## Subsystem parity matrix

Living section — update **Status** and **Next criterion** when milestones close.

| Subsystem | firelands-next | Status | Next criterion |
|-----------|----------------|:------:|----------------|
| Auth / SRP | `AuthSession`, `SRPService` | ✅ | — |
| Realm list | `RealmListService` | ✅ | Packet field parity spot-check |
| Character DB | `MySqlCharacterRepository` | ✅ | Schema parity with ref SQL |
| Player create info | `PlayerCreateInfoService`, migrations 60–62 | ✅ | Regenerate bundles after data edits |
| World socket / crypto | `WorldSession`, `WorldCrypt` | 🔄 | Full header edge cases vs ref |
| Opcodes / packets | `WorldOpcodes.h`, `shared/network/packets/` | 🔄 | Coverage matrix per login + world |
| Player login sequence | `WorldSessionLoginFlow` | 🔄 | Byte-for-byte spot-check critical SMSG |
| Movement | `HandleMovement`, `Map` | 🔄 | Opcode filter + anti-cheat baseline |
| Map / grid | `Map`, `MapService`, `MapRegistry` | 🔄 | Multi-map instance IDs |
| Visibility / broadcast | `BroadcastPacketToNearby` | 🔄 | True visibility range (not just nearby radius) |
| Chat | `HandleMessageChat` | 🔄 | Guild / party / whisper parity |
| Scripting | `LuaGameScriptHost` | 🔄 | Expand C++→Lua surface + sandbox |
| Phasing | `PhaseShift`, `WorldSessionPhasing` | 🔄 | Quest accept/complete triggers phase refresh |
| Creatures / GOs | Domain types + spawn hooks | 🔄 | Full unit update fields + combat engagement |
| Combat / spells | `SpellManager`, `WorldSessionCombat` | 🔄 | Auras + spell costs from DBC; first damage/heal effect |
| Quests / gossip | Gossip + quest lines + partial handlers | 🔄 | Accept/complete opcodes + `PlayerQuestProgressStore` writes |
| Loot | — | ⏳ | Basic take-item flow |
| Collision / path | `IMapCollisionQueries` + stub | 🔄 | Wire `Collision.DataRoot` to real vmap/mmap |
| Instances | — | ⏳ | Instance id on `Map` + reset hooks |
| DBC stores | `SpellEntryDbcStore`, partial catalogs | 🔄 | Critical unit/item templates |
| GM / staff | `CommandService`, tickets, appearance | ✅ | Extend command surface as needed |
| Battlegrounds | — | 📋 | After open world stable |
| Anticheat | — | 📋 | Movement validation baseline |

**Priority order:** creatures/combat → quests → auras/effects → collision data → instances.

---

## Deep tracks

### Quests & gossip

| Milestone | Status | Notes |
|-----------|:------:|-------|
| `SMSG_GOSSIP_MESSAGE` / `SMSG_GOSSIP_COMPLETE` from DB | ✅ | Lua-first + `IGossipRepository` fallback |
| `npc_text` + `CMSG_NPC_TEXT_QUERY` → `SMSG_NPC_TEXT_UPDATE` | ✅ | Migrations 33–34 + ref import |
| Quest lines in gossip menu | ✅ | Shown in gossip UI |
| `CMSG_QUESTGIVER_*` hello / status / query | 🔄 | Handlers in `WorldSessionGossip.cpp` |
| Quest accept / complete / reward | ⏳ | Wire `PlayerQuestProgressStore`; call `RefreshPlayerPhaseVisibilityFromQuestProgress` |
| Quest template data + SQL import | ⏳ | After opcode flow |

See [Gossip & NPC text](/wiki/docs/gossip-npc-text/) and [Phase system](/wiki/docs/phase-system/).

### Combat & spells (`SpellManager`)

Merged from the SpellManager implementation plan.

| Phase | Scope | Status |
|-------|-------|:------:|
| **A** | `SpellManager` skeleton; delegate from `WorldSession`; GCD + START/GO/FAILURE | ✅ |
| **B** | `ISpellDefinitionStore`, `SpellDefinition`, DBC + `spell_dbc` merge at startup | 🔄 |
| **C** | World validation — range (partial), LoS when collision exists | 🔄 |
| **D** | First playable effect — direct damage or heal + update fields | ⏳ |
| **E** | Cooldowns, power cost, aura apply/remove | ⏳ |
| **F** | Effect pipeline extensibility; batching / perf tuning | 📋 |

Performance rules (hot path): O(1) spell lookup, no MySQL per cast, no global mutex on cast, cheap checks before LoS.

### Creatures & world entities

| Milestone | Status |
|-----------|:------:|
| Domain `Creature` / `GameObject` types | ✅ |
| DB spawn bootstrap + phasing on spawn | ✅ |
| `SMSG_UPDATE_OBJECT` for player (CreateObject) | ✅ |
| Unit update fields for creatures (health, flags, level) | 🔄 |
| Combat engagement + threat baseline | 🔄 |
| GO interaction opcodes | ⏳ |

### MapService & world operations

Merged from the MapService isolation plan.

| Milestone | Status | Location |
|-----------|:------:|----------|
| `MapSnapshot` value object | ✅ | `domain/world/MapSnapshot.h` |
| Tick timing on `Map` | ✅ | `Map::RecordTickTime`, `CreateSnapshot` |
| `MapService` wrapper | ✅ | `application/services/MapService` |
| `MapRegistry` replaces raw map map in `WorldService` | ✅ | `application/services/MapRegistry` |
| FTXUI **Map Status** panel | ✅ | `WorldFtxuiConsole` |
| Graceful shutdown — session draining | ⏳ | `AsyncNetworkServer::StopGraceful` |
| Fail-fast config validation at startup | ⏳ | All YAML keys validated before bind |
| Map status via realm-link to auth | 📋 | Optional ops telemetry |

### Network refactor

| Milestone | Status |
|-----------|:------:|
| Split `WorldSession` into `worldsession/*.cpp` | ✅ |
| Typed helpers in `shared/network/packets/` | 🔄 |
| Extract repeated read/write to shared wire types | 🔄 |

---

## Extractors & collision pipeline

Master plan: [VMap pipeline](/wiki/docs/vmap-pipeline/). MPQ milestones: [StormLib roadmap](/wiki/docs/storm-lib/).

```
WoW 4.3.4 Data/  →  Tool 1 (.map)  →  Tool 2 (Buildings/)  →  Tool 3 (vmaps/)  →  Tool 4 (mmaps/)  →  world runtime
```

| # | Component | CMake target | Status | Next step |
|:-:|-----------|--------------|:------:|-----------|
| — | MPQ patch chain | `FirelandsExtractCommon` | ✅ | — |
| — | DBC / DB2 extract | `firelands-dbc-extractor` | ✅ | — |
| — | Raw client maps | `firelands-map-extractor` | ✅ | — |
| 1 | Server `.map` + tilelist + Cameras | `firelands-map-extractor-vmap` | ✅ | Parity hardening vs ref output |
| 2 | VMap4 extract | `firelands-vmap4-extractor` | ✅ | Modular split optional |
| 3 | VMap4 assemble | `firelands-vmap4-assembler` | ✅ | Integration tests |
| 4 | MMAP generate (Recast/Detour) | `firelands-mmap-generator` | ⏳ | Port ref generator |
| — | TUI orchestrates full pipeline | `firelands-extractors` | 🔄 | Drive Tools 1–4 from FTXUI |
| — | Runtime `IMapCollisionQueries` | `world` | 🔄 | Replace stub; load vmap + mmap |

**Closure criteria for collision:** generate dataset with Tools 1–4 → wire `VMapManager2` + Detour in world → integration tests (LoS, height, path spot-checks).

---

## Toolchain — C++20

Detail: [C++20 migration](/wiki/docs/cpp20-migration/).

| Milestone | Status |
|-----------|:------:|
| Phase 1 — `CMAKE_CXX_STANDARD 20`, docs, `SPDLOG_USE_STD_FORMAT` | ✅ |
| `std::span` on `ByteBuffer` | ✅ |
| Boost.Asio C++20 coroutines in `infrastructure/network/` | ✅ |
| Trial builds — full compiler matrix (Linux, Windows) | ⏳ |
| Phase 2 — designated initializers, `using enum` | ⏳ |

---

## Client stability

### Definition of done (short term)

- [x] Enter world without crash
- [x] **≥ 5 min idle** without disconnect
- [x] Periodic `SMSG_TIME_SYNC_REQ` (not chained on every response)
- [ ] Spot-check login burst payload order vs reference
- [ ] Safe handling of all post-login probe opcodes

### Post-login minimal ACK checklist ✅

Mail time, calendar pending, zone update, guild bank withdraw, LFG empty status, cemetery list — all implemented. Battlefield status = intentional no-op when no queue.

### Idle validation (manual)

1. Enter world; stay idle ≥ 5 minutes (no chat/commands)
2. Confirm no client crash and no unexpected server disconnect
3. Optional: `Log.Level: trace`; tune `Network.TimeSyncPeriodMs` in `worldserver.yaml`

---

## Stability changelog

| Date | Note |
|------|------|
| 2026-04-29 | Fix crash #132; post-login probe ACKs |
| 2026-04-30 | Cross CreateObject on login; minimal spell cast |
| 2026-05-03 | `Network.TimeSyncPeriodMs`; idle validation guide |
| 2026-05-05 | Idle ≥ 5 min validation complete |
| 2026-05-18 | Gossip menus shipped; `npc_text` landed |
| 2026-05-23 | Zone phasing, playercreateinfo docs, phase migrations 53–59 |
| 2026-05-24 | Unified core roadmap (this page); MapService + Map Status panel |

---

## How to update this roadmap

1. Close a milestone in code → update the matching row **Status** and check the box.
2. Add a line to **Stability changelog** for user-visible stability wins.
3. Bump `updatedDate` in frontmatter.
4. Deep-dive docs ([phase-system](/wiki/docs/phase-system/), [vmap-pipeline](/wiki/docs/vmap-pipeline/), etc.) keep technical detail; this page stays the **index and tracker**.

When in doubt, prefer ✅ only after tests or manual validation — not merely merged to `main`.

---

## Related documentation

| Topic | Page |
|-------|------|
| Architecture | [Architecture](/wiki/docs/architecture/) |
| Gossip & NPC text | [Gossip & NPC text](/wiki/docs/gossip-npc-text/) |
| Phase system | [Phase system](/wiki/docs/phase-system/) |
| Player create info | [Player create info](/wiki/docs/playercreateinfo/) |
| GM tickets | [GM tickets](/wiki/docs/gm-tickets/) |
| Lua scripting | [Lua scripting](/wiki/docs/lua-scripting/) |
| VMap / mmap pipeline | [VMap pipeline](/wiki/docs/vmap-pipeline/) |
| StormLib / MPQ | [StormLib](/wiki/docs/storm-lib/) |
| C++20 migration | [C++20 migration](/wiki/docs/cpp20-migration/) |
| Contributing | [Contributing](/wiki/docs/contributing/) |

**Legacy copies** in the firelands-next repo (`docs/EN/ROADMAP.md`, `docs/ES/ROADMAP.md`, extractor plans) redirect here — edit **this wiki page** only.
