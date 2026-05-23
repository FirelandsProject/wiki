---
title: 'Extractors'
description: 'Client data extractors for Cataclysm 4.3.4 MPQ archives'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# Client data extractors (4.3.4 / MPQ)

Tools read a retail **Cataclysm** `World of Warcraft/Data` folder (MPQ archives, not CASC) using **StormLib v9.26** (pinned in root `CMakeLists.txt`).

## Prerequisites

- CMake build of firelands-next (same toolchain as servers)
- System **zlib** and **bzip2** dev packages (StormLib links them)

## Binaries

| Target | Purpose |
|--------|---------|
| **`firelands-extractors`** | Fullscreen **TUI launcher** (FTXUI): pick DBC/maps/list MPQs, edit paths, run |
| `firelands-dbc-extractor` | Extract `DBFilesClient\*.dbc` and `*.db2` |
| `firelands-map-extractor` | Raw map assets (WDT/ADT/WDL) from MPQs |

Build output: `${CMAKE_BINARY_DIR}/bin/`

## TUI launcher

Run with **no arguments** from an interactive terminal:

```bash
./firelands-extractors
```

Choose operation, set **WoW Data** and **output folder**, then **Run**. Scroll with PgUp/PgDn; **Q** exits when idle. Without a TTY (CI/pipes), use dedicated CLIs below.

## CLI mode (scripts / CI)

List MPQ patch order:

```bash
./firelands-dbc-extractor --data "/path/to/WoW/Data" --list-mpqs
```

Extract all DBC/DB2 tables:

```bash
./firelands-dbc-extractor --data "/path/to/WoW/Data" --out ./client-dbc
```

Extract raw map files:

```bash
./firelands-map-extractor --data "/path/to/WoW/Data" --out ./client-maps
```

## MPQ ordering

Archives under `Data` are sorted for **patch overlay**: first file = base archive; each following file is applied with `SFileOpenPatchArchive` so later entries override earlier ones for the same path.

Details: [StormLib roadmap](/wiki/docs/storm-lib/).

## Server collision pipeline

Raw MPQ extract is separate from **server** `.map` / vmap / mmap generation. See [VMap pipeline](/wiki/docs/vmap-pipeline/) for Tools 1–4 and runtime collision integration.

## Related

- [Developer Setup](/wiki/docs/developer-setup/) — DBC path in `worldserver.yaml`
- [StormLib](/wiki/docs/storm-lib/)
- [VMap pipeline](/wiki/docs/vmap-pipeline/)
