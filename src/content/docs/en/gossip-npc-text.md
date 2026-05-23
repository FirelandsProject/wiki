---
title: 'Gossip & NPC Text'
description: 'NPC gossip menus, dialog copy, quest lines, and Lua hooks (4.3.4)'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# NPC gossip and `npc_text`

Cataclysm **4.3.4 (build 15595)** gossip: database-driven menus, dialog copy, Lua hooks, and wire packets aligned to WowPacketParser / firelands-cata-ref.

## Shipped — NPC gossip menus

When a player talks to a creature (`CMSG_GOSSIP_HELLO`):

1. **Lua first** — `IGameScriptHost::FireGossipHello` (`gossip_hello`). Scripts can call `SendGossipMessage` and set `_gossipMenuSent`.
2. **Database fallback** — if Lua did not send a menu, load `creature_template.gossip_menu_id`, filter options by `npcflag`, send `SMSG_GOSSIP_MESSAGE`.
3. **Close** — if nothing was sent, `SMSG_GOSSIP_COMPLETE` so the client does not hang.

`CMSG_GOSSIP_SELECT_OPTION` fires `gossip_select` in Lua, then supports **chained menus** via `gossip_menu_option_action.ActionMenuId`.

### Opcodes

| Direction | Opcode | Handler / builder |
|-----------|--------|-------------------|
| C→S | `CMSG_GOSSIP_HELLO` (0x4525) | `WorldSession::HandleGossipHello` |
| C→S | `CMSG_GOSSIP_SELECT_OPTION` (0x0216) | `HandleGossipSelectOption` |
| S→C | `SMSG_GOSSIP_MESSAGE` | `gossip::BuildGossipMessage` — full 64-bit NPC GUID |
| S→C | `SMSG_GOSSIP_COMPLETE` | `gossip::BuildGossipComplete` |

### Code map

| Layer | Path |
|-------|------|
| Model | `domain/models/GossipMenu.h` |
| Port | `domain/repositories/IGossipRepository.h` |
| Logic | `application/logic/GossipLogic.h` |
| MySQL | `infrastructure/persistence/MySqlGossipRepository.*` |
| Packets | `infrastructure/network/sessions/worldsession/GossipPackets.h` |
| Handlers | `worldsession/WorldSessionClientHandlers.cpp` |

### World SQL

| Migration | Purpose |
|-----------|---------|
| `31_world_creature_template_gossip_menu_id.sql` | `creature_template.gossip_menu_id` |
| `32_world_gossip_tables.sql` | DDL: gossip menu tables |
| `35_world_gossip_data.sql` | Data via `python3 tools/sql/import_ref_gossip.py` |

### Tests

- `tests/unit/application/GossipLogicTests.cpp`
- `tests/unit/domain/GossipMenuTests.cpp`
- `tests/unit/infrastructure/GossipPacketTests.cpp`

## Shipped — `npc_text` (dialog copy)

Gossip menus reference a **text id** (`gossip_menu.TextID`). The client expects `SMSG_NPC_TEXT_UPDATE` with eight text slots (probability, two strings, language, three emotes each).

`WorldSession::SendNpcTextForGossipWindow`:

1. Load row via `INpcTextRepository::TryGetById`
2. On miss, use `NpcText::MakeFallback(textId)` (default `Greetings $N`)
3. Send `gossip::BuildNpcTextUpdate(payload)`

After `SMSG_GOSSIP_MESSAGE`, the server **pushes** npc text immediately when `textId != 0` (15595 clients often skip `CMSG_NPC_TEXT_QUERY`).

| Migration | Purpose |
|-----------|---------|
| `33_world_npc_text.sql` | DDL: `npc_text` |
| `34_world_npc_text_data.sql` | Data: `python3 tools/sql/import_ref_npc_text.py` |

## Shipped — Quest lines in gossip

| Migration | Purpose |
|-----------|---------|
| `36_world_quest_gossip_tables.sql` | `quest_template`, `creature_queststarter` |
| `38_world_quest_gossip_data.sql` | `python3 tools/sql/import_ref_quest_gossip.py` |
| `40_world_quest_gossip_allowable_masks.sql` | Class/race mask backfill |

Quest lines filtered by `AllowableClasses` / `AllowableRaces`. Overhead markers (! / ?) via `CMSG_QUESTGIVER_STATUS_QUERY` → `SMSG_QUESTGIVER_STATUS`.

Until per-character quest status exists, matching starters report as **available** (yellow !).

## End-to-end flow

```
Client → CMSG_GOSSIP_HELLO
  → Lua (gossip_hello) OR GossipDB fallback → SMSG_GOSSIP_MESSAGE
  → NpcTextDB → SMSG_NPC_TEXT_UPDATE (when TextID ≠ 0)
Client → CMSG_GOSSIP_SELECT_OPTION → Lua + chained menu OR SMSG_GOSSIP_COMPLETE
```

## Lua integration

Hooks documented in [Lua Scripting](/wiki/docs/lua-scripting/). Scripts run **before** DB fallback on hello; must set gossip-sent flag when calling `GossipSendMenu`.

## GM tooling

`.npc search <fragment>` — styled template matches in system chat for finding test NPCs.

## Not yet implemented

- Quest accept/complete opcodes (`CMSG_QUESTGIVER_ACCEPT_QUEST`, etc.)
- `BroadcastTextID*` columns (stored but unused server-side)

## Related

- [Database](/wiki/docs/database/) — gossip tables
- [GM Commands](/wiki/docs/gm-commands/) — `.npc search`
- [Lua Scripting](/wiki/docs/lua-scripting/)
