---
title: 'Módulo: Executables'
description: 'auth y world como composition roots — arranque, cableado y flujo operativo'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Executables: `auth` y `world`

## `auth` (`src/auth/main.cpp`)

El **servidor de autenticación**:

1. Inicializa logging; carga **`authserver.yaml`** (override `FIRELANDS_AUTH_CONFIG`)
2. Ejecuta **`DatabaseMigrator`** contra `sql/` usando la URI JDBC de auth
3. Abre MariaDB; construye **`MySqlAccountRepository`**, **`MySqlRealmRepository`**
4. Construye **`AuthService`**, **`RealmListService`** (opcional **`RealmLiveRegistry`** cuando realm-link está configurado)
5. Inicia **`AsyncNetworkServer`** para clientes auth clásicos (`AuthSession`)
6. Opcionalmente inicia listener **realm-link** para métricas de población del world
7. Inicia **`RestAuthServer`** en `Network.RestPort` con **`WebSessionService`**

Bucle principal: poll `authServer.Update()` (y realm-link si está habilitado).

| Ajuste | Por defecto |
|--------|-------------|
| Auth TCP | 3724 |
| REST | 8081 |

## `world` (`src/world/main.cpp`)

El **servidor world**:

1. Carga **`worldserver.yaml`** (`FIRELANDS_WORLD_CONFIG`) — sale si falta
2. Reconfigura logging (rotación de archivos, niveles)
3. Opcionalmente **`RunRealmLinkOutbound`** cuando `RealmLink.Enabled`
4. Inicializa **`LuaGameScriptHost`** → **`WorldService`**; dispara `world_startup`
5. Configura **`MapCollisionQueriesStub`** desde `Collision.DataRoot`
6. Migra DB; conecta bases de datos **auth**, **characters** y **world**
7. Cablea **`AuthService`**, **`CharacterService`**, **`CommandService`**, **`GmTicketService`**, **`PlayerCreateInfoService`**
8. Inicia **`AsyncNetworkServer`** en `Network.Port` (por defecto **8085**)
9. Consola interactiva vía **`WorldInteractiveConsole`** (FTXUI cuando hay TTY)

Bucle principal: `worldServer.Update()`.

## `FirelandsDevTools` (`src/tools/`)

CLI para cuentas y reinos — ver [DevTools](/wiki/es/docs/devtools/). Separado de los comandos de consola `.account` en el mundo.

## Flujo operativo

```
Client → auth (SRP-6a, realm list) → world (session crypto, gameplay)
                ↑
         realm-link (población en vivo opcional)
```

- Los clientes se autentican en **auth**, luego conectan a **world** con crypto derivada de sesión
- **Realm-link** sincroniza métricas de reino en vivo de world a auth cuando está configurado
- Comandos de staff: [Comandos GM](/wiki/es/docs/gm-commands/)

## Configuración

| Archivo | Executable |
|---------|------------|
| `authserver.yaml` | `auth` |
| `worldserver.yaml` | `world` |

Secciones clave de world: `Network`, `Database.*`, `Scripting`, `Data.DbcPath`, `Collision.DataRoot`, `Rates`, `Console`, `RealmLink`.

## Relacionado

- [Configuración del desarrollador](/wiki/es/docs/developer-setup/)
- [Módulo: Infrastructure](/wiki/es/docs/modules-infrastructure/)
