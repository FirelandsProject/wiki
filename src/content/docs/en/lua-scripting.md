---
title: 'Lua Scripting'
description: 'Gameplay scripting with Lua 5.4'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Lua Scripting

Firelands uses **Lua 5.4** for server-side gameplay scripting. The world server loads scripts at startup via `LuaGameScriptHost` (infrastructure adapter for the `IGameScriptHost` port) and fires lifecycle events such as `world_startup`.

## Configuration

In `worldserver.yaml`:

```yaml
Scripting:
  ScriptsDirectory: "scripts/lua"
```

## Script Layout

```
scripts/lua/
├── bootstrap.lua       # Loaded first — global setup
├── npc_*.lua           # NPC scripts by entry
├── quest_*.lua         # Quest scripts
├── gameobject_*.lua    # GameObject scripts
└── custom/             # Custom scripts
```

## C++ Integration

The `IGameScriptHost` port (`application/ports/IGameScriptHost.h`) defines the contract:

| Method | Purpose |
|--------|---------|
| `Init(scriptsRoot)` | Load all `.lua` files from directory |
| `Shutdown()` | Tear down Lua state |
| `FireEvent(name, contextGuid)` | Call global `OnScriptEvent(eventName, contextGuid)` |
| `FireGossipHello(npcGuid)` | Gossip open hook |
| `FireGossipSelect(npcGuid, menuId, gossipListId)` | Gossip option selected |
| `TryGetGlobalString(name, out)` | Read a global string from Lua |
| `RunChunk(code)` | Execute arbitrary Lua chunk |

`WorldService` holds the script host and fires spawn events (`creature_spawn`, `gameobject_spawn`, etc.).

## Event System

| Event | Description | Context |
|-------|-------------|---------|
| `world_startup` | World server started | None |
| `world_shutdown` | World server stopping | None |
| `creature_spawn` / `gameobject_spawn` | Entity spawned | GUID |
| `on_despawn` | Entity despawned | GUID |
| `gossip_hello` / `on_gossip_hello` | Player talks to NPC | NPC GUID |
| `gossip_select` / `on_gossip_select` | Player selects gossip option | NPC GUID, menu ID, gossip ID |
| `on_enter_combat` | Creature enters combat | Creature GUID |
| `on_death` | Creature/player dies | Target GUID |
| `on_level_up` | Player levels up | Player GUID |

## Gossip (shipped)

When a player talks to a creature, the server tries **Lua first**, then falls back to the world database:

1. `gossip_hello` — script can call `SendGossipMessage` and set `_gossipMenuSent`
2. If no menu was sent, load `creature_template.gossip_menu_id` and send `SMSG_GOSSIP_MESSAGE`
3. `gossip_select` on `CMSG_GOSSIP_SELECT_OPTION` (supports chained menus via `ActionMenuId`)

Quest lines in gossip packets are filtered by **class and race** masks from `quest_template`.

```lua
-- Example shape (API may evolve)
function OnGossipHello(event, player, creature)
    player:SendGossipMessage(menuId, textId, creature)
end

RegisterCreatureGossipEvent(entry, 1, OnGossipHello)
```

The Lua API is still evolving; verify bindings against `LuaGameScriptHost.cpp` in the **firelands-next** repository.

## Player object API

When Lua runs in player context:

| Method | Description |
|--------|-------------|
| `player:GetGUID()` | Player GUID |
| `player:GetName()` | Character name |
| `player:GetLevel()` | Current level |
| `player:AddItem(item_id, count)` | Add item to inventory |
| `player:RemoveItem(item_id, count)` | Remove item |
| `player:AddExperience(amount)` | Grant XP |
| `player:AddMoney(copper)` | Add copper |
| `player:LearnSpell(spell_id)` | Teach spell |
| `player:SendBroadcastMessage(text)` | System message |
| `player:Teleport(map_id, x, y, z)` | Teleport |
| `player:GossipMenuAddItem(icon, text, code, id)` | Add gossip option |
| `player:GossipSendMenu(npc_text, npc_guid)` | Open gossip menu |
| `player:GossipComplete()` | Close gossip |
| `player:HasQuest(quest_id)` | Check quest state |

## NPC object API

| Method | Description |
|--------|-------------|
| `npc:GetEntry()` | NPC template entry |
| `npc:GetGUID()` | World GUID |
| `npc:GetZoneId()` | Current zone |
| `npc:Say(text, language)` | NPC speech |
| `npc:Emote(emote_id)` | Play emote |
| `npc:SpawnCreature(entry, x, y, z, spawntime)` | Spawn creature |

## Example: NPC script

```lua
-- scripts/lua/npc_9001.lua
local Innkeeper = {}

function Innkeeper.OnGossipHello(player, npc)
    player:GossipMenuAddItem(0, "I need a drink", 0, 1)
    player:GossipMenuAddItem(0, "Goodbye", 0, 100)
    if player:HasQuest(12345) then
        player:GossipMenuAddItem(3, "About the shipment...", 0, 10)
    end
    player:GossipSendMenu(1, npc)
end

function Innkeeper.OnGossipSelect(player, npc, menu_id, gossip_id)
    if gossip_id == 1 then
        player:AddItem(11730, 1)
    elseif gossip_id == 10 then
        player:SendBroadcastMessage("Quest updated!")
    end
    player:GossipComplete()
end

return Innkeeper
```

## Best practices

1. Descriptive file names: `npc_9001_boss_karax.lua`
2. Wrap risky code in `pcall`
3. Namespace handlers in tables; avoid polluting globals
4. Test loading first: `tail -f logs/firelands-world.log | grep -i lua`

## Related

- [Gossip & NPC text](/wiki/docs/gossip-npc-text/) — DB fallback after Lua
- [Module: Infrastructure](/wiki/docs/modules-infrastructure/) — `LuaGameScriptHost`
