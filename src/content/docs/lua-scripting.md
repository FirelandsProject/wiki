---
title: 'Lua Scripting'
description: 'Gameplay scripting with Lua'
pubDate: '2025-01-01'
updatedDate: '2026-05-21'
---

# <span class="lang-en">Lua Scripting</span><span class="lang-es">Scripting Lua</span>

<span class="lang-en">

Firelands uses **Lua 5.4** for gameplay scripting. The world server loads scripts at startup via `LuaGameScriptHost` and fires lifecycle events (e.g. `world_startup`).

</span>
<span class="lang-es">

Firelands usa **Lua 5.4** para scripting de gameplay. El world carga scripts al arrancar con `LuaGameScriptHost` y dispara eventos de ciclo de vida (p. ej. `world_startup`).

</span>

## <span class="lang-en">Location</span><span class="lang-es">Ubicación</span>

- Scripts: `scripts/lua/`
- Bootstrap: `scripts/lua/bootstrap.lua`

## <span class="lang-en">Gossip (shipped)</span><span class="lang-es">Gossip (implementado)</span>

<span class="lang-en">

When a player talks to a creature, the server tries **Lua first**, then falls back to the world database:

1. `gossip_hello` — script can call `SendGossipMessage` and set `_gossipMenuSent`
2. If no menu was sent, load `creature_template.gossip_menu_id` and send `SMSG_GOSSIP_MESSAGE`
3. `gossip_select` on `CMSG_GOSSIP_SELECT_OPTION` (supports chained menus via `ActionMenuId`)

Quest lines in gossip packets are filtered by **class and race** masks from `quest_template`.

</span>
<span class="lang-es">

Al hablar con una criatura, el servidor intenta **Lua primero**, luego la base world:

1. `gossip_hello` — el script puede llamar `SendGossipMessage` y marcar `_gossipMenuSent`
2. Si no hay menú, carga `creature_template.gossip_menu_id` y envía `SMSG_GOSSIP_MESSAGE`
3. `gossip_select` en `CMSG_GOSSIP_SELECT_OPTION` (menús encadenados vía `ActionMenuId`)

Las líneas de misiones en gossip se filtran por máscaras de **clase y raza** en `quest_template`.

</span>

```lua
-- Example shape (API may evolve)
function OnGossipHello(event, player, creature)
    player:SendGossipMessage(menuId, textId, creature)
end

RegisterCreatureGossipEvent(entry, 1, OnGossipHello)
```

## <span class="lang-en">Planned Hooks</span><span class="lang-es">Hooks Planificados</span>

<span class="lang-en">

Additional hooks are planned as the host API grows:

</span>
<span class="lang-es">

Se planean más hooks a medida que crezca la API del host:

</span>

- `OnQuestAccept` — player accepts a quest
- `OnSpellCast` — player casts a spell
- `OnEnterCombat` / `OnDeath` — combat lifecycle
- `OnLogin` / `OnLogout` — session lifecycle

<span class="lang-en">

The Lua API is still evolving; verify behavior against `docs/EN/LUA_SCRIPTING.md` in the **firelands-next** repository for the latest bindings.

</span>
<span class="lang-es">

La API Lua sigue evolucionando; consulta `docs/EN/LUA_SCRIPTING.md` en el repositorio **firelands-next** para los bindings más recientes.

</span>
