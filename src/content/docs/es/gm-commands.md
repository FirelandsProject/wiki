---
title: 'Comandos GM'
description: 'Comandos GM, tickets y referencia de consola'
pubDate: '2025-01-01'
updatedDate: '2026-05-22'
---


# Comandos de GM

Los comandos de staff empiezan con `.` en el chat o en la consola del world. En juego requieren nivel **Game Master** o superior; la consola del world usa privilegios **Console** completos. Algunos comandos son **solo en juego**, **solo consola**, o llevan el **nombre del personaje online primero** desde consola (p. ej. `.tele Annabell -8759 544 97`).

## Teletransporte

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.gps` | Mostrar coordenadas actuales | CommandGps |
| `.tele <x> <y> [z] [mapId]` | Teletransportarse a coordenadas | CommandTeleport |
| `.goto <name>` | Ir a un jugador online | ManagePlayers |
| `.appear <name>` | Igual que `.goto` | ManagePlayers |
| `.summon <name>` | Invocar jugador hacia ti | ManagePlayers |

## Herramientas GM

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.gm [on\|off]` | Activar o desactivar etiqueta GM | CommandGmTools |
| `.dev [on\|off]` | Activar o desactivar etiqueta de desarrollador | CommandGmTools |
| `.dnd [on\|off]` | Activar o desactivar No molestar | CommandGmTools |
| `.visible [on\|off]` | Alternar visibilidad GM | CommandGmTools |
| `.fly [on\|off]` | Activar o desactivar vuelo | CommandGmTools |
| `.speed <1-10\|reset>` | Velocidad de carrera (por defecto 7) | CommandGmTools |

## Jugadores

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.online` | Listar personajes online | ManagePlayers |
| `.announce <msg>` | Anuncio global | ManagePlayers |
| `.kick <name> [reason]` | Desconectar jugador | ManagePlayers |

## Juego

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

### Subcomandos de `.faction`

- `.faction forced set <factionDbcId> <rank0-7>` — rangos 0=odiado … 7=exaltado
- `.faction forced clear <factionDbcId>`
- `.faction forced clearall`
- `.faction template self <factionTemplate>`
- `.faction template target <factionTemplate>`

## Cuenta (solo consola)

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.account create …` | Crear cuenta | ManageAccounts |
| `.account setaccess …` | Fijar nivel de acceso (requiere re-login) | ManageAccounts |
| `.account delete …` | Eliminar cuenta | ManageAccounts |
| `.ban <account>` | Bloquear cuenta (`account.locked`) | ManageAccounts |
| `.unban <account>` | Desbloquear cuenta | ManageAccounts |

## Tickets GM (solo en juego)

Requiere nivel **Game Master** y el permiso **ManageGmTickets** (incluido en el set GM por defecto). Los tickets viven en `firelands_characters.gm_ticket`; los jugadores los abren desde la UI de ayuda del cliente, y el staff gestiona la cola por chat o por el escritorio gossip descrito abajo.

| Comando | Descripción |
|---------|-------------|
| `.ticket queue` | Listar cola sin asignar en chat de sistema (hasta 20) |
| `.ticket mine` | Listar tickets asignados a tu cuenta (hasta 20) |
| `.ticket ui` | Abrir el escritorio gossip de **tickets GM** |
| `.ticket take <id>` | Asignarte el ticket |
| `.ticket reply <id> <message>` | Respuesta del staff; jugadores online reciben `SMSG_GMRESPONSE_RECEIVED` |
| `.ticket close <id>` | Cerrar ticket (debe estar asignado a ti) |

### Escritorio de tickets (`.ticket ui`)

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

## Correo

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.email` | Abrir la UI de correo sin un buzón cercano | CommandMailbox |

**Solo en juego.** Moderadores (nivel 1) y superiores pueden usar `.email`; el resto de comandos `.` siguen pidiendo **Game Master** (2+). Útil tras `.additem` si la mochila principal está llena y los objetos se enviaron por correo.

## Servidor / NPCs

| Comando | Descripción | Permiso |
|---------|-------------|-----------|
| `.server restart <delay>` | Programar apagado del world (`30s`, `5m`, etc.; cuenta atrás en los últimos 10 s) | ServerControl |
| `.npc search [fragment]` | Buscar en `creature_template` (chat de sistema con estilo) | ServerControl |
| `.npc add <entry> [displayId] [faction]` | Crear PNJ en tu posición | ServerControl |
| `.npc del` | Borrar PNJ objetivo (en juego) o por guid (consola) | ServerControl |

`.npc` crear/borrar requiere nivel **Administrator** (3). Consola: `.npc <PersonajeOnline> search|add|del …`.

## Niveles de Acceso

| Nivel | Nombre | Notas |
|-------|--------|-------|
| 0 | Jugador | Sin comandos `.` |
| 1 | Moderador | Solo `.email` |
| 2 | Game Master | La mayoría de comandos `.`; requiere permisos específicos |
| 3 | Administrator | `.npc add/del`, control total del servidor |
| — | Consola | TTY del world — privilegio **Console** vía `PrivilegeOrigin::ServerConsole` |

Los permisos están en `shared/game/Permissions.h` y se comprueban por comando (p. ej. `CommandGps`, `ManagePlayers`, `ManageGmTickets`, `ServerControl`).

## Ayuda

| Comando | Descripción |
|---------|-------------|
| `.help` | Mostrar ayuda (colores WoW; sin colores en consola) |
| `.commands` | Igual que `.help` |
