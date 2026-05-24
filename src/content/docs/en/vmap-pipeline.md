---
title: 'VMap Pipeline'
description: 'Client data and collision extractors — server .map, vmap, mmap master plan'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Client data & collision extractors

> **Status tracking:** live progress for Tools 1–4 and runtime collision is on the [Core Roadmap](/wiki/docs/roadmap/#extractors--collision-pipeline). Update that page when milestones close; this doc keeps technical detail.

**Strategy:** Full in-tree C++ implementation — zero wrapped binaries for the collision pipeline.

**Primary goal:** Client-compatible **server collision artifacts** (`.map`, `vmaps/`, `mmaps/`) so **`VMapManager2` / mmap runtime** replaces `MapCollisionQueriesStub`.

**Client target:** WoW **4.3.4 / build 15595**.

## Scope overview

| Area | Target | Purpose | Status |
|------|--------|---------|--------|
| MPQ + patch order | `FirelandsExtractCommon` | `MpqPatchChain`, `WowDataMpqList` | **Done** |
| DBC / DB2 extract | `firelands-dbc-extractor` | `DBFilesClient` → output tree | **Done** |
| Raw client maps | `firelands-map-extractor` | WDT/ADT/WDL from MPQs | **Done** |
| TUI launcher | `firelands-extractors` | FTXUI: DBC + raw maps | **Partial** |
| Shared vmap math | `FirelandsVmapCommon` | BIH, DBC reader, `ModelSpawn` | **Done** |
| Server `.map` + tilelist | `firelands-map-extractor-vmap` | Tool 1 — ADT/WDT → `maps/*.map` | **Implemented** |
| VMap4 extract | `firelands-vmap4-extractor` | Tool 2 — `Buildings/` | **Ported** |
| VMap4 assemble | `firelands-vmap4-assembler` | Tool 3 — `vmaps/` | **Implemented** |
| MMAP generate | `firelands-mmap-generator` | Tool 4 — `mmaps/` (Recast/Detour) | **Not started** |
| Runtime collision | `world` | `IMapCollisionQueries` | **Stub only** |

### Two “map extractors”

| Binary | Location | Output |
|--------|----------|--------|
| `firelands-map-extractor` | `tools/extractors/` | Raw client files under `World/maps/…` |
| `firelands-map-extractor-vmap` | `tools/vmap/map_extractor/` | Server `maps/<id><yy><xx>.map` + `<id>.tilelist` |

## Collision pipeline (end-to-end)

```
WoW 4.3.4 Data/  (MPQ chain via StormLib)
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
  worldserver: VMap + Detour loaders → real IMapCollisionQueries
```

**Run order:** Tool 1 → 2 → 3 → 4 for a full collision dataset. Tool 4 requires Tool 1 and Tool 3 outputs.

## Magic constants (format must match client tooling)

| Constant | Value | Used in |
|----------|-------|---------|
| `MAP_MAGIC` | `"MAPS"` | Server `.map` tiles |
| `VMAP_MAGIC` | `"VMAP"` | VMap tree/tile headers |
| `MMAP_MAGIC` | `"MMAP"` | Navmesh tiles |

Defined in `VMapDefinitions.h` under `tools/vmap/`; all extractors must use identical values.

## Runtime integration

Today `worldserver.yaml` sets `Collision.DataRoot` but **`MapCollisionQueriesStub`** returns safe defaults. Closing criteria:

1. Generate collision dataset with Tools 1–4 against a 4.3.4 client
2. Wire `VMapManager2` + Detour mmap loader in `world`
3. Wire `IMapCollisionQueries` implementation; remove stub
4. Integration tests: line-of-sight, height queries, pathfinding spot-checks

## Configuration

In `worldserver.yaml`:

```yaml
Collision:
  DataRoot: "/path/to/collision-output"
```

Expected layout under `DataRoot`: `maps/`, `vmaps/`, `mmaps/` (standard Cataclysm server data layout).

## Related

- [Extractors](/wiki/docs/extractors/) — MPQ/DBC CLI and TUI
- [StormLib](/wiki/docs/storm-lib/) — MPQ phase 1
- [Module: Infrastructure](/wiki/docs/modules-infrastructure/) — `MapCollisionQueriesStub`
- [Roadmap](/wiki/docs/roadmap/) — collision parity status
