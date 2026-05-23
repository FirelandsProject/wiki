---
title: 'GM Commands'
description: 'Game Master commands reference'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---

# <span class="lang-en">GM Commands</span><span class="lang-es">Comandos de GM</span>

<span class="lang-en">

Staff commands start with `.` in chat or on the world server console. In-game use requires **Game Master** access level or higher; the world console runs with full **Console** privileges. Some commands are **in-game only**, **console only**, or accept a **target character name first** when run from the console (e.g. `.tele Annabell -8759 544 97`).

</span>
<span class="lang-es">

Los comandos de staff empiezan con `.` en el chat o en la consola del world. En juego requieren nivel **Game Master** o superior; la consola del world usa privilegios **Console** completos. Algunos comandos son **solo en juego**, **solo consola**, o llevan el **nombre del personaje online primero** desde consola (p. ej. `.tele Annabell -8759 544 97`).

</span>

## <span class="lang-en">Teleport</span><span class="lang-es">Teletransporte</span>

<span class="lang-en">

| Command | Description | Permission |
|---------|-------------|------------|
| `.gps` | Show current coordinates | CommandGps |
| `.tele <x> <y> [z] [mapId]` | Teleport to coordinates | CommandTeleport |
| `.goto <name>` | Go to an online player | ManagePlayers |
| `.appear <name>` | Same as `.goto` | ManagePlayers |
| `.summon <name>` | Summon player to you | ManagePlayers |

</span>
<span class="lang-es">

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.gps` | Mostrar coordenadas actuales | CommandGps |
| `.tele <x> <y> [z] [mapId]` | Teletransportarse a coordenadas | CommandTeleport |
| `.goto <name>` | Ir a un jugador online | ManagePlayers |
| `.appear <name>` | Igual que `.goto` | ManagePlayers |
| `.summon <name>` | Invocar jugador hacia ti | ManagePlayers |

</span>

## <span class="lang-en">GM tools</span><span class="lang-es">Herramientas GM</span>

<span class="lang-en">

| Command | Description | Permission |
|---------|-------------|------------|
| `.gm [on\|off]` | Toggle GM tag | CommandGmTools |
| `.dev [on\|off]` | Toggle developer tag | CommandGmTools |
| `.dnd [on\|off]` | Toggle Do Not Disturb | CommandGmTools |
| `.visible [on\|off]` | Toggle GM visibility | CommandGmTools |
| `.fly [on\|off]` | Toggle flight | CommandGmTools |
| `.speed <1-10\|reset>` | Set run speed (default 7) | CommandGmTools |

</span>
<span class="lang-es">

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.gm [on\|off]` | Activar o desactivar etiqueta GM | CommandGmTools |
| `.dev [on\|off]` | Activar o desactivar etiqueta de desarrollador | CommandGmTools |
| `.dnd [on\|off]` | Activar o desactivar No molestar | CommandGmTools |
| `.visible [on\|off]` | Alternar visibilidad GM | CommandGmTools |
| `.fly [on\|off]` | Activar o desactivar vuelo | CommandGmTools |
| `.speed <1-10\|reset>` | Velocidad de carrera (por defecto 7) | CommandGmTools |

</span>

## <span class="lang-en">Players</span><span class="lang-es">Jugadores</span>

<span class="lang-en">

| Command | Description | Permission |
|---------|-------------|------------|
| `.online` | List online characters | ManagePlayers |
| `.announce <msg>` | Global announcement | ManagePlayers |
| `.kick <name> [reason]` | Disconnect player | ManagePlayers |

</span>
<span class="lang-es">

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.online` | Listar personajes online | ManagePlayers |
| `.announce <msg>` | Anuncio global | ManagePlayers |
| `.kick <name> [reason]` | Desconectar jugador | ManagePlayers |

</span>

## <span class="lang-en">Gameplay</span><span class="lang-es">Juego</span>

<span class="lang-en">

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

</span>
<span class="lang-es">

| Comando | Descripción | Permiso | Notas |
|---------|-------------|-----------|-------|
| `.learn <spellId>` | Aprender hechizo (persistido) | CommandGameplay | Consola: nombre del objetivo primero |
| `.money <copper>` | Añadir o quitar cobre | CommandGameplay | Persiste `characters.money` |
| `.additem <id> [count]` | Añadir objeto a la mochila | CommandGameplay | Objetivo en juego o nombre primero en consola; mochila llena → correo |
| `.delitem <id>` | Quitar objeto de la mochila | CommandGameplay | Solo mochila principal (no equipado) |
| `.level <level>` | Fijar nivel del personaje (1–85) | CommandGameplay | |
| `.cd` | Limpiar GCD y cooldowns de hechizos | CommandGameplay | Persiste estado vacío de cooldowns |
| `.damage <amount>` | Dañar objetivo seleccionado | CommandGameplay | **Solo en juego**; selecciona jugador o PNJ antes |
| `.revive` | Restaurar salud y poder principal al máximo | CommandGameplay | **Solo en juego** |
| `.faction …` | Reputación forzada | CommandGameplay | Ver subcomandos abajo |

</span>

### <span class="lang-en">`.faction` subcommands</span><span class="lang-es">Subcomandos de `.faction`</span>

<span class="lang-en">

- `.faction forced set <factionDbcId> <rank0-7>` — ranks 0=hated … 7=exalted
- `.faction forced clear <factionDbcId>`
- `.faction forced clearall`
- `.faction template self <factionTemplate>`
- `.faction template target <factionTemplate>`

</span>
<span class="lang-es">

- `.faction forced set <factionDbcId> <rank0-7>` — rangos 0=odiado … 7=exaltado
- `.faction forced clear <factionDbcId>`
- `.faction forced clearall`
- `.faction template self <factionTemplate>`
- `.faction template target <factionTemplate>`

</span>

## <span class="lang-en">Account (console only)</span><span class="lang-es">Cuenta (solo consola)</span>

<span class="lang-en">

| Command | Description | Permission |
|---------|-------------|------------|
| `.account create …` | Create account | ManageAccounts |
| `.account setaccess …` | Set access level (re-login required) | ManageAccounts |
| `.account delete …` | Delete account | ManageAccounts |
| `.ban <account>` | Lock account (`account.locked`) | ManageAccounts |
| `.unban <account>` | Unlock account | ManageAccounts |

</span>
<span class="lang-es">

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.account create …` | Crear cuenta | ManageAccounts |
| `.account setaccess …` | Fijar nivel de acceso (requiere re-login) | ManageAccounts |
| `.account delete …` | Eliminar cuenta | ManageAccounts |
| `.ban <account>` | Bloquear cuenta (`account.locked`) | ManageAccounts |
| `.unban <account>` | Desbloquear cuenta | ManageAccounts |

</span>

## <span class="lang-en">GM tickets (in-game only)</span><span class="lang-es">Tickets GM (solo en juego)</span>

<span class="lang-en">

Requires **Game Master** access and the **ManageGmTickets** permission (included in the default GM permission set). Tickets are stored in `firelands_characters.gm_ticket`; players open them from the client help UI, and staff work the queue with chat commands or the gossip desk below.

| Command | Description |
|---------|-------------|
| `.ticket queue` | List unassigned queue in system chat (up to 20) |
| `.ticket mine` | List tickets assigned to your account (up to 20) |
| `.ticket ui` | Open the **GM ticket desk** gossip window |
| `.ticket take <id>` | Assign ticket to yourself |
| `.ticket reply <id> <message>` | Staff reply; online players receive `SMSG_GMRESPONSE_RECEIVED` |
| `.ticket close <id>` | Close ticket (must be assigned to you) |

</span>
<span class="lang-es">

Requiere nivel **Game Master** y el permiso **ManageGmTickets** (incluido en el set GM por defecto). Los tickets viven en `firelands_characters.gm_ticket`; los jugadores los abren desde la UI de ayuda del cliente, y el staff gestiona la cola por chat o por el escritorio gossip descrito abajo.

| Comando | Descripción |
|---------|-------------|
| `.ticket queue` | Listar cola sin asignar en chat de sistema (hasta 20) |
| `.ticket mine` | Listar tickets asignados a tu cuenta (hasta 20) |
| `.ticket ui` | Abrir el escritorio gossip de **tickets GM** |
| `.ticket take <id>` | Asignarte el ticket |
| `.ticket reply <id> <message>` | Respuesta del staff; jugadores online reciben `SMSG_GMRESPONSE_RECEIVED` |
| `.ticket close <id>` | Cerrar ticket (debe estar asignado a ti) |

</span>

### <span class="lang-en">Ticket desk UI (`.ticket ui`)</span><span class="lang-es">Escritorio de tickets (`.ticket ui`)</span>

<span class="lang-en">

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

</span>
<span class="lang-es">

`.ticket ui` abre un **menú gossip sintético** (sin NPC). El servidor usa ids de menú/texto reservados; el contenido no sale de `gossip_menu` / `npc_text`. Debes estar en el mundo; al cerrar el escritorio se envía `SMSG_GOSSIP_COMPLETE`.

**Menú principal**

- **Cola de tickets abierta** — tickets sin asignar, FIFO, hasta 10 por página
- **Mis tickets asignados** — tickets con tu `assigned_account_id`
- **Cerrar** — cerrar el escritorio

**Lista** (cola o míos)

- Cada fila: id, nombre del personaje y vista previa del mensaje
- **Página anterior** / **Página siguiente** si hay más de 10
- Elige una fila para el **detalle**
- **Volver** — al menú principal

**Detalle**

Muestra id, personaje, estado, mapa/posición, mensaje del jugador y tu última respuesta. Acciones:

| Opción | Cuándo | Efecto |
|--------|--------|--------|
| **Tomar ticket** | Sin asignar o de otro GM | Igual que `.ticket take <id>` |
| **Escribir respuesta…** | Asignado a ti | Caja gossip; igual que `.ticket reply` (avisa al jugador online) |
| **Marcar resuelto (cerrar)** | Asignado a ti | Igual que `.ticket close <id>`; vuelve a la lista |
| **Volver** | Siempre | Vuelve a la lista actual |

Los comandos de chat usan la misma lógica `GmTicketService` que la UI.

</span>

## <span class="lang-en">Mail</span><span class="lang-es">Correo</span>

<span class="lang-en">

| Command | Description | Permission |
|---------|-------------|------------|
| `.email` | Open mailbox UI without a nearby mailbox NPC | CommandMailbox |

**In-game only.** Moderators (access level 1) and above may use `.email`; other dot commands still require **Game Master** (2+). Useful after `.additem` when the target’s main backpack is full and items were sent by in-game mail.

</span>
<span class="lang-es">

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.email` | Abrir la UI de correo sin un buzón cercano | CommandMailbox |

**Solo en juego.** Moderadores (nivel 1) y superiores pueden usar `.email`; el resto de comandos `.` siguen pidiendo **Game Master** (2+). Útil tras `.additem` si la mochila principal está llena y los objetos se enviaron por correo.

</span>

## <span class="lang-en">Server / NPCs</span><span class="lang-es">Servidor / NPCs</span>

<span class="lang-en">

| Command | Description | Permission |
|---------|-------------|------------|
| `.server restart <delay>` | Schedule world shutdown (`30s`, `5m`, etc.; countdown in last 10s) | ServerControl |
| `.npc search [fragment]` | Search `creature_template` (styled system chat) | ServerControl |
| `.npc add <entry> [displayId] [faction]` | Spawn NPC at your position | ServerControl |
| `.npc del` | Delete targeted NPC (in-game) or by guid (console) | ServerControl |

`.npc` spawn/delete requires **Administrator** access level (3). Console: `.npc <OnlineChar> search|add|del …`.

</span>
<span class="lang-es">

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.server restart <delay>` | Programar apagado del world (`30s`, `5m`, etc.; cuenta atrás en los últimos 10 s) | ServerControl |
| `.npc search [fragment]` | Buscar en `creature_template` (chat de sistema con estilo) | ServerControl |
| `.npc add <entry> [displayId] [faction]` | Crear PNJ en tu posición | ServerControl |
| `.npc del` | Borrar PNJ objetivo (en juego) o por guid (consola) | ServerControl |

`.npc` crear/borrar requiere nivel **Administrator** (3). Consola: `.npc <PersonajeOnline> search|add|del …`.

</span>

## <span class="lang-en">Access Levels</span><span class="lang-es">Niveles de Acceso</span>

<span class="lang-en">

| Level | Name | Notes |
|-------|------|-------|
| 0 | Player | No dot commands |
| 1 | Moderator | `.email` only |
| 2 | Game Master | Most `.` commands; requires specific permissions |
| 3 | Administrator | `.npc add/del`, full server control |
| — | Console | World server TTY — effective **Console** privilege via `PrivilegeOrigin::ServerConsole` |

Permissions are defined in `shared/game/Permissions.h` and checked per command (e.g. `CommandGps`, `ManagePlayers`, `ManageGmTickets`, `ServerControl`).

</span>
<span class="lang-es">

| Nivel | Nombre | Notas |
|-------|--------|-------|
| 0 | Jugador | Sin comandos `.` |
| 1 | Moderador | Solo `.email` |
| 2 | Game Master | La mayoría de comandos `.`; requiere permisos específicos |
| 3 | Administrator | `.npc add/del`, control total del servidor |
| — | Consola | TTY del world — privilegio **Console** vía `PrivilegeOrigin::ServerConsole` |

Los permisos están en `shared/game/Permissions.h` y se comprueban por comando (p. ej. `CommandGps`, `ManagePlayers`, `ManageGmTickets`, `ServerControl`).

</span>

## <span class="lang-en">Help</span><span class="lang-es">Ayuda</span>

<span class="lang-en">

| Command | Description |
|---------|-------------|
| `.help` | Show help (WoW-colored; stripped on console) |
| `.commands` | Same as `.help` |

</span>
<span class="lang-es">

| Comando | Descripción |
|---------|-------------|
| `.help` | Mostrar ayuda (colores WoW; sin colores en consola) |
| `.commands` | Igual que `.help` |

</span>
