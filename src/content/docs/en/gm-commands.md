---
title: 'GM Commands'
description: 'Game Master commands, tickets, and console reference'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# GM Commands

Staff commands start with `.` in chat or on the world server console. In-game use requires **Game Master** access level or higher; the world console runs with full **Console** privileges. Some commands are **in-game only**, **console only**, or accept a **target character name first** when run from the console (e.g. `.tele Annabell -8759 544 97`).

## Teleport

| Command | Description | Permission |
|---------|-------------|------------|
| `.gps` | Show current coordinates | CommandGps |
| `.tele <x> <y> [z] [mapId]` | Teleport to coordinates | CommandTeleport |
| `.goto <name>` | Go to an online player | ManagePlayers |
| `.appear <name>` | Same as `.goto` | ManagePlayers |
| `.summon <name>` | Summon player to you | ManagePlayers |

## GM tools

| Command | Description | Permission |
|---------|-------------|------------|
| `.gm [on\|off]` | Toggle GM tag | CommandGmTools |
| `.dev [on\|off]` | Toggle developer tag | CommandGmTools |
| `.dnd [on\|off]` | Toggle Do Not Disturb | CommandGmTools |
| `.visible [on\|off]` | Toggle GM visibility | CommandGmTools |
| `.fly [on\|off]` | Toggle flight | CommandGmTools |
| `.speed <1-10\|reset>` | Set run speed (default 7) | CommandGmTools |

## Players

| Command | Description | Permission |
|---------|-------------|------------|
| `.online` | List online characters | ManagePlayers |
| `.announce <msg>` | Global announcement | ManagePlayers |
| `.kick <name> [reason]` | Disconnect player | ManagePlayers |

## Gameplay

| Command | Description | Permission | Notes |
|---------|-------------|------------|-------|
| `.learn <spellId>` | Learn spell (persisted) | CommandGameplay | Console: target name first |
| `.money <copper>` | Add/remove copper | CommandGameplay | Persists `characters.money` |
| `.additem <id> [count]` | Add item to backpack | CommandGameplay | Target another player in-game, or name first on console; full bags → mail |
| `.delitem <id>` | Remove item from backpack | CommandGameplay | Main backpack only (not equipped) |
| `.level <level>` | Set character level (1–85) | CommandGameplay | |
| `.cd` | Clear GCD and spell cooldowns | CommandGameplay | Persists empty cooldown state |
| `.damage <amount>` | Damage selected target | CommandGameplay | **In-game only**; target player or NPC first |
| `.revive` | Restore your character to full health and primary power | CommandGameplay | **In-game only** |
| `.faction …` | Forced faction standing | CommandGameplay | See subcommands below |

### `.faction` subcommands

- `.faction forced set <factionDbcId> <rank0-7>` — ranks 0=hated … 7=exalted
- `.faction forced clear <factionDbcId>`
- `.faction forced clearall`
- `.faction template self <factionTemplate>`
- `.faction template target <factionTemplate>`

## Account (console only)

| Command | Description | Permission |
|---------|-------------|------------|
| `.account create …` | Create account | ManageAccounts |
| `.account setaccess …` | Set access level (re-login required) | ManageAccounts |
| `.account delete …` | Delete account | ManageAccounts |
| `.ban <account>` | Lock account (`account.locked`) | ManageAccounts |
| `.unban <account>` | Unlock account | ManageAccounts |

## GM tickets (in-game only)

Requires **Game Master** access and the **ManageGmTickets** permission (included in the default GM permission set). Tickets are stored in `firelands_characters.gm_ticket`; players open them from the client help UI, and staff work the queue with chat commands or the gossip desk below.

| Command | Description |
|---------|-------------|
| `.ticket queue` | List unassigned queue in system chat (up to 20) |
| `.ticket mine` | List tickets assigned to your account (up to 20) |
| `.ticket ui` | Open the **GM ticket desk** gossip window |
| `.ticket take <id>` | Assign ticket to yourself |
| `.ticket reply <id> <message>` | Staff reply; online players receive `SMSG_GMRESPONSE_RECEIVED` |
| `.ticket close <id>` | Close ticket (must be assigned to you) |

### Ticket desk UI (`.ticket ui`)

`.ticket ui` opens a **synthetic gossip menu** (no NPC required). The server uses reserved menu/text ids so ticket text is not loaded from `gossip_menu` / `npc_text` tables. You must be in the world; closing the desk sends `SMSG_GOSSIP_COMPLETE`.

**Main menu**

- **Open ticket queue** — unassigned tickets, FIFO, up to 10 per page
- **My assigned tickets** — tickets where `assigned_account_id` is your account
- **Close** — dismiss the desk

**List page** (queue or mine)

- Each row shows ticket id, character name, and a short message preview
- **Previous page** / **Next page** when more than 10 tickets exist
- Select a row to open the **detail** view
- **Back** — return to the main menu

**Detail view**

Shows ticket id, character, status, map/position, full player message, and your last reply (if any). Actions:

| Option | When shown | Effect |
|--------|------------|--------|
| **Take ticket** | Unassigned or assigned to someone else | Same as `.ticket take <id>` |
| **Write reply…** | Assigned to you | Coded gossip box; same as `.ticket reply` (notifies online player) |
| **Mark resolved (close)** | Assigned to you | Same as `.ticket close <id>`; returns to the list |
| **Back** | Always | Return to the current list page |

Chat commands (`.ticket queue`, `.ticket take`, etc.) call the same `GmTicketService` logic as the UI.

## Mail

| Command | Description | Permission |
|---------|-------------|------------|
| `.email` | Open mailbox UI without a nearby mailbox NPC | CommandMailbox |

**In-game only.** Moderators (access level 1) and above may use `.email`; other dot commands still require **Game Master** (2+). Useful after `.additem` when the target’s main backpack is full and items were sent by in-game mail.

## Server / NPCs

| Command | Description | Permission |
|---------|-------------|------------|
| `.server restart <delay>` | Schedule world shutdown (`30s`, `5m`, etc.; countdown in last 10s) | ServerControl |
| `.npc search [fragment]` | Search `creature_template` (styled system chat) | ServerControl |
| `.npc add <entry> [displayId] [faction]` | Spawn NPC at your position | ServerControl |
| `.npc del` | Delete targeted NPC (in-game) or by guid (console) | ServerControl |

`.npc` spawn/delete requires **Administrator** access level (3). Console: `.npc <OnlineChar> search|add|del …`.

## Access Levels

| Level | Name | Notes |
|-------|------|-------|
| 0 | Player | No dot commands |
| 1 | Moderator | `.email` only |
| 2 | Game Master | Most `.` commands; requires specific permissions |
| 3 | Administrator | `.npc add/del`, full server control |
| — | Console | World server TTY — effective **Console** privilege via `PrivilegeOrigin::ServerConsole` |

Permissions are defined in `shared/game/Permissions.h` and checked per command (e.g. `CommandGps`, `ManagePlayers`, `ManageGmTickets`, `ServerControl`).

## Help

| Command | Description |
|---------|-------------|
| `.help` | Show help (WoW-colored; stripped on console) |
| `.commands` | Same as `.help` |
