---
title: 'DevTools'
description: 'CLI FirelandsDevTools para gestión de cuentas y reinos'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Firelands DevTools

`FirelandsDevTools` es una utilidad de línea de comandos para gestionar la base de datos Firelands. Maneja el hashing de contraseñas SRP automáticamente y es independiente de los comandos de consola `.account` en el mundo ([Comandos GM](/wiki/es/docs/gm-commands/)).

## Requisitos

- Binario compilado: `ninja -C build FirelandsDevTools` → `build/bin/FirelandsDevTools`
- MySQL/MariaDB en ejecución (Docker recomendado: `docker-compose up -d db`)
- Credenciales por defecto: usuario `firelands` / contraseña `firelands` en `localhost:3306`

## Uso

```bash
./build/bin/FirelandsDevTools <command> [arguments]
```

## Gestión de cuentas

Crea o actualiza un usuario en `firelands_auth.account`:

```bash
./FirelandsDevTools account <username> <password> [email] [expansion]
```

| Argumento | Descripción |
|-----------|-------------|
| username | Nombre de login |
| password | Texto plano (hasheado a salt/verificador SRP por la herramienta) |
| email | Opcional; por defecto `<username>@firelands.com` |
| expansion | Opcional 0–3; por defecto `3` (Cataclysm) |

Ejemplo:

```bash
./FirelandsDevTools account admin admin123 admin@example.com 3
```

## Gestión de reinos

Registra o actualiza una fila en `realmlist`:

```bash
./FirelandsDevTools realm <id> <name> <address> <port> [icon] [timezone] [secLevel] [population]
```

Si el primer argumento tras `realm` **no** es solo dígitos, se trata como el **nombre** y el segundo como **id**:

```bash
./FirelandsDevTools realm Firelands 1 127.0.0.1 8085
```

| Argumento | Descripción |
|-----------|-------------|
| id | Id único de reino |
| name | Nombre mostrado en lista de reinos |
| address | IP/hostname del servidor world |
| port | Puerto del servidor world (p. ej. 8085) |
| icon | 0=Normal, 1=PvP, 4=RP, 6=RPPvP, 8=Non-standard |
| timezone | 1=Development, 2=US, 3=Oceanic, … |
| secLevel | Nivel de acceso mínimo para unirse |
| population | Indicador float de población |

Ejemplo:

```bash
./FirelandsDevTools realm 1 "Firelands Test" 127.0.0.1 8085 1 1 0 0.0
```

## Solución de problemas

| Problema | Solución |
|----------|----------|
| Error de conexión | Asegura que la DB esté en ejecución; revisa credenciales en `DevTools.cpp` vs tu entorno |
| Permiso denegado | Concede acceso de escritura a `firelands_auth` para el usuario `firelands` |

## Relacionado

- [Configuración del desarrollador](/wiki/es/docs/developer-setup/)
- [Base de datos](/wiki/es/docs/database/) — tablas `account` y `realmlist`
- [Módulo: Executables](/wiki/es/docs/modules-executables/)
