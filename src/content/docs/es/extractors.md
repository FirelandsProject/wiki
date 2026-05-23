---
title: 'Extractores'
description: 'Extractores de datos del cliente para archivos MPQ de Cataclysm 4.3.4'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Extractores de datos del cliente (4.3.4 / MPQ)

Herramientas que leen una carpeta retail **Cataclysm** `World of Warcraft/Data` (archivos MPQ, no CASC) usando **StormLib v9.26** (fijado en `CMakeLists.txt` raíz).

## Prerrequisitos

- Build CMake de firelands-next (mismo toolchain que los servidores)
- Paquetes dev de **zlib** y **bzip2** del sistema (StormLib los enlaza)

## Binarios

| Target | Propósito |
|--------|-----------|
| **`firelands-extractors`** | **Launcher TUI** a pantalla completa (FTXUI): elegir DBC/mapas/listar MPQs, editar rutas, ejecutar |
| `firelands-dbc-extractor` | Extraer `DBFilesClient\*.dbc` y `*.db2` |
| `firelands-map-extractor` | Assets de mapa raw (WDT/ADT/WDL) desde MPQs |

Salida del build: `${CMAKE_BINARY_DIR}/bin/`

## Launcher TUI

Ejecutar **sin argumentos** desde terminal interactiva:

```bash
./firelands-extractors
```

Elige operación, configura **WoW Data** y **carpeta de salida**, luego **Run**. Desplázate con PgUp/PgDn; **Q** sale cuando está inactivo. Sin TTY (CI/pipes), usa las CLIs dedicadas abajo.

## Modo CLI (scripts / CI)

Listar orden de parches MPQ:

```bash
./firelands-dbc-extractor --data "/path/to/WoW/Data" --list-mpqs
```

Extraer todas las tablas DBC/DB2:

```bash
./firelands-dbc-extractor --data "/path/to/WoW/Data" --out ./client-dbc
```

Extraer archivos de mapa raw:

```bash
./firelands-map-extractor --data "/path/to/WoW/Data" --out ./client-maps
```

## Orden MPQ

Los archivos bajo `Data` se ordenan para **overlay de parches**: primer archivo = archivo base; cada archivo siguiente se aplica con `SFileOpenPatchArchive` para que entradas posteriores sobrescriban las anteriores para la misma ruta.

Detalles: [Roadmap StormLib](/wiki/es/docs/storm-lib/).

## Pipeline de colisión del servidor

La extracción raw MPQ es independiente de la generación **servidor** `.map` / vmap / mmap. Ver [Pipeline VMap](/wiki/es/docs/vmap-pipeline/) para Tools 1–4 e integración runtime de colisión.

## Relacionado

- [Configuración del desarrollador](/wiki/es/docs/developer-setup/) — ruta DBC en `worldserver.yaml`
- [StormLib](/wiki/es/docs/storm-lib/)
- [Pipeline VMap](/wiki/es/docs/vmap-pipeline/)
