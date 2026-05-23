---
title: 'Gossip y Texto NPC'
description: 'Menús gossip NPC, textos de diálogo, líneas de misiones y hooks Lua (4.3.4)'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Gossip NPC y `npc_text`

Gossip de Cataclysm **4.3.4 (build 15595)**: menús desde base de datos, textos de diálogo, hooks Lua y paquetes wire alineados con WowPacketParser **V4_3_4_15595**.

## Entregado — Menús gossip NPC

Cuando un jugador habla con una criatura (`CMSG_GOSSIP_HELLO`):

1. **Lua primero** — `IGameScriptHost::FireGossipHello` (`gossip_hello`). Los scripts pueden llamar `SendGossipMessage` y establecer `_gossipMenuSent`.
2. **Fallback de base de datos** — si Lua no envió menú, carga `creature_template.gossip_menu_id`, filtra opciones por `npcflag`, envía `SMSG_GOSSIP_MESSAGE`.
3. **Cierre** — si no se envió nada, `SMSG_GOSSIP_COMPLETE` para que el cliente no se cuelgue.

`CMSG_GOSSIP_SELECT_OPTION` dispara `gossip_select` en Lua, luego soporta **menús encadenados** vía `gossip_menu_option_action.ActionMenuId`.

### Opcodes

| Dirección | Opcode | Handler / builder |
|-----------|--------|-------------------|
| C→S | `CMSG_GOSSIP_HELLO` (0x4525) | `WorldSession::HandleGossipHello` |
| C→S | `CMSG_GOSSIP_SELECT_OPTION` (0x0216) | `HandleGossipSelectOption` |
| S→C | `SMSG_GOSSIP_MESSAGE` | `gossip::BuildGossipMessage` — GUID NPC completo de 64 bits |
| S→C | `SMSG_GOSSIP_COMPLETE` | `gossip::BuildGossipComplete` |

### Mapa de código

| Capa | Ruta |
|------|------|
| Model | `domain/models/GossipMenu.h` |
| Port | `domain/repositories/IGossipRepository.h` |
| Logic | `application/logic/GossipLogic.h` |
| MySQL | `infrastructure/persistence/MySqlGossipRepository.*` |
| Packets | `infrastructure/network/sessions/worldsession/GossipPackets.h` |
| Handlers | `worldsession/WorldSessionClientHandlers.cpp` |

### SQL world

| Migración | Propósito |
|-----------|-----------|
| `31_world_creature_template_gossip_menu_id.sql` | `creature_template.gossip_menu_id` |
| `32_world_gossip_tables.sql` | DDL: tablas gossip |
| `35_world_gossip_data.sql` | Datos vía `python3 tools/sql/import_ref_gossip.py` |

### Pruebas

- `tests/unit/application/GossipLogicTests.cpp`
- `tests/unit/domain/GossipMenuTests.cpp`
- `tests/unit/infrastructure/GossipPacketTests.cpp`

## Entregado — `npc_text` (textos de diálogo)

Los menús gossip referencian un **text id** (`gossip_menu.TextID`). El cliente espera `SMSG_NPC_TEXT_UPDATE` con ocho slots de texto (probabilidad, dos cadenas, idioma, tres emotes cada uno).

`WorldSession::SendNpcTextForGossipWindow`:

1. Carga fila vía `INpcTextRepository::TryGetById`
2. Si falta, usa `NpcText::MakeFallback(textId)` (por defecto `Greetings $N`)
3. Envía `gossip::BuildNpcTextUpdate(payload)`

Tras `SMSG_GOSSIP_MESSAGE`, el servidor **empuja** npc text inmediatamente cuando `textId != 0` (clientes 15595 a menudo omiten `CMSG_NPC_TEXT_QUERY`).

| Migración | Propósito |
|-----------|-----------|
| `33_world_npc_text.sql` | DDL: `npc_text` |
| `34_world_npc_text_data.sql` | Datos: `python3 tools/sql/import_ref_npc_text.py` |

## Entregado — Líneas de misiones en gossip

| Migración | Propósito |
|-----------|-----------|
| `36_world_quest_gossip_tables.sql` | `quest_template`, `creature_queststarter` |
| `38_world_quest_gossip_data.sql` | `python3 tools/sql/import_ref_quest_gossip.py` |
| `40_world_quest_gossip_allowable_masks.sql` | Backfill de máscaras clase/raza |

Líneas de misiones filtradas por `AllowableClasses` / `AllowableRaces`. Marcadores overhead (! / ?) vía `CMSG_QUESTGIVER_STATUS_QUERY` → `SMSG_QUESTGIVER_STATUS`.

Hasta que exista estado de misión por personaje, los starters coincidentes reportan como **disponibles** (! amarillo).

## Flujo end-to-end

```
Client → CMSG_GOSSIP_HELLO
  → Lua (gossip_hello) OR GossipDB fallback → SMSG_GOSSIP_MESSAGE
  → NpcTextDB → SMSG_NPC_TEXT_UPDATE (when TextID ≠ 0)
Client → CMSG_GOSSIP_SELECT_OPTION → Lua + chained menu OR SMSG_GOSSIP_COMPLETE
```

## Integración Lua

Hooks documentados en [Scripting Lua](/wiki/es/docs/lua-scripting/). Los scripts se ejecutan **antes** del fallback DB en hello; deben establecer el flag gossip-sent al llamar `GossipSendMenu`.

## Herramientas GM

`.npc search <fragment>` — coincidencias de plantilla con estilo en chat del sistema para encontrar NPCs de prueba.

## Aún no implementado

- Opcodes de aceptar/completar misión (`CMSG_QUESTGIVER_ACCEPT_QUEST`, etc.)
- Columnas `BroadcastTextID*` (almacenadas pero sin uso server-side)

## Relacionado

- [Base de datos](/wiki/es/docs/database/) — tablas gossip
- [Comandos GM](/wiki/es/docs/gm-commands/) — `.npc search`
- [Scripting Lua](/wiki/es/docs/lua-scripting/)
