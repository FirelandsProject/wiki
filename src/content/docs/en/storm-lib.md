---
title: 'StormLib Roadmap'
description: 'MPQ extractors for Cataclysm 4.3.4 — DBC and raw map extraction plan'
pubDate: '2025-01-01'
updatedDate: '2026-05-23'
---

# StormLib roadmap — DBC & map extractors

> **Status tracking:** MPQ extractor milestones are summarized on the [Core Roadmap](/wiki/docs/roadmap/#extractors--collision-pipeline). Update that page when milestones close.

Implementation plan for game data extractors in **firelands-next**, aligned with **MPQ-based** Cataclysm clients (not CASC). Wire and file formats target build **15595**.

## Deliverables

| Deliverable | Meaning for 4.3.4 |
|-------------|---------------------|
| **DBC extractor** | Open client MPQs, apply patch order, extract `DBFilesClient\*.dbc` (and `.db2`) |
| **Map extractor (phase 1)** | Raw world assets: `*.wdt`, `*.adt`, `*.wdl` under `World\maps\` |
| **Map extractor (phase 2)** | Server `.map` / vmap / mmap — see [VMap pipeline](/wiki/docs/vmap-pipeline/) |

**StormLib** covers **MPQ only** (open, find, read). Parsing DBC/ADT internals is our code.

## Library versions

### StormLib

- Source: [ladislav-zezula/StormLib](https://github.com/ladislav-zezula/StormLib)
- **Policy:** Pin a **release tag** in CMake (`FetchContent`). Do **not** track `master`.
- Cataclysm retail MPQs use **MPQ format v3/v4**; StormLib **9.x** required.
- Pinned in root `CMakeLists.txt`: **9.26**

### Zlib / BZip2

StormLib needs both for Blizzard-compressed blocks. Project uses system ZLIB; BZip2 linked per StormLib CMake.

### Toolchain

- **C++20**, CMake ≥ 3.10
- Extractors are **standalone executables** — do **not** link StormLib into `auth` / `world` unless there is a deliberate runtime MPQ need

## Functional reference (4.3.4)

- **Patch order:** base → expansion → `patch-*` → locale archives; **last** archive wins for a path
- **Paths:** Blizzard `\` separators in listings; normalize in code
- Key roots:
  - DBC: `DBFilesClient\*.dbc`
  - Maps: `World\maps\<Map>\<Map>.wdt`, `World\maps\<Map>\<Map>_<x>_<y>.adt`

## Technical design

### Shared MPQ module

Thin C++ wrapper: open archive, masked find, read to memory or stream to disk; path normalization.

### DBC extractor

- Input: `Data` directory or explicit MPQ list
- Output: mirror under `DBFilesClient/` (configurable)
- Optional: `--only Spell.dbc,...`

### Map extractor (phase 1)

Extract WDT/ADT/WDL per map into `maps/<Map>/...`.

### Map extractor (phase 2)

Server `.map` + vmap/mmap pipeline — separate milestone; see [VMap pipeline](/wiki/docs/vmap-pipeline/).

## Repository integration

- CMake: `tools/extractors/` with `FetchContent` for StormLib (`STORM_BUILD_TESTS=OFF`)
- Binaries: `firelands-dbc-extractor`, `firelands-map-extractor`, `firelands-extractors` (TUI)
- Tests under `tests/unit/vmap/` and extractor smoke tests

## Risks

| Risk | Mitigation |
|------|------------|
| Wrong patch order | Print open order with `--list-mpqs`; unit-test chain |
| Missing locale MPQ | Document required archives for full DBC |
| StormLib API drift | Pin tag; upgrade in dedicated PR |

## Related

- [Extractors](/wiki/docs/extractors/) — usage guide
- [VMap pipeline](/wiki/docs/vmap-pipeline/) — phase 2 collision tools
- [Developer Setup](/wiki/docs/developer-setup/) — `Data.DbcPath` in world config
