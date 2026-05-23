---
title: 'Tickets GM'
description: 'Persistencia de help desk, asignación, formato wire e implementación'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Sistema de tickets GM

Persistencia, asignación, capa application y networking **4.3.4 / build 15595** para tickets de ayuda estilo WoW. Complementa [Comandos GM](/wiki/es/docs/gm-commands/) (comandos `.` y UI de escritorio gossip).

## Objetivos

- Los jugadores **abren tickets** desde la UI de ayuda del cliente; el servidor persiste y responde con `SMSG_GM_TICKET_*`
- El staff **reclama**, **responde** y **cierra**; los jugadores ven respuestas y pueden **resolver** (`CMSG_GM_TICKET_RESPONSE_RESOLVE`)
- La cola vive en **`firelands_characters`** (misma DB que personajes)

## Persistencia — tabla `gm_ticket`

Definida en `sql/18_gm_ticket.sql`.

| Columna | Propósito |
|---------|-----------|
| `id` | Id estable del ticket |
| `account_id` | Cuenta del jugador |
| `character_guid` | Personaje propietario (FK `characters.guid`) |
| `status` | Ver `GmTicketStatus` en `domain/models/GmTicket.h` |
| `category` | Byte de categoría del cliente |
| `message` | Texto del jugador |
| `gm_response` | Última respuesta del staff |
| `map_id`, `pos_*` | Snapshot al crear |
| `assigned_account_id` | GM asignado o `NULL` en cola abierta |
| `created_at`, `updated_at`, `assigned_at`, `closed_at` | Auditoría / FIFO |

### `GmTicketStatus`

| Status | Significado |
|--------|-------------|
| Open | En cola, sin asignar |
| Assigned | `assigned_account_id` establecido |
| GmAnswered | Respuesta del staff almacenada |
| ClosedResolved | Jugador resolvió tras respuesta |
| ClosedAbandoned | Jugador eliminó ticket |
| ClosedStaff | Staff cerró sin resolución del jugador |

### Repository

- Port: `domain/repositories/IGmTicketRepository.h`
- Adapter: `MySqlGmTicketRepository`
- **`TryAssign`**: `UPDATE … WHERE assigned_account_id IS NULL AND status = 0` atómico — requiere `affected_rows == 1`

## Reglas de negocio

1. **Un ticket activo por personaje** (recomendado) — rechazar tickets abiertos duplicados
2. **Cola**: `ListUnassignedOpen(N)` ordenado por `created_at` ASC
3. **Reclamar**: `GmTicketService::Assign(ticketId, staffAccountId)` valida permisos, llama `TryAssign`
4. **Responder**: actualizar `gm_response`, establecer GmAnswered, enviar `SMSG_GMRESPONSE_RECEIVED`
5. **Cerrar**: rutas de resolución staff o jugador actualizan status y timestamps

## Capa application

| Componente | Ruta |
|------------|------|
| Service | `application/services/GmTicketService.*` |
| Handlers | `infrastructure/network/sessions/worldsession/WorldSessionGmTicketHandlers.cpp` |
| Packets | `GmTicketPackets.cpp` |
| Gossip desk | `WorldSessionGmTicketGossip.cpp`, `GmTicketGossipUi.h` |

Cableado en `world/main.cpp`: `MySqlGmTicketRepository` → `GmTicketService` → factory `WorldSession`.

Permiso: **`ManageGmTickets`** (por defecto en Game Master).

## Opcodes de red (15595)

Constantes en `shared/network/WorldOpcodes.h` (WowPacketParser `V4_3_4_15595/Opcodes.cs`).

### Cliente → servidor

| Opcode | Valor | Rol |
|--------|-------|-----|
| `CMSG_GM_TICKET_CREATE` | 0x0137 | Crear ticket |
| `CMSG_GM_TICKET_UPDATE_TEXT` | 0x0636 | Actualizar mensaje |
| `CMSG_GM_TICKET_DELETE_TICKET` | 0x6B14 | Eliminar / abandonar |
| `CMSG_GM_TICKET_GET_TICKET` | 0x0326 | Consultar ticket actual |
| `CMSG_GM_TICKET_GET_SYSTEM_STATUS` | 0x4205 | Cola habilitada/deshabilitada |
| `CMSG_GM_TICKET_RESPONSE_RESOLVE` | 0x6506 | Jugador marca resuelto |
| `CMSG_GM_SURVEY_SUBMIT` | 0x2724 | Encuesta post-resolución |

### Servidor → cliente

| Opcode | Valor | Rol |
|--------|-------|-----|
| `SMSG_GM_TICKET_CREATE` | 0x2107 | Resultado de creación |
| `SMSG_GM_TICKET_UPDATE_TEXT` | 0x6535 | Resultado de actualización |
| `SMSG_GM_TICKET_DELETE_TICKET` | 0x6D17 | Ack de eliminación |
| `SMSG_GM_TICKET_GET_TICKET` | 0x2C15 | Payload de ticket o ninguno |
| `SMSG_GM_TICKET_GET_SYSTEM_STATUS` | 0x0D35 | Habilitar/deshabilitar UI |
| `SMSG_GM_TICKET_STATUS_UPDATE` | 0x2C25 | Notificación de cola |
| `SMSG_GMRESPONSE_RECEIVED` | 0x2E34 | Respuesta GM al jugador |
| `SMSG_GMRESPONSE_STATUS_UPDATE` | 0x0A04 | Tras resolver |
| `SMSG_GMRESPONSE_DB_ERROR` | 0x0006 | Error de backend |

**Importante:** No copies layouts de la era 3.3.5. Usa structs WowPacketParser 15595 o capturas sniff; prueba unitaria blobs hex fijos bajo `tests/data/`.

## UI de staff

`.ticket ui` abre un **escritorio gossip sintético** (sin NPC). Ids de menú/texto reservados evitan colisionar con gossip de world DB. UX completa documentada en [Comandos GM](/wiki/es/docs/gm-commands/#gm-tickets-in-game-only).

## Estado de implementación

- [x] `MySqlGmTicketRepository`, `GmTicketService`, ruta CMSG/SMSG core
- [x] Comandos `.ticket` en juego y UI de escritorio gossip
- [ ] Sanitización de hipervínculos de referencia (endurecimiento opcional)

## Relacionado

- [Comandos GM](/wiki/es/docs/gm-commands/)
- [Base de datos](/wiki/es/docs/database/) — tabla `gm_ticket`
- [Módulo: Application](/wiki/es/docs/modules-application/)
