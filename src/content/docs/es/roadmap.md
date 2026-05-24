---
title: 'Roadmap del Core'
description: 'Roadmap unificado de desarrollo para firelands-next — fases, matriz de paridad, extractores, toolchain y seguimiento de estado'
pubDate: '2025-01-01'
updatedDate: '2026-05-24'
---

# Roadmap de desarrollo del core

**Fuente única de verdad** para todo el trabajo del core de firelands-next. Esta página fusiona los roadmaps anteriores (fases, matriz de paridad, pipeline VMap, StormLib, C++20, plan MapService, plan SpellManager) en un único tracker vivo.

**Cliente objetivo:** WoW Cataclysm **4.3.4 / build 15595**.

---

## Leyenda de estados

Usa estos símbolos en toda la página. Actualiza una fila cuando se cumpla el **próximo criterio** de esa fila.

| Símbolo | Estado | Significado |
|:-------:|--------|-------------|
| ✅ | **Hecho** | Entregado, probado o validado manualmente, docs actualizadas |
| 🔄 | **En curso** | Implementación parcial o rama activa |
| ⏳ | **Pendiente** | Acotado y priorizado; no iniciado |
| 📋 | **Planificado** | Dirección acordada; menor prioridad o bloqueado por dependencia |
| ⛔ | **Bloqueado** | Esperando otro hito |

**Convención de checkboxes:** `[x]` = hecho · `[~]` = en curso · `[ ]` = pendiente

---

## Objetivos principales

| Prioridad | Objetivo | Estado |
|:---------:|----------|:------:|
| **Obj 0** | Cliente **estable**: login → world → **≥ 5 min idle** sin crashes | ✅ |
| **Obj 1** | **Paridad incremental** de subsistemas vs referencia (ver matriz) | 🔄 |
| **Obj 2** | Scripting de gameplay **Lua-first** (sin Smart Scripts SQL) | 🔄 |
| **Obj 3** | **Datos de colisión** idénticos a referencia (vmap/mmap) en runtime | 🔄 |

---

## Panel de progreso

Snapshot **2026-05-24**. Los conteos son manuales — actualizar al cerrar hitos.

| Track | Hecho | En curso | Pendiente |
|-------|:-----:|:--------:|:---------:|
| Fases core (1–6) | 4 | 2 | 0 |
| Subsistemas (matriz) | 3 | 12 | 4 |
| Pipeline extractores (Tools 1–4 + runtime) | 6 | 2 | 3 |
| Arquitectura / ops | 2 | 2 | 4 |
| Toolchain (C++20) | 1 fase | 1 fase | — |

**Foco actual (corto plazo):** combate de criaturas + `SMSG_UPDATE_OBJECT` para unidades → aceptar/completar misión → auras/efectos → generador mmap → colisión en runtime.

---

## Fases core (alto nivel)

### Fase 1 — Fundamentos y Auth ✅

| Ítem | Estado |
|------|:------:|
| Esqueleto del proyecto (CMake / C++20), logging, conectores DB | ✅ |
| Auth SRP-6a + login exitoso | ✅ |

### Fase 2 — Sistema de reinos ✅

| Ítem | Estado |
|------|:------:|
| Tabla `realmlist`, `CMD_REALM_LIST` + `SMSG_REALM_LIST` | ✅ |

### Fase 3 — Esqueleto servidor world ✅

| Ítem | Estado |
|------|:------:|
| App `worldserver` + config YAML | ✅ |
| `CMSG_AUTH_SESSION` + validación de sesión | ✅ |

### Fase 4 — Gestión de personajes ✅

| Ítem | Estado |
|------|:------:|
| Esquema DB de personajes | ✅ |
| `CMSG_CHAR_ENUM` / create / delete | ✅ |
| [Player create info](/wiki/es/docs/playercreateinfo/) — spawn, hechizos, skills desde world DB | ✅ |

### Fase 5 — Entrar al mundo 🔄

La mayoría de criterios de estabilidad cumplidos; quedan items de pulido.

- [x] `CMSG_PLAYER_LOGIN`, orden SMSG del login burst, spawn `SMSG_UPDATE_OBJECT`
- [x] Relay de movimiento + chat; fix crash #132 (talents/specs)
- [x] Probes post-login: ACKs mínimos (mail, calendar, zone, LFG, cemetery, …)
- [x] Dos clientes mismo mapa: cross `CreateObject` al login
- [x] Idle **≥ 5 min** validado; `Network.TimeSyncPeriodMs` configurable
- [ ] Spot-check orden de payload del login burst vs referencia
- [ ] Chatter post-login: ignore seguro o handler completo (sin loops / asserts)

### Fase 6 — Mecánicas de gameplay 🔄

- [x] Matriz de paridad (este documento)
- [x] Host Lua MVP + hooks `WorldService`
- [x] Hechizos — cast mínimo (GCD + `SMSG_SPELL_START`/`GO` + lista de fallos)
- [x] Menús gossip DB + `npc_text` + líneas de misiones en UI gossip
- [x] [Faseo de zona](/wiki/es/docs/phase-system/) — `PhaseShift`, gates área/misión, `SMSG_PHASE_SHIFT_CHANGE`
- [x] [Escritorio tickets GM](/wiki/es/docs/gm-tickets/) — persistencia, claim/reply/close, UI gossip
- [~] Criaturas — pipeline spawn, `SMSG_UPDATE_OBJECT` unidad, hooks combate
- [~] Flujo misiones — handlers gossip query; opcodes accept/complete + refresh fase en eventos quest
- [ ] Loot — flujo básico take-item
- [ ] Instancias + scripts de instancia (Lua)
- [ ] Colisión real (vmap/mmap) — [Pipeline VMap](/wiki/es/docs/vmap-pipeline/)
- [ ] Battlegrounds / arena (tras mundo abierto estable)

---

## Matriz de paridad de subsistemas

Sección viva — actualizar **Estado** y **Próximo criterio** al cerrar hitos.

| Subsistema | firelands-next | Estado | Próximo criterio |
|------------|----------------|:------:|------------------|
| Auth / SRP | `AuthSession`, `SRPService` | ✅ | — |
| Realm list | `RealmListService` | ✅ | Spot-check paridad campos paquete |
| Character DB | `MySqlCharacterRepository` | ✅ | Paridad esquema vs SQL ref |
| Player create info | `PlayerCreateInfoService`, migraciones 60–62 | ✅ | Regenerar bundles tras editar datos |
| World socket / crypto | `WorldSession`, `WorldCrypt` | 🔄 | Casos límite header vs ref |
| Opcodes / packets | `WorldOpcodes.h`, `shared/network/packets/` | 🔄 | Matriz cobertura login + world |
| Secuencia login jugador | `WorldSessionLoginFlow` | 🔄 | Spot-check byte-a-byte SMSG críticos |
| Movimiento | `HandleMovement`, `Map` | 🔄 | Filtro opcode + baseline anticheat |
| Map / grid | `Map`, `MapService`, `MapRegistry` | 🔄 | IDs instancia multi-mapa |
| Visibilidad / broadcast | `BroadcastPacketToNearby` | 🔄 | Rango visibilidad real |
| Chat | `HandleMessageChat` | 🔄 | Paridad guild / party / whisper |
| Scripting | `LuaGameScriptHost` | 🔄 | Expandir superficie C++→Lua + sandbox |
| Faseo | `PhaseShift`, `WorldSessionPhasing` | 🔄 | Accept/complete misión dispara refresh fase |
| Criaturas / GOs | Tipos domain + hooks spawn | 🔄 | Update fields unidad + engagement combate |
| Combate / hechizos | `SpellManager`, `WorldSessionCombat` | 🔄 | Auras + costes desde DBC; primer efecto daño/cura |
| Misiones / gossip | Gossip + líneas + handlers parciales | 🔄 | Opcodes accept/complete + writes `PlayerQuestProgressStore` |
| Loot | — | ⏳ | Flujo básico take-item |
| Colisión / path | `IMapCollisionQueries` + stub | 🔄 | Cablear `Collision.DataRoot` a vmap/mmap real |
| Instancias | — | ⏳ | Id instancia en `Map` + hooks reset |
| DBC stores | `SpellEntryDbcStore`, catálogos parciales | 🔄 | Plantillas críticas unit/item |
| GM / staff | `CommandService`, tickets, apariencia | ✅ | Extender comandos según necesidad |
| Battlegrounds | — | 📋 | Tras mundo abierto estable |
| Anticheat | — | 📋 | Baseline validación movimiento |

**Orden de prioridad:** criaturas/combate → misiones → auras/efectos → datos colisión → instancias.

---

## Tracks detallados

### Misiones y gossip

| Hito | Estado | Notas |
|------|:------:|-------|
| `SMSG_GOSSIP_MESSAGE` / `SMSG_GOSSIP_COMPLETE` desde DB | ✅ | Lua-first + fallback `IGossipRepository` |
| `npc_text` + `CMSG_NPC_TEXT_QUERY` → `SMSG_NPC_TEXT_UPDATE` | ✅ | Migraciones 33–34 + import ref |
| Líneas de misiones en menú gossip | ✅ | Mostradas en UI gossip |
| `CMSG_QUESTGIVER_*` hello / status / query | 🔄 | Handlers en `WorldSessionGossip.cpp` |
| Aceptar / completar / recompensa misión | ⏳ | Cablear `PlayerQuestProgressStore`; llamar `RefreshPlayerPhaseVisibilityFromQuestProgress` |
| Datos plantilla misión + import SQL | ⏳ | Tras flujo opcodes |

Ver [Gossip y texto NPC](/wiki/es/docs/gossip-npc-text/) y [Sistema de fases](/wiki/es/docs/phase-system/).

### Combate y hechizos (`SpellManager`)

Fusionado del plan de implementación SpellManager.

| Fase | Alcance | Estado |
|------|---------|:------:|
| **A** | Esqueleto `SpellManager`; delegación desde `WorldSession`; GCD + START/GO/FAILURE | ✅ |
| **B** | `ISpellDefinitionStore`, `SpellDefinition`, merge DBC + `spell_dbc` al arranque | 🔄 |
| **C** | Validación mundo — rango (parcial), LoS cuando exista colisión | 🔄 |
| **D** | Primer efecto jugable — daño o cura directa + update fields | ⏳ |
| **E** | Cooldowns, coste power, apply/remove aura | ⏳ |
| **F** | Pipeline efectos extensible; batching / tuning perf | 📋 |

Reglas de rendimiento (hot path): lookup O(1), sin MySQL por cast, sin mutex global en cast, checks baratos antes de LoS.

### Criaturas y entidades mundo

| Hito | Estado |
|------|:------:|
| Tipos domain `Creature` / `GameObject` | ✅ |
| Bootstrap spawn DB + faseo en spawn | ✅ |
| `SMSG_UPDATE_OBJECT` para jugador (CreateObject) | ✅ |
| Update fields unidad para criaturas (vida, flags, nivel) | 🔄 |
| Engagement combate + baseline threat | 🔄 |
| Opcodes interacción GO | ⏳ |

### MapService y operaciones world

Fusionado del plan de aislamiento MapService.

| Hito | Estado | Ubicación |
|------|:------:|-----------|
| Value object `MapSnapshot` | ✅ | `domain/world/MapSnapshot.h` |
| Timing de tick en `Map` | ✅ | `Map::RecordTickTime`, `CreateSnapshot` |
| Wrapper `MapService` | ✅ | `application/services/MapService` |
| `MapRegistry` reemplaza mapa raw en `WorldService` | ✅ | `application/services/MapRegistry` |
| Panel FTXUI **Map Status** | ✅ | `WorldFtxuiConsole` |
| Shutdown graceful — drenaje sesiones | ⏳ | `AsyncNetworkServer::StopGraceful` |
| Validación config fail-fast al arranque | ⏳ | Todas las claves YAML antes de bind |
| Estado mapa vía realm-link a auth | 📋 | Telemetría ops opcional |

### Refactor de red

| Hito | Estado |
|------|:------:|
| Split `WorldSession` en `worldsession/*.cpp` | ✅ |
| Helpers tipados en `shared/network/packets/` | 🔄 |
| Extraer read/write repetidos a tipos wire compartidos | 🔄 |

---

## Extractores y pipeline de colisión

Plan maestro: [Pipeline VMap](/wiki/es/docs/vmap-pipeline/). Hitos MPQ: [Roadmap StormLib](/wiki/es/docs/storm-lib/).

```
WoW 4.3.4 Data/  →  Tool 1 (.map)  →  Tool 2 (Buildings/)  →  Tool 3 (vmaps/)  →  Tool 4 (mmaps/)  →  runtime world
```

| # | Componente | Target CMake | Estado | Siguiente paso |
|:-:|------------|--------------|:------:|----------------|
| — | Cadena patch MPQ | `FirelandsExtractCommon` | ✅ | — |
| — | Extract DBC / DB2 | `firelands-dbc-extractor` | ✅ | — |
| — | Mapas cliente raw | `firelands-map-extractor` | ✅ | — |
| 1 | `.map` servidor + tilelist + Cameras | `firelands-map-extractor-vmap` | ✅ | Hardening paridad vs salida ref |
| 2 | Extract VMap4 | `firelands-vmap4-extractor` | ✅ | Split modular opcional |
| 3 | Assemble VMap4 | `firelands-vmap4-assembler` | ✅ | Tests integración |
| 4 | Generar MMAP (Recast/Detour) | `firelands-mmap-generator` | ⏳ | Portar generador ref |
| — | TUI orquesta pipeline completo | `firelands-extractors` | 🔄 | Tools 1–4 desde FTXUI |
| — | Runtime `IMapCollisionQueries` | `world` | 🔄 | Reemplazar stub; cargar vmap + mmap |

**Criterio de cierre colisión:** generar dataset con Tools 1–4 → cablear `VMapManager2` + Detour en world → tests integración (LoS, altura, path spot-checks).

---

## Toolchain — C++20

Detalle: [Migración C++20](/wiki/es/docs/cpp20-migration/).

| Hito | Estado |
|------|:------:|
| Fase 1 — `CMAKE_CXX_STANDARD 20`, docs, `SPDLOG_USE_STD_FORMAT` | ✅ |
| `std::span` en `ByteBuffer` | ✅ |
| Coroutines Boost.Asio C++20 en `infrastructure/network/` | ✅ |
| Trial builds — matriz completa compiladores (Linux, Windows) | ⏳ |
| Fase 2 — designated initializers, `using enum` | ⏳ |

---

## Estabilidad del cliente

### Definición de hecho (corto plazo)

- [x] Entrar al mundo sin crash
- [x] **≥ 5 min idle** sin desconexión
- [x] `SMSG_TIME_SYNC_REQ` periódico (no encadenado en cada respuesta)
- [ ] Spot-check orden payload login burst vs referencia
- [ ] Manejo seguro de todos los opcodes probe post-login

### Checklist ACK mínimos post-login ✅

Mail time, calendar pending, zone update, guild bank withdraw, LFG vacío, cemetery list — implementados. Battlefield status = no-op intencional sin cola.

### Validación idle (manual)

1. Entrar al mundo; permanecer idle ≥ 5 minutos (sin chat/comandos)
2. Confirmar sin crash del cliente ni desconexión inesperada del servidor
3. Opcional: `Log.Level: trace`; ajustar `Network.TimeSyncPeriodMs` en `worldserver.yaml`

---

## Changelog de estabilidad

| Fecha | Nota |
|-------|------|
| 2026-04-29 | Fix crash #132; ACKs probe post-login |
| 2026-04-30 | Cross CreateObject al login; cast hechizo mínimo |
| 2026-05-03 | `Network.TimeSyncPeriodMs`; guía validación idle |
| 2026-05-05 | Validación idle ≥ 5 min completa |
| 2026-05-18 | Menús gossip entregados; `npc_text` landed |
| 2026-05-23 | Faseo de zona, docs playercreateinfo, migraciones fase 53–59 |
| 2026-05-24 | Roadmap core unificado (esta página); MapService + panel Map Status |

---

## Cómo actualizar este roadmap

1. Cerrar un hito en código → actualizar **Estado** de la fila y marcar el checkbox.
2. Añadir línea al **Changelog de estabilidad** para mejoras visibles al usuario.
3. Incrementar `updatedDate` en frontmatter.
4. Los docs de detalle ([phase-system](/wiki/es/docs/phase-system/), [vmap-pipeline](/wiki/es/docs/vmap-pipeline/), etc.) guardan el detalle técnico; esta página es el **índice y tracker**.

En duda, usar ✅ solo tras tests o validación manual — no solo merge a `main`.

---

## Documentación relacionada

| Tema | Página |
|------|--------|
| Arquitectura | [Arquitectura](/wiki/es/docs/architecture/) |
| Gossip y texto NPC | [Gossip y texto NPC](/wiki/es/docs/gossip-npc-text/) |
| Sistema de fases | [Sistema de fases](/wiki/es/docs/phase-system/) |
| Player create info | [Player create info](/wiki/es/docs/playercreateinfo/) |
| Tickets GM | [Tickets GM](/wiki/es/docs/gm-tickets/) |
| Scripting Lua | [Scripting Lua](/wiki/es/docs/lua-scripting/) |
| Pipeline VMap / mmap | [Pipeline VMap](/wiki/es/docs/vmap-pipeline/) |
| StormLib / MPQ | [StormLib](/wiki/es/docs/storm-lib/) |
| Migración C++20 | [Migración C++20](/wiki/es/docs/cpp20-migration/) |
| Contribuir | [Contribuir](/wiki/es/docs/contributing/) |

**Copias legacy** en el repo firelands-next (`docs/EN/ROADMAP.md`, `docs/ES/ROADMAP.md`, planes extractores) redirigen aquí — editar **solo esta página wiki**.
