---
title: 'GM Commands'
description: 'Game Master commands reference'
pubDate: '2025-01-01'
---

# GM Commands

Los siguientes comandos están implementados actualmente en firelands-next.

## Comandos de Teleport

| Comando | Descripción | Permiso |
|---------|-------------|---------|
| `.gps` | Mostrar coordenadas actuales | CommandGps |
| `.tele <ubicación>` | Teletransportarse a ubicación | CommandTeleport |
| `.goto <nombre>` | Ir a donde está el jugador | ManagePlayers |
| `.appear <nombre>` | Ir a donde está el jugador | ManagePlayers |
| `.summon <nombre>` | Invocar jugador a ti | ManagePlayers |

## Comandos de GM

| Comando | Descripción | Permiso |
|---------|-------------|---------|
| `.gm` | Activar/desactivar modo GM | CommandGmTools |
| `.dev` | Activar modo desarrollador | CommandGmTools |
| `.dnd` | Activar modo No Molestar | CommandGmTools |
| `.visible` | Alternar visibilidad GM | CommandGmTools |
| `.fly` | Activar vuelo | CommandGmTools |
| `.speed <1-10>` | Establecer velocidad de movimiento | CommandGmTools |

## Comandos de Jugadores

| Comando | Descripción | Permiso |
|---------|-------------|---------|
| `.online` | Mostrar jugadores online | ManagePlayers |
| `.announce <msg>` | Anuncio global | ManagePlayers |
| `.kick <nombre>` | Expulsar jugador | ManagePlayers |
| `.learn <spell>` | Aprender hechizo | CommandGameplay |
| `.money <cantidad>` | Dar dinero (en copper) | CommandGameplay |
| `.additem <id> [cantidad]` | Añadir item al inventario | CommandGameplay |
| `.delitem <id>` | Eliminar item del inventario | CommandGameplay |
| `.level <nivel>` | Establecer nivel de personaje | CommandGameplay |

## Cuenta

| Comando | Descripción | Permiso |
|---------|-------------|---------|
| `.ban <cuenta>` | Banear cuenta | ManageAccounts |
| `.unban <cuenta>` | Desbanear cuenta | ManageAccounts |
| `.account` | Gestionar cuentas (solo consola) | ManageAccounts |

## Tickets

| Comando | Descripción | Permiso |
|---------|-------------|---------|
| `.ticket` | Gestionar tickets de GM | ManageGmTickets |

## Correo

| Comando | Descripción | Permiso |
|---------|-------------|---------|
| `.email` | Gestionar correo | CommandMailbox |

## Servidor

| Comando | Descripción | Permiso |
|---------|-------------|---------|
| `.server` | Control del servidor | ServerControl |
| `.npc` | Gestión de NPCs | ServerControl |

## Otros

| Comando | Descripción | Permiso |
|---------|-------------|---------|
| `.help` | Mostrar ayuda | Todos |
| `.commands` | Listar comandos disponibles | Todos |