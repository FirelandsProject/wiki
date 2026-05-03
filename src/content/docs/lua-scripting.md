---
title: 'Lua Scripting'
description: 'Gameplay scripting with Lua'
pubDate: '2025-01-01'
---

# Lua Scripting

Firelands usa Lua 5.4 para scripting de gameplay. El sistema está en desarrollo.

## Ubicación

Los scripts Lua se encuentran en `scripts/lua/`. El script bootstrap es `scripts/lua/bootstrap.lua`.

## Estado Actual

El sistema de scripting está en fase inicial de implementación:

- `bootstrap.lua` - Script de inicio (actualmente vacío, disponible para definiciones globales)
- `LuaGameScriptHost` - Sistema de hosting de scripts en desarrollo

## Scripts de NPCs

Los scripts de NPCs permiten añadir comportamiento personalizado a criaturas del juego:

```lua
-- Ejemplo planned (no implementado aún)
function OnGossip(event, player, creature)
    player:GossipMenuAddItem(0, "Hello!", 0, 1)
    player:GossipSendMenu(1, creature)
end

RegisterCreatureGossipEvent(12345, 1, OnGossip)
```

## Hooks Planificados

Los siguientes hooks estarán disponibles cuando el sistema esté completo:

- `OnGossip` - Jugador habla con NPC
- `OnQuestAccept` - Jugador acepta quest
- `OnSpellCast` - Jugador lanza hechizo
- `OnEnterCombat` - Criatura entra en combate
- `OnDeath` - Criatura/Jugador muere
- `OnLogin` - Jugador se conecta
- `OnLogout` - Jugador se desconecta

## Estado del Proyecto

El sistema Lua está en desarrollo. La API expuesta puede cambiar.