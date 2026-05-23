---
title: 'Roadmap StormLib'
description: 'Extractores MPQ para Cataclysm 4.3.4 — plan de extracción DBC y mapas raw'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Roadmap StormLib — extractores DBC y mapas

Plan de implementación para extractores de datos de juego en **firelands-next**, alineado con clientes Cataclysm basados en **MPQ** (no CASC). Referencia de paridad: clon local **firelands-cata-ref** cuando esté disponible.

## Entregables

| Entregable | Significado para 4.3.4 |
|------------|------------------------|
| **Extractor DBC** | Abrir MPQs del cliente, aplicar orden de parches, extraer `DBFilesClient\*.dbc` (y `.db2`) |
| **Extractor de mapas (fase 1)** | Assets de mundo raw: `*.wdt`, `*.adt`, `*.wdl` bajo `World\maps\` |
| **Extractor de mapas (fase 2)** | `.map` servidor / vmap / mmap — ver [Pipeline VMap](/wiki/es/docs/vmap-pipeline/) |

**StormLib** cubre **solo MPQ** (abrir, buscar, leer). El parsing interno DBC/ADT es nuestro código.

## Versiones de bibliotecas

### StormLib

- Fuente: [ladislav-zezula/StormLib](https://github.com/ladislav-zezula/StormLib)
- **Política:** Fijar un **release tag** en CMake (`FetchContent`). **No** seguir `master`.
- Los MPQs retail Cataclysm usan **formato MPQ v3/v4**; StormLib **9.x** requerido.
- Fijado en `CMakeLists.txt` raíz: **9.26**

### Zlib / BZip2

StormLib necesita ambos para bloques comprimidos Blizzard. El proyecto usa ZLIB del sistema; BZip2 enlazado según CMake de StormLib.

### Toolchain

- **C++20**, CMake ≥ 3.10
- Los extractores son **executables independientes** — **no** enlazar StormLib en `auth` / `world` salvo necesidad deliberada de MPQ en runtime

## Referencia funcional (4.3.4)

- **Orden de parches:** base → expansión → `patch-*` → archivos locale; el **último** archivo gana para una ruta
- **Rutas:** separadores Blizzard `\` en listados; normalizar en código
- Raíces clave:
  - DBC: `DBFilesClient\*.dbc`
  - Mapas: `World\maps\<Map>\<Map>.wdt`, `World\maps\<Map>\<Map>_<x>_<y>.adt`

## Diseño técnico

### Módulo MPQ compartido

Wrapper C++ delgado: abrir archivo, búsqueda con máscara, leer a memoria o stream a disco; normalización de rutas.

### Extractor DBC

- Entrada: directorio `Data` o lista explícita de MPQs
- Salida: espejo bajo `DBFilesClient/` (configurable)
- Opcional: `--only Spell.dbc,...`

### Extractor de mapas (fase 1)

Extraer WDT/ADT/WDL por mapa en `maps/<Map>/...`.

### Extractor de mapas (fase 2)

Pipeline `.map` servidor + vmap/mmap — hito separado; ver [Pipeline VMap](/wiki/es/docs/vmap-pipeline/).

## Integración en repositorio

- CMake: `tools/extractors/` con `FetchContent` para StormLib (`STORM_BUILD_TESTS=OFF`)
- Binarios: `firelands-dbc-extractor`, `firelands-map-extractor`, `firelands-extractors` (TUI)
- Pruebas bajo `tests/unit/vmap/` y smoke tests de extractores

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Orden de parches incorrecto | Imprimir orden de apertura con `--list-mpqs`; prueba unitaria de cadena |
| MPQ locale faltante | Documentar archivos requeridos para DBC completo |
| Deriva API StormLib | Fijar tag; actualizar en PR dedicado |

## Relacionado

- [Extractores](/wiki/es/docs/extractors/) — guía de uso
- [Pipeline VMap](/wiki/es/docs/vmap-pipeline/) — herramientas de colisión fase 2
- [Configuración del desarrollador](/wiki/es/docs/developer-setup/) — `Data.DbcPath` en config world
