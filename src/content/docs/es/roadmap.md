---
title: 'Roadmap'
description: 'Roadmap por fases, matriz de paridad y seguimiento de estabilidad del cliente'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Roadmap y seguimiento

Lugar único para el progreso: roadmap por fases, estabilidad del cliente y paridad con el **cliente 4.3.4 (build 15595)**.

## Objetivos rápidos

| Prioridad | Objetivo |
|-----------|----------|
| **Obj 0** | Cliente **estable**: login → world → **≥ 5 min idle** sin crashes |
| **Obj 1** | Paridad incremental de subsistemas (ver matriz abajo) |
| **Obj 2** | Scripting de gameplay **Lua** (sin Smart Scripts SQL) |

## Snapshot del workspace (2026-05-18)

- **Entregado:** Menús gossip NPC desde world DB — `SMSG_GOSSIP_MESSAGE` / `SMSG_GOSSIP_COMPLETE`, Lua-first + fallback DB, migraciones 31–32 + import gossip. Ver [Gossip y texto NPC](/wiki/es/docs/gossip-npc-text/).
- **Entregado:** `npc_text` + `SMSG_NPC_TEXT_UPDATE`; líneas de misiones en gossip; escritorio tickets GM
- **Abierto:** Colisión vmap/mmap completa reemplazando `MapCollisionQueriesStub`; flujo aceptar/completar misión; instancias/fases
- **Toolchain:** [Migración C++20](/wiki/es/docs/cpp20-migration/) — Fase 1 hecha; adopción de features Fase 2 abierta

## Roadmap por fases

### Fase 1 — Fundamentos y Auth ✅

- Esqueleto del proyecto (CMake / C++20), logging, conectores DB
- Auth SRP-6a + éxito de auth

### Fase 2 — Sistema de reinos ✅

- Tabla `realmlist`, `CMD_REALM_LIST` + `SMSG_REALM_LIST`

### Fase 3 — Esqueleto servidor world ✅

- App `worldserver` + YAML, `CMSG_AUTH_SESSION` + validación de sesión

### Fase 4 — Gestión de personajes ✅

- Esquema DB de personajes, `CMSG_CHAR_ENUM` / create / delete

### Fase 5 — Entrar al mundo 🔄

- [x] `CMSG_PLAYER_LOGIN`, orden SMSG del login burst, spawn `SMSG_UPDATE_OBJECT`
- [x] Relay de movimiento + chat, fix crash #132 (talents/specs)
- [x] Probes post-login: ACKs mínimos (mail, calendar, zone, LFG, cemetery, …)
- [x] Dos clientes mismo mapa: cross CreateObject al login
- [x] Idle **≥ 5 min** validado; `Network.TimeSyncPeriodMs` configurable

### Fase 6 — Mecánicas de gameplay 🔄

- [x] Host Lua MVP + hooks WorldService
- [x] Hechizos — cast mínimo (GCD + `SMSG_SPELL_START`/`GO`)
- [x] Menús gossip DB + `npc_text` + líneas de misiones en gossip
- [ ] Opcodes aceptar/completar misión
- [ ] Instancias + fases (Lua)
- [ ] Colisión real (vmap/mmap) — [Pipeline VMap](/wiki/es/docs/vmap-pipeline/)

## Estabilidad del cliente

### Definición de hecho (corto plazo)

- [x] Entrar al mundo sin crash
- [x] **≥ 5 min idle** sin desconexión
- [x] `SMSG_TIME_SYNC_REQ` periódico (no encadenado en cada respuesta)
- [ ] Spot-check orden de payload del login burst vs referencia

### Validación idle (manual)

1. Entrar al mundo; permanecer idle ≥ 5 minutos (sin chat/comandos)
2. Confirmar sin crash del cliente ni desconexión inesperada del servidor
3. Opcional: `Log.Level: trace`; ajustar `Network.TimeSyncPeriodMs` en `worldserver.yaml`

## Matriz de paridad

Sección viva — actualizar **Status** cuando cierren hitos.

| Subsistema | firelands-next | Status | Próximo criterio |
|------------|----------------|--------|------------------|
| Auth / SRP | `AuthSession`, `SRPService` | Hecho | Login cliente estable |
| Realm list | `RealmListService` | Hecho | Paridad de campos de paquete |
| World socket / crypto | `WorldSession`, `WorldCrypt` | Parcial | Casos límite de header |
| Opcodes / packets | `WorldOpcodes.h`, handlers | Parcial | Cobertura por login + world |
| Character DB | `MySqlCharacterRepository` | Hecho | Paridad de esquema |
| Secuencia login jugador | `HandlePlayerLogin` | Parcial | Spot-check SMSG críticos |
| Movimiento | `HandleMovement`, `Map` | Parcial | Filtro opcode + hooks |
| Map / grid | `Map`, `WorldObject`, `Player` | Parcial | Instancias multi-mapa |
| Visibilidad / broadcast | `BroadcastPacketToNearby` | Parcial | Rango de visibilidad real |
| Chat | `HandleMessageChat` | Parcial | Guild/party/whisper |
| Scripting | `LuaGameScriptHost` | Parcial | Expandir API C++→Lua |
| Criaturas / GOs | Tipos domain + hooks spawn | Iniciado | Unit `SMSG_UPDATE_OBJECT` |
| Combate / hechizos | `SpellCastWire`, cast handlers | Iniciado | Auras + costes de hechizo desde DBC |
| Misiones / gossip | Gossip + líneas de misiones | Parcial | Opcodes accept/complete |
| Loot | — | No iniciado | Flujo básico take-item |
| Colisión | `MapCollisionQueriesStub` | Iniciado | Cablear vmap/mmap real |
| Instancias / fases | — | No iniciado | Id instancia + hooks reset |
| DBC stores | DBC hechizos parcial | Iniciado | Plantillas críticas |
| Battlegrounds | — | No iniciado | Tras mundo abierto estable |

**Prioridad corto plazo:** aceptar/completar misión → combate/auras → datos colisión → instancias.

## Changelog de estabilidad

| Fecha | Nota |
|-------|------|
| 2026-04-29 | Fix crash #132; ACKs probe post-login |
| 2026-04-30 | Cross CreateObject al login; cast hechizo mínimo |
| 2026-05-03 | `Network.TimeSyncPeriodMs`; guía validación idle |
| 2026-05-05 | Validación idle ≥ 5 min completa |
| 2026-05-18 | Menús gossip entregados; `npc_text` WIP |

## Relacionado

- [Gossip y texto NPC](/wiki/es/docs/gossip-npc-text/)
- [Pipeline VMap](/wiki/es/docs/vmap-pipeline/)
- [Migración C++20](/wiki/es/docs/cpp20-migration/)
- [Contribuir](/wiki/es/docs/contributing/)
