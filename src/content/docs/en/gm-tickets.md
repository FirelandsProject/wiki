---
title: 'GM Tickets'
description: 'Help desk persistence, assignment, wire format, and implementation'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# GM ticket system

Persistence, assignment, application layer, and **4.3.4 / build 15595** networking for WoW-style help tickets. Complements [GM Commands](/wiki/docs/gm-commands/) (`.` commands and gossip desk UI).

## Goals

- Players **open tickets** from the client help UI; server persists and responds with `SMSG_GM_TICKET_*`
- Staff **claim**, **reply**, and **close**; players see replies and can **resolve** (`CMSG_GM_TICKET_RESPONSE_RESOLVE`)
- Queue lives in **`firelands_characters`** (same DB as characters)

## Persistence — `gm_ticket` table

Defined in `sql/18_gm_ticket.sql`.

| Column | Purpose |
|--------|---------|
| `id` | Stable ticket id |
| `account_id` | Player account |
| `character_guid` | Owner character (FK `characters.guid`) |
| `status` | See `GmTicketStatus` in `domain/models/GmTicket.h` |
| `category` | Client category byte |
| `message` | Player text |
| `gm_response` | Last staff reply |
| `map_id`, `pos_*` | Snapshot at creation |
| `assigned_account_id` | Assigned GM or `NULL` in open queue |
| `created_at`, `updated_at`, `assigned_at`, `closed_at` | Audit / FIFO |

### `GmTicketStatus`

| Status | Meaning |
|--------|---------|
| Open | In queue, unassigned |
| Assigned | `assigned_account_id` set |
| GmAnswered | Staff reply stored |
| ClosedResolved | Player resolved after reply |
| ClosedAbandoned | Player deleted ticket |
| ClosedStaff | Staff closed without player resolve |

### Repository

- Port: `domain/repositories/IGmTicketRepository.h`
- Adapter: `MySqlGmTicketRepository`
- **`TryAssign`**: atomic `UPDATE … WHERE assigned_account_id IS NULL AND status = 0` — requires `affected_rows == 1`

## Business rules

1. **One active ticket per character** (recommended) — reject duplicate open tickets
2. **Queue**: `ListUnassignedOpen(N)` ordered by `created_at` ASC
3. **Claim**: `GmTicketService::Assign(ticketId, staffAccountId)` validates permissions, calls `TryAssign`
4. **Reply**: update `gm_response`, set GmAnswered, send `SMSG_GMRESPONSE_RECEIVED`
5. **Close**: staff or player resolve paths update status and timestamps

## Application layer

| Component | Path |
|-----------|------|
| Service | `application/services/GmTicketService.*` |
| Handlers | `infrastructure/network/sessions/worldsession/WorldSessionGmTicketHandlers.cpp` |
| Packets | `GmTicketPackets.cpp` |
| Gossip desk | `WorldSessionGmTicketGossip.cpp`, `GmTicketGossipUi.h` |

Wired in `world/main.cpp`: `MySqlGmTicketRepository` → `GmTicketService` → `WorldSession` factory.

Permission: **`ManageGmTickets`** (default on Game Master).

## Network opcodes (15595)

Constants in `shared/network/WorldOpcodes.h` (WowPacketParser `V4_3_4_15595/Opcodes.cs`).

### Client → server

| Opcode | Value | Role |
|--------|-------|------|
| `CMSG_GM_TICKET_CREATE` | 0x0137 | Create ticket |
| `CMSG_GM_TICKET_UPDATE_TEXT` | 0x0636 | Update message |
| `CMSG_GM_TICKET_DELETE_TICKET` | 0x6B14 | Delete / abandon |
| `CMSG_GM_TICKET_GET_TICKET` | 0x0326 | Query current ticket |
| `CMSG_GM_TICKET_GET_SYSTEM_STATUS` | 0x4205 | Queue enabled/disabled |
| `CMSG_GM_TICKET_RESPONSE_RESOLVE` | 0x6506 | Player marks resolved |
| `CMSG_GM_SURVEY_SUBMIT` | 0x2724 | Post-resolution survey |

### Server → client

| Opcode | Value | Role |
|--------|-------|------|
| `SMSG_GM_TICKET_CREATE` | 0x2107 | Create result |
| `SMSG_GM_TICKET_UPDATE_TEXT` | 0x6535 | Update result |
| `SMSG_GM_TICKET_DELETE_TICKET` | 0x6D17 | Delete ack |
| `SMSG_GM_TICKET_GET_TICKET` | 0x2C15 | Ticket payload or none |
| `SMSG_GM_TICKET_GET_SYSTEM_STATUS` | 0x0D35 | Enable/disable UI |
| `SMSG_GM_TICKET_STATUS_UPDATE` | 0x2C25 | Queue notification |
| `SMSG_GMRESPONSE_RECEIVED` | 0x2E34 | GM reply to player |
| `SMSG_GMRESPONSE_STATUS_UPDATE` | 0x0A04 | After resolve |
| `SMSG_GMRESPONSE_DB_ERROR` | 0x0006 | Backend error |

**Important:** Do not copy 3.3.5-era layouts. Use WowPacketParser 15595 structs or sniff captures; unit-test fixed hex blobs under `tests/data/`.

## Staff UI

`.ticket ui` opens a **synthetic gossip desk** (no NPC). Reserved menu/text ids avoid colliding with world DB gossip. Full UX documented in [GM Commands](/wiki/docs/gm-commands/#gm-tickets-in-game-only).

## Implementation status

- [x] `MySqlGmTicketRepository`, `GmTicketService`, core CMSG/SMSG path
- [x] In-game `.ticket` commands and gossip desk UI
- [ ] Reference hyperlink sanitization (optional hardening)

## Related

- [GM Commands](/wiki/docs/gm-commands/)
- [Database](/wiki/docs/database/) — `gm_ticket` table
- [Module: Application](/wiki/docs/modules-application/)
