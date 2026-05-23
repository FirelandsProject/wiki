---
title: 'Lua Scripting'
description: 'Gameplay scripting with Lua'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---

# <span class="lang-en">Lua Scripting</span><span class="lang-es">Scripting Lua</span>

<span class="lang-en">

Firelands uses **Lua 5.4** for server-side gameplay scripting. The world server loads scripts at startup via `LuaGameScriptHost` (infrastructure adapter for the `IGameScriptHost` port) and fires lifecycle events such as `world_startup`.

</span>
<span class="lang-es">

Firelands usa **Lua 5.4** para scripting de gameplay en el servidor. El world carga scripts al arrancar con `LuaGameScriptHost` (adaptador infrastructure del port `IGameScriptHost`) y dispara eventos como `world_startup`.

</span>

## <span class="lang-en">Configuration</span><span class="lang-es">Configuración</span>

<span class="lang-en">

In `worldserver.yaml`:

```yaml
Scripting:
  ScriptsDirectory: "scripts/lua"
```

</span>
<span class="lang-es">

En `worldserver.yaml`:

```yaml
Scripting:
  ScriptsDirectory: "scripts/lua"
```

</span>

## <span class="lang-en">Script Layout</span><span class="lang-es">Estructura de Scripts</span>

<span class="lang-en">

```
scripts/lua/
├── bootstrap.lua       # Loaded first — global setup
├── npc_*.lua           # NPC scripts by entry
├── quest_*.lua         # Quest scripts
├── gameobject_*.lua    # GameObject scripts
└── custom/             # Custom scripts
```

</span>
<span class="lang-es">

```
scripts/lua/
├── bootstrap.lua       # Se carga primero — configuración global
├── npc_*.lua           # Scripts NPC por entry
├── quest_*.lua         # Scripts de misiones
├── gameobject_*.lua    # Scripts de GameObject
└── custom/             # Scripts personalizados
```

</span>

## <span class="lang-en">C++ Integration</span><span class="lang-es">Integración C++</span>

<span class="lang-en">

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

</span>
<span class="lang-es">

El port `IGameScriptHost` (`application/ports/IGameScriptHost.h`) define el contrato:

| Método | Propósito |
|--------|-----------|
| `Init(scriptsRoot)` | Cargar todos los `.lua` del directorio |
| `Shutdown()` | Destruir estado Lua |
| `FireEvent(name, contextGuid)` | Llamar `OnScriptEvent(eventName, contextGuid)` global |
| `FireGossipHello(npcGuid)` | Hook de apertura gossip |
| `FireGossipSelect(npcGuid, menuId, gossipListId)` | Opción gossip seleccionada |
| `TryGetGlobalString(name, out)` | Leer string global de Lua |
| `RunChunk(code)` | Ejecutar chunk Lua arbitrario |

`WorldService` mantiene el host y dispara eventos de spawn (`creature_spawn`, `gameobject_spawn`, etc.).

</span>

## <span class="lang-en">Event System</span><span class="lang-es">Sistema de Eventos</span>

<span class="lang-en">

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

</span>
<span class="lang-es">

| Evento | Descripción | Contexto |
|--------|-------------|----------|
| `world_startup` | Servidor world arrancado | Ninguno |
| `world_shutdown` | Servidor world deteniéndose | Ninguno |
| `creature_spawn` / `gameobject_spawn` | Entidad spawneada | GUID |
| `on_despawn` | Entidad despawned | GUID |
| `gossip_hello` / `on_gossip_hello` | Jugador habla con NPC | GUID del NPC |
| `gossip_select` / `on_gossip_select` | Jugador elige opción gossip | GUID, menu ID, gossip ID |
| `on_enter_combat` | Criatura entra en combate | GUID criatura |
| `on_death` | Criatura/jugador muere | GUID objetivo |
| `on_level_up` | Jugador sube de nivel | GUID jugador |

</span>

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

- `OnQuestAccept` — player accepts a quest
- `OnSpellCast` — player casts a spell
- `OnEnterCombat` / `OnDeath` — combat lifecycle
- `OnLogin` / `OnLogout` — session lifecycle

The Lua API is still evolving; verify behavior against `docs/EN/LUA_SCRIPTING.md` in the **firelands-next** repository for the latest bindings.

</span>
<span class="lang-es">

Se planean más hooks a medida que crezca la API del host:

- `OnQuestAccept` — el jugador acepta una misión
- `OnSpellCast` — el jugador lanza un hechizo
- `OnEnterCombat` / `OnDeath` — ciclo de vida de combate
- `OnLogin` / `OnLogout` — ciclo de vida de sesión

La API Lua sigue evolucionando; consulta `docs/EN/LUA_SCRIPTING.md` en el repositorio **firelands-next** para los bindings más recientes.

</span>

## <span class="lang-en">Bootstrap Example</span><span class="lang-es">Ejemplo Bootstrap</span>

```lua
-- scripts/lua/bootstrap.lua
CONFIG = {
    debug_mode = false,
    max_level = 85,
}

function OnScriptEvent(eventName, contextGuid)
    if eventName == "world_startup" then
        print("Firelands world started")
    end
end
```
