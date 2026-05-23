---
title: 'Pipeline VMap'
description: 'Datos del cliente y extractores de colisión — plan maestro .map, vmap, mmap del servidor'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Datos del cliente y extractores de colisión

**Estrategia:** Port completo en C++ desde la implementación de referencia — cero binarios envueltos para el pipeline de colisión.

**Objetivo principal:** Artefactos de colisión **servidor** idénticos a referencia (`.map`, `vmaps/`, `mmaps/`) para que un **`VMapManager2` / runtime mmap** portado reemplace `MapCollisionQueriesStub`.

**Cliente objetivo:** WoW **4.3.4 / build 15595**.

## Visión general del alcance

| Área | Target | Propósito | Estado |
|------|--------|-----------|--------|
| MPQ + orden de parches | `FirelandsExtractCommon` | `MpqPatchChain`, `WowDataMpqList` | **Hecho** |
| Extracción DBC / DB2 | `firelands-dbc-extractor` | `DBFilesClient` → árbol de salida | **Hecho** |
| Mapas cliente raw | `firelands-map-extractor` | WDT/ADT/WDL desde MPQs | **Hecho** |
| Launcher TUI | `firelands-extractors` | FTXUI: DBC + mapas raw | **Parcial** |
| Matemática vmap compartida | `FirelandsVmapCommon` | BIH, lector DBC, `ModelSpawn` | **Hecho** |
| `.map` servidor + tilelist | `firelands-map-extractor-vmap` | Tool 1 — ADT/WDT → `maps/*.map` | **Implementado** |
| Extracción VMap4 | `firelands-vmap4-extractor` | Tool 2 — `Buildings/` | **Portado** |
| Ensamblado VMap4 | `firelands-vmap4-assembler` | Tool 3 — `vmaps/` | **Implementado** |
| Generación MMAP | `firelands-mmap-generator` | Tool 4 — `mmaps/` (Recast/Detour) | **No iniciado** |
| Colisión runtime | `world` | `IMapCollisionQueries` | **Solo stub** |

### Dos "map extractors"

| Binario | Ubicación | Salida |
|---------|-----------|--------|
| `firelands-map-extractor` | `tools/extractors/` | Archivos cliente raw bajo `World/maps/…` |
| `firelands-map-extractor-vmap` | `tools/vmap/map_extractor/` | Servidor `maps/<id><yy><xx>.map` + `<id>.tilelist` |

## Pipeline de colisión (end-to-end)

```
WoW 4.3.4 Data/  (cadena MPQ vía StormLib)
        │
        ▼
  Tool 1: firelands-map-extractor-vmap  →  maps/*.map + *.tilelist
        │
        ▼
  Tool 2: firelands-vmap4-extractor     →  Buildings/
        │
        ▼
  Tool 3: firelands-vmap4-assembler     →  vmaps/
        │
        ▼
  Tool 4: firelands-mmap-generator      →  mmaps/  (Recast/Detour)
        │
        ▼
  worldserver: cargadores VMap + Detour → IMapCollisionQueries real
```

**Orden de ejecución:** Tool 1 → 2 → 3 → 4 para un dataset de colisión completo. Tool 4 requiere salidas de Tool 1 y Tool 3.

## Constantes mágicas (deben coincidir con referencia)

| Constante | Valor | Usado en |
|-----------|-------|----------|
| `MAP_MAGIC` | `"MAPS"` | Tiles `.map` del servidor |
| `VMAP_MAGIC` | `"VMAP"` | Headers de árbol/tile VMap |
| `MMAP_MAGIC` | `"MMAP"` | Tiles navmesh |

Definidas en `VMapDefinitions.h` de referencia; nuestro port debe usar valores idénticos.

## Integración runtime

Hoy `worldserver.yaml` establece `Collision.DataRoot` pero **`MapCollisionQueriesStub`** devuelve defaults seguros. Criterios de cierre:

1. Generar dataset de colisión con Tools 1–4 contra un cliente 4.3.4
2. Portar `VMapManager2` + cargador Detour mmap desde referencia
3. Cablear implementación `IMapCollisionQueries`; eliminar stub
4. Pruebas de integración: línea de visión, consultas de altura, spot-checks de pathfinding

## Configuración

En `worldserver.yaml`:

```yaml
Collision:
  DataRoot: "/path/to/collision-output"
```

Layout esperado bajo `DataRoot`: `maps/`, `vmaps/`, `mmaps/` (coincidiendo con árbol de datos del servidor de referencia).

## Relacionado

- [Extractores](/wiki/es/docs/extractors/) — CLI MPQ/DBC y TUI
- [StormLib](/wiki/es/docs/storm-lib/) — fase 1 MPQ
- [Módulo: Infrastructure](/wiki/es/docs/modules-infrastructure/) — `MapCollisionQueriesStub`
- [Roadmap](/wiki/es/docs/roadmap/) — estado de paridad de colisión
