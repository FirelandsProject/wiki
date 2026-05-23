---
title: 'Scripting Lua'
description: 'Scripting de gameplay con Lua 5.4'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Scripting Lua

Firelands usa **Lua 5.4** para scripting de gameplay en el servidor. El world carga scripts al arrancar con `LuaGameScriptHost` (adaptador infrastructure del port `IGameScriptHost`) y dispara eventos como `world_startup`.

## Configuración

En `worldserver.yaml`:

```yaml
Scripting:
  ScriptsDirectory: "scripts/lua"
```

## Estructura de Scripts

```
scripts/lua/
├── bootstrap.lua       # Se carga primero — configuración global
├── npc_*.lua           # Scripts NPC por entry
├── quest_*.lua         # Scripts de misiones
├── gameobject_*.lua    # Scripts de GameObject
└── custom/             # Scripts personalizados
```

## Integración C++

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

## Sistema de Eventos

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

## Gossip (implementado)

Al hablar con una criatura, el servidor intenta **Lua primero**, luego la base world:

1. `gossip_hello` — el script puede llamar `SendGossipMessage` y marcar `_gossipMenuSent`
2. Si no hay menú, carga `creature_template.gossip_menu_id` y envía `SMSG_GOSSIP_MESSAGE`
3. `gossip_select` en `CMSG_GOSSIP_SELECT_OPTION` (menús encadenados vía `ActionMenuId`)

Las líneas de misiones en gossip se filtran por máscaras de **clase y raza** en `quest_template`.

```lua
-- Example shape (API may evolve)
function OnGossipHello(event, player, creature)
    player:SendGossipMessage(menuId, textId, creature)
end

RegisterCreatureGossipEvent(entry, 1, OnGossipHello)
```

## Hooks Planificados

Se planean más hooks a medida que crezca la API del host:

- `OnQuestAccept` — el jugador acepta una misión
- `OnSpellCast` — el jugador lanza un hechizo
- `OnEnterCombat` / `OnDeath` — ciclo de vida de combate
- `OnLogin` / `OnLogout` — ciclo de vida de sesión

La API Lua sigue evolucionando; consulta `docs/EN/LUA_SCRIPTING.md` en el repositorio **firelands-next** para los bindings más recientes.

## Ejemplo Bootstrap
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
